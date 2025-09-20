import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import { desc } from 'drizzle-orm'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'

type ExportLinksOutput = {
  reportUrl: string
}

export async function exportLinks(): Promise<ExportLinksOutput> {
  const { sql, params } = db
    .select({
      originalUrl: schema.links.originalUrl,
      slug: schema.links.slug,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .orderBy(desc(schema.links.createdAt))
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(5)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'original_url', header: 'URL Original' },
      { key: 'slug', header: 'URL Encurtada' },
      { key: 'access_count', header: 'Contagem de Acessos' },
      { key: 'created_at', header: 'Data de Criação' },
    ],
  })

  const toCsvShape = new Transform({
    objectMode: true,
    transform(
      chunks: Array<{
        original_url: string
        short_url: string
        access_count: number | null
        created_at: Date
        id: number
      }>,
      _enc,
      cb
    ) {
      for (const row of chunks) {
        this.push(row)
      }
      cb()
    },
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCSVPipeline = pipeline(
    cursor,
    toCsvShape,
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'downloads',
    fileName: `${new Date().toISOString()}-links.csv`,
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline])

  return { reportUrl: url }
}
