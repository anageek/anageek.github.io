'use server'
import 'server-only'
import { db } from '@/lib/db'
import { categories, projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { withAuth } from '@/lib/auth/guards'
import { categoryFormSchema } from '../types/category'

export const createCategory = withAuth(async (data: unknown) => {
  const parsed = categoryFormSchema.parse(data)

  const existing = db.select().from(categories).where(eq(categories.slug, parsed.slug)).get()
  if (existing) {
    return { success: false as const, error: 'Slug já existe' }
  }

  const category = db.insert(categories).values({
    slug: parsed.slug,
    label: parsed.label,
    icon: parsed.icon,
    visible: parsed.visible,
  }).returning().get()

  return { success: true as const, data: category }
})

export const updateCategory = withAuth(async (id: number, data: unknown) => {
  const parsed = categoryFormSchema.parse(data)
  db.update(categories).set({
    label: parsed.label,
    icon: parsed.icon,
    visible: parsed.visible,
    updatedAt: new Date().toISOString(),
  }).where(eq(categories.id, id)).run()

  return { success: true as const }
})

export const deleteCategory = withAuth(async (id: number) => {
  const categoryProjects = db.select().from(projects).where(eq(projects.categoryId, id)).all()

  if (categoryProjects.length > 0) {
    return { success: false as const, error: 'Category has associated projects. Remove them first.' }
  }

  db.delete(categories).where(eq(categories.id, id)).run()
  return { success: true as const }
})
