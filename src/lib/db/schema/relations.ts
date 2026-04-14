import { relations } from 'drizzle-orm'
import { categories } from './categories'
import { projects } from './projects'
import { projectImages } from './project-images'
import { projectSections } from './project-sections'
import { sectionBlocks } from './section-blocks'

export const categoriesRelations = relations(categories, ({ many }) => ({
  projects: many(projects),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
  images: many(projectImages),
  sections: many(projectSections),
}))

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}))

export const projectSectionsRelations = relations(projectSections, ({ one, many }) => ({
  project: one(projects, {
    fields: [projectSections.projectId],
    references: [projects.id],
  }),
  blocks: many(sectionBlocks),
}))

export const sectionBlocksRelations = relations(sectionBlocks, ({ one }) => ({
  section: one(projectSections, {
    fields: [sectionBlocks.sectionId],
    references: [projectSections.id],
  }),
}))
