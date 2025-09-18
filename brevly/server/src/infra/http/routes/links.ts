import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

const slugRegex = /^brev\.ly\/[a-zA-Z0-9._-]{3,60}$/

const LinkBase = z.object({
  id: z.string().nonempty(),
  slug: z.string().regex(slugRegex),
  originalUrl: z.url(),
  accessCount: z.number().int().nonnegative(),
  createdAt: z.iso.datetime(),
})

const CreateLinkBody = z.object({
  originalUrl: z.url(),
  slug: z.string().regex(slugRegex),
})

export const linksRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a short link',
        body: CreateLinkBody,
        response: {
          201: LinkBase,
          409: z.object({ message: z.literal('slug already exists') }),
        },
      },
    },
    async (req, reply) => {
      const { originalUrl, slug } = req.body

      const exists = await db.query.links.findFirst({
        where: eq(schema.links.slug, slug),
      })

      if (exists) {
        return reply.status(409).send({ message: 'slug already exists' })
      }

      const [created] = await db
        .insert(schema.links)
        .values({ slug, originalUrl })
        .returning()

      return reply.status(201).send({
        id: created.id,
        slug: created.slug,
        originalUrl: created.originalUrl,
        accessCount: created.accessCount ?? 0,
        createdAt: created.createdAt.toISOString(),
      })
    }
  )
  server.delete(
    '/links/:linkId',
    {
      schema: {
        summary: 'Delete link by link id',
        params: z.object({
          linkId: z.string().nonempty(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (req, reply) => {
      const { linkId } = req.params
      await db.delete(schema.links).where(eq(schema.links.id, linkId))
      return reply.status(204).send()
    }
  )
}
