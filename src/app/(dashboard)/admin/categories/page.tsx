import type { Metadata } from 'next'
import { getAdminCategories } from '@/features/categories'
import { CategoryList } from '@/features/categories'

export const metadata: Metadata = { title: 'Categories — Admin' }

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()
  return <CategoryList categories={categories} />
}
