import { getAdminCategories } from '@/features/categories'
import { ProjectForm } from '@/features/projects'

export default async function NewProjectPage() {
  const categories = await getAdminCategories()
  return <ProjectForm categories={categories} />
}
