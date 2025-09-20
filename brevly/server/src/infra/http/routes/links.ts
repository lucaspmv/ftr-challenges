import { eq, sql } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { exportLinks } from '@/app/functions/export-links'
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

const SlugParams = z.object({
  slug: z.string().nonempty(),
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
    '/links/:slug',
    {
      schema: {
        summary: 'Delete link by slug',
        params: SlugParams,
        response: {
          204: z.void(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (req, reply) => {
      const { slug } = req.params

      const deleted = await db
        .delete(schema.links)
        .where(eq(schema.links.slug, `brev.ly/${slug}`))
        .returning({ id: schema.links.id })

      if (deleted.length === 0) {
        return reply.status(404).send({ message: 'Link não encontrado' })
      }

      return reply.status(204).send()
    }
  )
  server.get(
    '/links',
    {
      schema: {
        summary: 'List links',
        response: {
          200: z.object({
            data: z.array(LinkBase),
          }),
        },
      },
    },
    async (_req, reply) => {
      const rows = await db.query.links.findMany()

      const data = rows.map(r => ({
        id: r.id,
        slug: r.slug,
        originalUrl: r.originalUrl,
        accessCount: r.accessCount ?? 0,
        createdAt: r.createdAt?.toISOString?.(),
      }))

      return reply.status(200).send({ data })
    }
  )
  server.get(
    '/links/:slug',
    {
      schema: {
        summary: 'Get link by slug',
        params: SlugParams,
        response: {
          200: z.object({
            data: LinkBase,
          }),
          404: z.object({ message: z.literal('not found') }),
        },
      },
    },
    async (req, reply) => {
      const { slug } = req.params
      const found = await db.query.links.findFirst({
        where: eq(schema.links.slug, `brev.ly/${slug}`),
      })
      if (!found) return reply.status(404).send({ message: 'not found' })

      const data = {
        ...found,
        createdAt: found.createdAt?.toISOString?.(),
      }

      return reply.status(200).send({
        data,
      })
    }
  )
  server.patch(
    '/links/:slug/access',
    {
      schema: {
        summary: 'Increment access count',
        params: SlugParams,
        response: {
          204: z.void(),
          404: z.object({ message: z.literal('not found') }),
        },
      },
    },
    async (req, reply) => {
      const { slug } = req.params

      const updated = await db
        .update(schema.links)
        .set({
          accessCount: sql`${schema.links.accessCount} + 1`,
        })
        .where(eq(schema.links.slug, `brev.ly/${slug}`))
        .returning()

      if (!updated[0]) {
        return reply.status(404).send({ message: 'not found' })
      }

      return reply.status(204).send()
    }
  )
  server.post(
    '/links/exports',
    {
      schema: {
        summary: 'Export links CSV to R2 and return public URL',
        response: {
          200: z.object({
            reportUrl: z.url(),
          }),
        },
      },
    },
    async (_req, reply) => {
      const { reportUrl } = await exportLinks()
      return reply.status(200).send({ reportUrl })
    }
  )
}
