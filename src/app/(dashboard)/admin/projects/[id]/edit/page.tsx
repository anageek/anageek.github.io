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

  return <ProjectForm project={project} categories={categories} />
}
