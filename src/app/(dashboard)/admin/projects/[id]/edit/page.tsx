import { getAdminProjectById } from '@/features/projects'
import { getAdminCategories } from '@/features/categories'
import { ProjectForm } from '@/features/projects'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const numericId = parseInt(id, 10)

  if (isNaN(numericId)) notFound()

  const [project, categories] = await Promise.all([
    getAdminProjectById(numericId),
    getAdminCategories(),
  ])

  if (!project) notFound()

  // Transform Drizzle relations into flat form values
  const projectForForm = {
    id: project.id,
    categoryId: project.categoryId,
    title: project.title,
    role: project.role ?? '',
    company: project.company ?? '',
    status: project.status ?? '',
    subCategory: project.subCategory ?? '',
    platform: project.platform ?? [],
    description: project.description ?? '',
    tools: project.tools ?? '',
    coverImage: project.coverImage ?? '',
    coverAnimated: project.coverAnimated ?? '',
    videoUrl: project.videoUrl ?? '',
    designUrl: project.designUrl ?? '',
    designBtnLabel: project.designBtnLabel ?? '',
    visible: project.visible,
    featured: project.featured,
    // Convert ProjectImage[] → string[]
    images: (project.images ?? []).map((img) => img.url),
    // Convert DB sections with blocks → form sections
    sections: (project.sections ?? []).map((s) => ({
      title: s.title,
      image: s.image ?? '',
      video: s.video ?? '',
      blocks: (s.blocks ?? []).map((b) => ({
        type: b.type,
        text: b.text ?? '',
        image: b.image ?? '',
        video: b.video ?? '',
        items: b.items ?? undefined,
      })),
    })),
  }

  return <ProjectForm project={projectForForm} categories={categories} />
}
