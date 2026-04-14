'use server'
import 'server-only'
import { db } from '@/lib/db'
import { projects, projectImages, projectSections, sectionBlocks } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { withAuth } from '@/lib/auth/guards'
import { projectFormSchema } from '../types/project'
import { slugify } from '@/lib/utils'

export const createProject = withAuth(async (data: unknown) => {
  const parsed = projectFormSchema.parse(data)

  const project = await db.transaction(async (tx) => {
    const [newProject] = await tx.insert(projects).values({
      slug: slugify(parsed.title),
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
    }).returning()

    if (parsed.images?.length) {
      await tx.insert(projectImages).values(
        parsed.images.map((url, i) => ({ projectId: newProject.id, url, sortOrder: i }))
      )
    }

    for (const [sIdx, section] of parsed.sections.entries()) {
      const [newSection] = await tx.insert(projectSections).values({
        projectId: newProject.id,
        title: section.title,
        image: section.image || null,
        video: section.video || null,
        sortOrder: sIdx,
      }).returning()

      if (section.blocks?.length) {
        await tx.insert(sectionBlocks).values(
          section.blocks.map((block, bIdx) => ({
            sectionId: newSection.id,
            type: block.type,
            text: block.text || null,
            image: block.image || null,
            video: block.video || null,
            items: block.items || null,
            sortOrder: bIdx,
          }))
        )
      }
    }

    return newProject
  })

  revalidateTag('projects')
  return { success: true as const, data: project }
})

export const updateProject = withAuth(async (id: number, data: unknown) => {
  const parsed = projectFormSchema.parse(data)

  await db.transaction(async (tx) => {
    await tx.update(projects).set({
      categoryId: parsed.categoryId,
      title: parsed.title,
      slug: slugify(parsed.title),
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
    }).where(eq(projects.id, id))

    await tx.delete(projectImages).where(eq(projectImages.projectId, id))
    if (parsed.images?.length) {
      await tx.insert(projectImages).values(
        parsed.images.map((url, i) => ({ projectId: id, url, sortOrder: i }))
      )
    }

    await tx.delete(projectSections).where(eq(projectSections.projectId, id))
    for (const [sIdx, section] of parsed.sections.entries()) {
      const [newSection] = await tx.insert(projectSections).values({
        projectId: id,
        title: section.title,
        image: section.image || null,
        video: section.video || null,
        sortOrder: sIdx,
      }).returning()

      if (section.blocks?.length) {
        await tx.insert(sectionBlocks).values(
          section.blocks.map((block, bIdx) => ({
            sectionId: newSection.id,
            type: block.type,
            text: block.text || null,
            image: block.image || null,
            video: block.video || null,
            items: block.items || null,
            sortOrder: bIdx,
          }))
        )
      }
    }
  })

  revalidateTag('projects')
  return { success: true as const }
})

export const deleteProject = withAuth(async (id: number) => {
  await db.delete(projects).where(eq(projects.id, id))
  revalidateTag('projects')
  return { success: true as const }
})

export const toggleProjectField = withAuth(async (id: number, field: 'visible' | 'featured', value: boolean) => {
  await db.update(projects).set({ [field]: value, updatedAt: new Date().toISOString() }).where(eq(projects.id, id))
  revalidateTag('projects')
  return { success: true as const }
})
