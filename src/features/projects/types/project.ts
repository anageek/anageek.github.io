import { z } from 'zod'
import type { projects, projectImages, projectSections, sectionBlocks, categories } from '@/lib/db/schema'

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectImage = typeof projectImages.$inferSelect
export type ProjectSection = typeof projectSections.$inferSelect
export type SectionBlock = typeof sectionBlocks.$inferSelect
export type Category = typeof categories.$inferSelect

export type ProjectWithRelations = Project & {
  category: Category
  images: ProjectImage[]
  sections: (ProjectSection & { blocks: SectionBlock[] })[]
}

export type ProjectWithCategory = Project & {
  category: Category
  images: ProjectImage[]
}

const sectionBlockFormSchema = z.object({
  type: z.string().min(1, 'Block type is required'),
  text: z.string().optional().default(''),
  image: z.string().optional().default(''),
  video: z.string().optional().default(''),
  items: z.array(z.string()).optional(),
})

const sectionFormSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  image: z.string().optional().default(''),
  video: z.string().optional().default(''),
  blocks: z.array(sectionBlockFormSchema).default([]),
})

export const projectFormSchema = z.object({
  categoryId: z.number({ required_error: 'Category is required' }),
  title: z.string().min(1, 'Title is required'),
  role: z.string().optional().default(''),
  company: z.string().optional().default(''),
  status: z.string().optional().default(''),
  subCategory: z.string().optional().default(''),
  platform: z.array(z.string()).optional().default([]),
  description: z.string().optional().default(''),
  tools: z.string().optional().default(''),
  coverImage: z.string().optional().default(''),
  coverAnimated: z.string().optional().default(''),
  videoUrl: z.string().optional().default(''),
  designUrl: z.string().optional().default(''),
  designBtnLabel: z.string().optional().default(''),
  visible: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  images: z.array(z.string()).optional().default([]),
  sections: z.array(sectionFormSchema).default([]),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>
