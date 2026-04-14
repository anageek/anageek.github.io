'use server'
import 'server-only'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

export const getPublicCategories = unstable_cache(
  async () => {
    return db.query.categories.findMany({
      where: eq(categories.visible, true),
      orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
    })
  },
  ['public-categories'],
  { tags: ['categories'] }
)

export async function getAdminCategories() {
  return db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
    with: { projects: true },
  })
}
