'use server'
import 'server-only'
import { db } from '@/lib/db'
import { categories, projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { withAuth } from '@/lib/auth/guards'
import { categoryFormSchema } from '../types/category'

export const createCategory = withAuth(async (data: unknown) => {
  const parsed = categoryFormSchema.parse(data)
  const [category] = await db.insert(categories).values({
    slug: parsed.slug,
    label: parsed.label,
    icon: parsed.icon,
    visible: parsed.visible,
  }).returning()

  revalidateTag('categories')
  return { success: true as const, data: category }
})

export const updateCategory = withAuth(async (id: number, data: unknown) => {
  const parsed = categoryFormSchema.parse(data)
  await db.update(categories).set({
    label: parsed.label,
    icon: parsed.icon,
    visible: parsed.visible,
    updatedAt: new Date().toISOString(),
  }).where(eq(categories.id, id))

  revalidateTag('categories')
  revalidateTag('projects')
  return { success: true as const }
})

export const deleteCategory = withAuth(async (id: number) => {
  const categoryProjects = await db.query.projects.findMany({
    where: eq(projects.categoryId, id),
  })

  if (categoryProjects.length > 0) {
    return { success: false as const, error: 'Category has associated projects. Remove them first.' }
  }

  await db.delete(categories).where(eq(categories.id, id))
  revalidateTag('categories')
  return { success: true as const }
})
