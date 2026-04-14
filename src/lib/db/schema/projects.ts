import { pgTable, serial, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core'
import { categories } from './categories'

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }),
  company: varchar('company', { length: 255 }),
  status: varchar('status', { length: 100 }),
  subCategory: varchar('sub_category', { length: 100 }),
  platform: text('platform').array(),
  description: text('description'),
  tools: varchar('tools', { length: 500 }),
  coverImage: text('cover_image'),
  coverAnimated: text('cover_animated'),
  videoUrl: text('video_url'),
  designUrl: text('design_url'),
  designBtnLabel: varchar('design_btn_label', { length: 100 }),
  visible: boolean('visible').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
