'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Edit2, Save, Loader2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChevronTabs } from '@/components/ui/chevron-tabs'
import { useProjectForm } from '@/features/projects/hooks/use-project-form'
import { createProject, updateProject } from '@/features/projects'
import { toast } from 'sonner'
import { OverviewTab } from './overview-tab'
import { ContentTab } from './content-tab'
import { ProjectPreview } from '../project-preview'
import { projectFormSchema } from '@/features/projects/types/project'
import type { ProjectFormValues } from '@/features/projects/types/project'
import type { Category } from '@/features/projects/types/project'

interface ProjectFormProps {
  project?: Partial<ProjectFormValues> & { id?: number }
  categories: Category[]
}

export function ProjectForm({ project, categories }: ProjectFormProps) {
  const router = useRouter()
  const [showPreview, setShowPreview] = useState(false)

  const {
    form,
    activeTab,
    setActiveTab,
    sectionsState,
    isUploading,
    imageFieldArray,
    addSection,
    removeSection,
    reorderSections,
    updateSectionMeta,
    toggleSection,
    toggleSectionSettings,
    addBlock,
    removeBlock,
    updateBlock,
    reorderBlocks,
    updateLayoutConfig,
    addLayoutChild,
    removeLayoutChild,
    updateLayoutChild,
    reorderLayoutColumn,
    handleFieldUpload,
    uploadSectionImage,
    uploadBlockImage,
    uploadGalleryItem,
    syncSectionsToForm,
  } = useProjectForm(project)

  const { isDirty } = form.formState
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty || sectionsState.length > 0) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, sectionsState.length])

  const handleSave = async (data: ProjectFormValues) => {
    setIsSaving(true)
    try {
      if (project?.id) {
        await updateProject(project.id, data)
      } else {
        await createProject(data)
      }
      toast.success(project?.id ? 'Projeto atualizado!' : 'Projeto criado!')
      router.push('/admin/projects')
    } catch {
      toast.error('Erro ao salvar projeto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClickSave = async () => {
    syncSectionsToForm()

    // Small delay to let setValue settle
    await new Promise((r) => setTimeout(r, 0))

    const rawData = form.getValues()

    // Ensure blocks always have a type
    if (rawData.sections) {
      rawData.sections = rawData.sections.map((s) => ({
        ...s,
        blocks: (s.blocks ?? []).map((b) => ({
          ...b,
          type: b.type || 'paragraph',
        })),
      }))
    }

    const result = projectFormSchema.safeParse(rawData)
    if (!result.success) {
      const firstError = result.error.errors[0]
      const path = firstError.path.filter((p) => typeof p === 'string').join(' → ')
      toast.error(path ? `${path}: ${firstError.message}` : firstError.message)
      console.error('[ProjectForm] Zod errors:', result.error.flatten())
      return
    }
    await handleSave(result.data)
  }

  const handleDiscard = () => {
    router.push('/admin/projects')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex flex-col">

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/admin/projects" className="hover:text-white transition-colors">
            Projetos
          </Link>
          <span>/</span>
          <span className="text-zinc-300">
            {project?.id ? `Editar: ${project.title ?? ''}` : 'Novo Projeto'}
          </span>
        </nav>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="p-8 pb-0 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tighter">
                {project?.id ? 'Edit Project' : 'New Project'}
              </h1>
              <p className="text-zinc-500 text-xs font-medium mt-0.5">
                Configure todas as propriedades e visualizações da página do projeto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDiscard}
              className="text-zinc-500 font-bold text-xs uppercase tracking-widest px-6 hover:bg-zinc-900"
            >
              DESCARTAR
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest px-5 h-10 rounded-xl border border-zinc-800 hover:bg-zinc-900 hover:text-white"
            >
              <Eye className="w-4 h-4" />
              PREVIEW
            </Button>

            <Button
              type="button"
              disabled={isSaving}
              onClick={handleClickSave}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest px-8 h-10 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  PUBLICAR ALTERAÇÕES
                </>
              )}
            </Button>
          </div>
        </div>

        <ChevronTabs
          active={activeTab}
          tabs={['Overview', 'Content']}
          onChange={(t) => setActiveTab(t as 'overview' | 'content')}
        />
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <OverviewTab
            form={form}
            categories={categories}
            isUploading={isUploading}
            onFieldUpload={handleFieldUpload}
          />
        )}

        {activeTab === 'content' && (
          <ContentTab
            form={form}
            imageFieldArray={
              imageFieldArray as unknown as {
                fields: { id: string }[]
                append: (v: unknown) => void
                remove: (i: number) => void
              }
            }
            sectionsState={sectionsState}
            isUploading={isUploading}
            onAddSection={addSection}
            onRemoveSection={removeSection}
            onReorderSections={reorderSections}
            onUpdateSectionMeta={updateSectionMeta}
            onToggleSection={toggleSection}
            onToggleSectionSettings={toggleSectionSettings}
            onAddBlock={addBlock}
            onRemoveBlock={removeBlock}
            onUpdateBlock={updateBlock}
            onReorderBlocks={reorderBlocks}
            onUpdateLayoutConfig={updateLayoutConfig}
            onAddLayoutChild={addLayoutChild}
            onRemoveLayoutChild={removeLayoutChild}
            onUpdateLayoutChild={updateLayoutChild}
            onReorderLayoutColumn={reorderLayoutColumn}
            onUploadSectionImage={uploadSectionImage}
            onUploadBlockImage={uploadBlockImage}
            onUploadGalleryItem={uploadGalleryItem}
            onFieldUpload={handleFieldUpload}
          />
        )}
      </div>

      {/* ── Preview overlay ──────────────────────────────────────────────────── */}
      {showPreview && (
        <ProjectPreview
          sectionsState={sectionsState}
          projectTitle={form.getValues('title') || project?.title || ''}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}
