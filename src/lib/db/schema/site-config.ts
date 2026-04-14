import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const siteConfig = sqliteTable('site_config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').unique().notNull(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP').notNull(),
})
