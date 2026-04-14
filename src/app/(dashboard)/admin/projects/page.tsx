import { getAdminProjects } from '@/features/projects'
import { getAdminCategories } from '@/features/categories'
import { ProjectTable } from '@/features/projects'

export default async function AdminProjectsPage() {
  const [projects, categories] = await Promise.all([
    getAdminProjects(),
    getAdminCategories(),
  ])

  return <ProjectTable projects={projects} categories={categories} />
}
