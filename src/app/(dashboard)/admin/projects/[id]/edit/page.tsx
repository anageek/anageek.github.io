import { getAdminProjectById } from '@/features/projects'
import { getAdminCategories } from '@/features/categories'
import { ProjectForm } from '@/features/projects'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const [project, categories] = await Promise.all([
    getAdminProjectById(Number(id)),
    getAdminCategories(),
  ])

  if (!project) notFound()

  // Convert null fields from Drizzle to undefined for the form
  const projectForForm = Object.fromEntries(
    Object.entries(project).map(([k, v]) => [k, v === null ? undefined : v])
  ) as Partial<Parameters<typeof ProjectForm>[0]['project']> & { id?: number }

  return <ProjectForm project={projectForForm} categories={categories} />
}
