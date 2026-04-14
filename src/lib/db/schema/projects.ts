import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { categories } from './categories'

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').unique().notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  title: text('title').notNull(),
  role: text('role'),
  company: text('company'),
  status: text('status'),
  subCategory: text('sub_category'),
  platform: text('platform', { mode: 'json' }).$type<string[]>(),
  description: text('description'),
  tools: text('tools'),
  coverImage: text('cover_image'),
  coverAnimated: text('cover_animated'),
  videoUrl: text('video_url'),
  designUrl: text('design_url'),
  designBtnLabel: text('design_btn_label'),
  visible: integer('visible', { mode: 'boolean' }).default(true).notNull(),
  featured: integer('featured', { mode: 'boolean' }).default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP').notNull(),
})
