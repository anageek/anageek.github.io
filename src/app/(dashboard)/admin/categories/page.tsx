import { getAdminCategories } from '@/features/categories'
import { CategoryList } from '@/features/categories'

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()
  return <CategoryList categories={categories} />
}
