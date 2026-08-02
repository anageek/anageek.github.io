import type { Metadata } from 'next'
import { getProjectBySlug, getPublicProjects } from '@/features/projects'
import { getPublicCategories } from '@/features/categories'
import { ProjectDetail } from '@/features/projects'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const projects = await getPublicProjects()
  return projects
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug! }))
}

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

  const [project, allProjects, allCategories] = await Promise.all([
    getProjectBySlug(slug),
    getPublicProjects(),
    getPublicCategories(),
  ])

  if (!project) notFound()

  const simpleProjects = allProjects.map((p) => ({
    slug: p.slug ?? '',
    title: p.title,
    category: p.category
      ? { slug: p.category.slug, label: p.category.label }
      : null,
  })).filter((p) => p.slug)

  return (
    <ProjectDetail
      project={project}
      allProjects={simpleProjects}
      allCategories={allCategories.map((c) => ({ slug: c.slug, label: c.label }))}
    />
  )
}
