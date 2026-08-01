import { getAdminCategories } from '@/features/categories'
import { getAdminProjectById } from '@/features/projects'
import { ProjectForm } from '@/features/projects'

interface Props {
  searchParams: Promise<{ from?: string }>
}

export default async function NewProjectPage({ searchParams }: Props) {
  const { from } = await searchParams
  const categories = await getAdminCategories()

  let initialData = undefined
  if (from) {
    const source = await getAdminProjectById(Number(from))
    if (source) {
      // Strip id so it creates a new project, prefix title with "Copy of"
      initialData = {
        categoryId: source.categoryId,
        title: `Copy of ${source.title}`,
        role: source.role ?? '',
        company: source.company ?? '',
        status: source.status ?? '',
        subCategory: source.subCategory ?? '',
        platform: source.platform ?? [],
        description: source.description ?? '',
        tools: source.tools ?? '',
        coverImage: source.coverImage ?? '',
        coverAnimated: source.coverAnimated ?? '',
        videoUrl: source.videoUrl ?? '',
        designUrl: source.designUrl ?? '',
        designBtnLabel: source.designBtnLabel ?? '',
        visible: source.visible,
        featured: false,
        images: (source.images ?? []).map((img: { url: string }) => img.url),
        sections: (source.sections ?? []).map((s: { title: string; image?: string | null; video?: string | null; columns?: number | null; breakpoint?: string | null; blocks: Array<{ type: string; text?: string | null; image?: string | null; video?: string | null; items?: string[] | null; columnIndex?: number | null }> }) => ({
          title: s.title,
          image: s.image ?? '',
          video: s.video ?? '',
          columns: s.columns ?? 1,
          breakpoint: s.breakpoint ?? 'md',
          blocks: (s.blocks ?? []).map((b: { type: string; text?: string | null; image?: string | null; video?: string | null; items?: string[] | null; columnIndex?: number | null }) => ({
            type: b.type,
            text: b.text ?? '',
            image: b.image ?? '',
            video: b.video ?? '',
            items: b.items ?? undefined,
            columnIndex: b.columnIndex ?? 0,
          })),
        })),
      }
    }
  }

  return <ProjectForm project={initialData} categories={categories} />
}
