'use server'
import 'server-only'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getPublicCategories() {
  return db.query.categories.findMany({
    where: eq(categories.visible, true),
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
  })
}

export async function getAdminCategories() {
  return db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
    with: { projects: true },
  })
}
