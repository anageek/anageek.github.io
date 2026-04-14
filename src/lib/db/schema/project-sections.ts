import { pgTable, serial, integer, varchar, text } from 'drizzle-orm/pg-core'
import { projects } from './projects'

export const projectSections = pgTable('project_sections', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  image: text('image'),
  video: text('video'),
  sortOrder: integer('sort_order').default(0).notNull(),
})
