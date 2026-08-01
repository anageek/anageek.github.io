import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { projects } from './projects'

export const projectSections = sqliteTable('project_sections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  image: text('image'),
  video: text('video'),
  columns: integer('columns').default(1).notNull(),
  breakpoint: text('breakpoint').default('md').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
})
