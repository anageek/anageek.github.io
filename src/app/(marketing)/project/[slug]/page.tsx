import { getProjectBySlug } from '@/features/projects'
import { ProjectDetail } from '@/features/projects'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return <ProjectDetail project={project} />
}
