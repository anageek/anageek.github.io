import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { projects } from './projects'

export const projectImages = sqliteTable('project_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
})
