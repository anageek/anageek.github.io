import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const siteConfig = pgTable('site_config', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).unique().notNull(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
