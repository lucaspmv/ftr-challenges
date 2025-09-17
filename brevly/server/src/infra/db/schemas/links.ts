import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const links = pgTable('links', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  originalUrl: varchar('original_url', { length: 2048 }).notNull(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
})
