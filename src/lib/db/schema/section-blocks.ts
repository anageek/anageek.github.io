import { pgTable, serial, integer, varchar, text, jsonb } from 'drizzle-orm/pg-core'
import { projectSections } from './project-sections'

export const sectionBlocks = pgTable('section_blocks', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').references(() => projectSections.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  text: text('text'),
  image: text('image'),
  video: text('video'),
  items: jsonb('items').$type<string[]>(),
  sortOrder: integer('sort_order').default(0).notNull(),
})
