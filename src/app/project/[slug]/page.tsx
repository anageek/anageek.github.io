import type { Metadata } from 'next'
import { getProjectBySlug, getPublicProjects } from '@/features/projects'
import { ProjectDetail } from '@/features/projects'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) return { title: 'Project Not Found' }

  return {
    title: project.title,
    description: project.description?.substring(0, 160) || `${project.title} by Ana Neiva`,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  // Get all visible projects for prev/next navigation
  const allProjects = await getPublicProjects()
  const currentIndex = allProjects.findIndex(p => p.slug === slug)
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  return (
    <ProjectDetail
      project={project}
      prevProjectSlug={prevProject?.slug ?? null}
      nextProjectSlug={nextProject?.slug ?? null}
      currentIndex={currentIndex}
      totalProjects={allProjects.length}
    />
  )
}
