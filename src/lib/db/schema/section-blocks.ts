import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { projectSections } from './project-sections'

export const sectionBlocks = sqliteTable('section_blocks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sectionId: integer('section_id').references(() => projectSections.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(),
  text: text('text'),
  image: text('image'),
  video: text('video'),
  items: text('items', { mode: 'json' }).$type<string[]>(),
  columnIndex: integer('column_index').default(0).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
})
