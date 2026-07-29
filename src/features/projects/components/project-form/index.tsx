'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Edit2, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChevronTabs } from '@/components/ui/chevron-tabs'
import { useProjectForm } from '@/features/projects/hooks/use-project-form'
import { createProject, updateProject } from '@/features/projects'
import { toast } from 'sonner'
import { OverviewTab } from './overview-tab'
import { ContentTab } from './content-tab'
import { SectionEditor } from './section-editor'
import { projectFormSchema } from '@/features/projects/types/project'
import type { ProjectFormValues } from '@/features/projects/types/project'
import type { Category } from '@/features/projects/types/project'

interface ProjectFormProps {
  project?: Partial<ProjectFormValues> & { id?: number }
  categories: Category[]
}

export function ProjectForm({ project, categories }: ProjectFormProps) {
  const router = useRouter()

  const {
    form,
    activeTab,
    setActiveTab,
    sectionDraft,
    setSectionDraft,
    isUploading,
    imageFieldArray,
    sectionFieldArray,
    openSection,
    saveSection,
    addDescBlock,
    removeDescBlock,
    updateDescBlock,
    updateDescListItems,
    handleFieldUpload,
    uploadSectionCoverImage,
    uploadDescBlockImage,
  } = useProjectForm(project)

  const { isDirty } = form.formState
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

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
    const rawData = form.getValues()

    // Garante que blocos sem type não quebram a validação
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

            {activeTab === 'section' ? (
              <Button
                type="button"
                onClick={saveSection}
                className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest px-8 h-10 rounded-xl shadow-lg shadow-primary/20"
              >
                Save Section
              </Button>
            ) : (
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
            )}
          </div>
        </div>

        <ChevronTabs
          active={activeTab}
          tabs={['Overview', 'Content', 'Section']}
          onChange={(t) => {
            if (t === 'section' && activeTab !== 'section') {
              openSection(null)
            } else {
              setActiveTab(t as 'overview' | 'content' | 'section')
            }
          }}
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
            imageFieldArray={imageFieldArray as unknown as { fields: { id: string; [key: string]: unknown }[]; append: (v: unknown) => void; remove: (i: number) => void }}
            sectionFieldArray={sectionFieldArray as unknown as { fields: { id: string; [key: string]: unknown }[]; append: (v: unknown) => void; remove: (i: number) => void }}
            isUploading={isUploading}
            onSectionOpen={openSection}
            onFieldUpload={handleFieldUpload}
          />
        )}

        {activeTab === 'section' && (
          <SectionEditor
            sectionDraft={sectionDraft}
            isUploading={isUploading}
            onTitleChange={(title) => setSectionDraft((p) => ({ ...p, title }))}
            onImageChange={(image) => setSectionDraft((p) => ({ ...p, image: image }))}
            onVideoChange={(video) => setSectionDraft((p) => ({ ...p, video: video }))}
            onAddDescBlock={addDescBlock}
            onRemoveDescBlock={removeDescBlock}
            onUpdateDescBlock={updateDescBlock}
            onUpdateDescListItems={updateDescListItems}
            onUploadSectionImage={uploadSectionCoverImage}
            onUploadDescBlockImage={uploadDescBlockImage}
          />
        )}
      </div>
    </div>
  )
}
