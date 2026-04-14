'use server'
import 'server-only'
import { db } from '@/lib/db'
import { projects, projectImages, projectSections, sectionBlocks, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { withAuth } from '@/lib/auth/guards'
import { projectFormSchema } from '../types/project'
import { slugify } from '@/lib/utils'

export const createProject = withAuth(async (data: unknown) => {
  const parsed = projectFormSchema.parse(data)

  const categoryExists = db.select().from(categories).where(eq(categories.id, parsed.categoryId)).get()
  if (!categoryExists) {
    return { success: false as const, error: 'Categoria não encontrada' }
  }

  let baseSlug = slugify(parsed.title)
  let slug = baseSlug
  const existingSlug = db.select().from(projects).where(eq(projects.slug, slug)).get()
  if (existingSlug) {
    slug = `${baseSlug}-${Date.now()}`
  }

  const newProject = db.insert(projects).values({
    slug,
    categoryId: parsed.categoryId,
    title: parsed.title,
    role: parsed.role || null,
    company: parsed.company || null,
    status: parsed.status || null,
    subCategory: parsed.subCategory || null,
    platform: parsed.platform,
    description: parsed.description || null,
    tools: parsed.tools || null,
    coverImage: parsed.coverImage || null,
    coverAnimated: parsed.coverAnimated || null,
    videoUrl: parsed.videoUrl || null,
    designUrl: parsed.designUrl || null,
    designBtnLabel: parsed.designBtnLabel || null,
    visible: parsed.visible,
    featured: parsed.featured,
  }).returning().get()

  if (parsed.images?.length) {
    db.insert(projectImages).values(
      parsed.images.map((url, i) => ({ projectId: newProject.id, url, sortOrder: i }))
    ).run()
  }

  for (const [sIdx, section] of parsed.sections.entries()) {
    const newSection = db.insert(projectSections).values({
      projectId: newProject.id,
      title: section.title,
      image: section.image || null,
      video: section.video || null,
      sortOrder: sIdx,
    }).returning().get()

    if (section.blocks?.length) {
      db.insert(sectionBlocks).values(
        section.blocks.map((block, bIdx) => ({
          sectionId: newSection.id,
          type: block.type,
          text: block.text || null,
          image: block.image || null,
          video: block.video || null,
          items: block.items || null,
          sortOrder: bIdx,
        }))
      ).run()
    }
  }

  // revalidateTag removed: unstable_cache no longer used
  return { success: true as const, data: newProject }
})

export const updateProject = withAuth(async (id: number, data: unknown) => {
  const parsed = projectFormSchema.parse(data)

  const categoryExists = db.select().from(categories).where(eq(categories.id, parsed.categoryId)).get()
  if (!categoryExists) {
    return { success: false as const, error: 'Categoria não encontrada' }
  }

  let baseSlug = slugify(parsed.title)
  let slug = baseSlug
  const existingSlug = db.select().from(projects).where(eq(projects.slug, slug)).get()
  if (existingSlug && existingSlug.id !== id) {
    slug = `${baseSlug}-${Date.now()}`
  }

  db.update(projects).set({
    categoryId: parsed.categoryId,
    title: parsed.title,
    slug,
    role: parsed.role || null,
    company: parsed.company || null,
    status: parsed.status || null,
    subCategory: parsed.subCategory || null,
    platform: parsed.platform,
    description: parsed.description || null,
    tools: parsed.tools || null,
    coverImage: parsed.coverImage || null,
    coverAnimated: parsed.coverAnimated || null,
    videoUrl: parsed.videoUrl || null,
    designUrl: parsed.designUrl || null,
    designBtnLabel: parsed.designBtnLabel || null,
    visible: parsed.visible,
    featured: parsed.featured,
    updatedAt: new Date().toISOString(),
  }).where(eq(projects.id, id)).run()

  // Replace images
  db.delete(projectImages).where(eq(projectImages.projectId, id)).run()
  if (parsed.images?.length) {
    db.insert(projectImages).values(
      parsed.images.map((url, i) => ({ projectId: id, url, sortOrder: i }))
    ).run()
  }

  // Replace sections + blocks
  // First get existing section IDs to delete their blocks
  const existingSections = db.select().from(projectSections).where(eq(projectSections.projectId, id)).all()
  for (const sec of existingSections) {
    db.delete(sectionBlocks).where(eq(sectionBlocks.sectionId, sec.id)).run()
  }
  db.delete(projectSections).where(eq(projectSections.projectId, id)).run()

  for (const [sIdx, section] of parsed.sections.entries()) {
    const newSection = db.insert(projectSections).values({
      projectId: id,
      title: section.title,
      image: section.image || null,
      video: section.video || null,
      sortOrder: sIdx,
    }).returning().get()

    if (section.blocks?.length) {
      db.insert(sectionBlocks).values(
        section.blocks.map((block, bIdx) => ({
          sectionId: newSection.id,
          type: block.type,
          text: block.text || null,
          image: block.image || null,
          video: block.video || null,
          items: block.items || null,
          sortOrder: bIdx,
        }))
      ).run()
    }
  }

  // revalidateTag removed: unstable_cache no longer used
  return { success: true as const }
})

export const deleteProject = withAuth(async (id: number) => {
  // Delete blocks for each section first
  const sections = db.select().from(projectSections).where(eq(projectSections.projectId, id)).all()
  for (const sec of sections) {
    db.delete(sectionBlocks).where(eq(sectionBlocks.sectionId, sec.id)).run()
  }
  db.delete(projectSections).where(eq(projectSections.projectId, id)).run()
  db.delete(projectImages).where(eq(projectImages.projectId, id)).run()
  db.delete(projects).where(eq(projects.id, id)).run()
  // revalidateTag removed: unstable_cache no longer used
  return { success: true as const }
})

export const toggleProjectField = withAuth(async (id: number, field: 'visible' | 'featured', value: boolean) => {
  db.update(projects).set({ [field]: value, updatedAt: new Date().toISOString() }).where(eq(projects.id, id)).run()
  // revalidateTag removed: unstable_cache no longer used
  return { success: true as const }
})
