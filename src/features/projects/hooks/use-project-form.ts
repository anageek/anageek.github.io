'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { projectFormSchema, type ProjectFormValues } from '@/features/projects/types/project'

export type EditorTab = 'overview' | 'content' | 'section'

export interface DescBlock {
  type?: string
  text?: string
  image?: string
  video?: string
  items?: string[]
}

export interface SectionDraft {
  title: string
  image: string
  video: string
  blocks: DescBlock[]
}

export function useProjectForm(initialValues?: Partial<ProjectFormValues> & { id?: number }) {
  const [activeTab, setActiveTab] = useState<EditorTab>('overview')
  const [sectionDraft, setSectionDraft] = useState<SectionDraft>({
    title: '',
    image: '',
    video: '',
    blocks: [],
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState<string | null>(null)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      platform: [],
      images: [],
      sections: [],
      visible: true,
      featured: false,
      ...initialValues,
    },
  })

  const { control, getValues, setValue } = form

  const imageFieldArray = useFieldArray({ control, name: 'images' as never })
  const sectionFieldArray = useFieldArray({ control, name: 'sections' })

  // ── Upload ────────────────────────────────────────────────────────────────

  const uploadFile = async (file: File): Promise<string | null> => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 10MB.')
      return null
    }
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Upload failed' }))
        toast.error(error.error || 'Falha no upload')
        return null
      }
      const data = await res.json()
      return (data.url as string) ?? null
    } catch {
      toast.error('Erro de conexão durante upload')
      return null
    }
  }

  const handleFieldUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    index?: number,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const key = index !== undefined ? `${fieldName}.${index}` : fieldName
    setIsUploading(key)
    const url = await uploadFile(file)
    if (url) {
      setValue(key as Parameters<typeof setValue>[0], url)
      toast.success('Upload concluído!')
    }
    setIsUploading(null)
  }

  // ── Section management ────────────────────────────────────────────────────

  const openSection = (index: number | null) => {
    if (index !== null) {
      const secs = getValues('sections') || []
      const sec = secs[index]
      setSectionDraft({
        title: sec.title ?? '',
        image: sec.image ?? '',
        video: sec.video ?? '',
        blocks: (sec.blocks ?? []).map((b) => ({
          type: b.type ?? '',
          text: b.text ?? '',
          image: b.image ?? '',
          video: b.video ?? '',
          items: b.items ?? [],
        })),
      })
    } else {
      setSectionDraft({ title: '', image: '', video: '', blocks: [] })
    }
    setEditingIndex(index)
    setActiveTab('section')
  }

  const saveSection = () => {
    if (!sectionDraft.title.trim()) {
      toast.error('Título da seção é obrigatório')
      return
    }
    const sectionValue: ProjectFormValues['sections'][number] = {
      title: sectionDraft.title,
      image: sectionDraft.image,
      video: sectionDraft.video,
      blocks: sectionDraft.blocks.map((b) => ({
        type: b.type || 'paragraph',
        text: b.text ?? '',
        image: b.image ?? '',
        video: b.video ?? '',
        items: b.items,
      })),
    }
    if (editingIndex !== null) {
      const secs = [...(getValues('sections') || [])]
      secs[editingIndex] = sectionValue
      setValue('sections', secs)
    } else {
      sectionFieldArray.append(sectionValue)
    }
    setActiveTab('content')
  }

  const addDescBlock = (type: string = '', atIndex?: number) =>
    setSectionDraft((p) => {
      const newBlock = { type, text: '', image: '', video: '', items: [] }
      if (atIndex !== undefined) {
        const blocks = [...p.blocks]
        blocks.splice(atIndex, 0, newBlock)
        return { ...p, blocks }
      }
      return { ...p, blocks: [...p.blocks, newBlock] }
    })

  const removeDescBlock = (i: number) =>
    setSectionDraft((p) => ({
      ...p,
      blocks: p.blocks.filter((_, idx) => idx !== i),
    }))

  const updateDescBlock = (
    i: number,
    field: 'type' | 'text' | 'image' | 'video',
    val: string,
  ) =>
    setSectionDraft((p) => {
      const blocks = [...p.blocks]
      blocks[i] = { ...blocks[i], [field]: val }
      return { ...p, blocks }
    })

  const updateDescListItems = (i: number, items: string[]) =>
    setSectionDraft((p) => {
      const blocks = [...p.blocks]
      blocks[i] = { ...blocks[i], items }
      return { ...p, blocks }
    })

  const reorderDescBlocks = (blocks: DescBlock[]) =>
    setSectionDraft((p) => ({ ...p, blocks }))

  const uploadSectionCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading('section.image')
    const url = await uploadFile(file)
    if (url) {
      setSectionDraft((p) => ({ ...p, image: url }))
      toast.success('Upload concluído!')
    }
    setIsUploading(null)
    e.target.value = ''
  }

  const uploadDescBlockImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(`desc.image.${idx}`)
    const url = await uploadFile(file)
    if (url) {
      updateDescBlock(idx, 'image', url)
      toast.success('Upload concluído!')
    }
    setIsUploading(null)
    e.target.value = ''
  }

  return {
    form,
    activeTab,
    setActiveTab,
    sectionDraft,
    setSectionDraft,
    editingIndex,
    isUploading,
    imageFieldArray,
    sectionFieldArray,
    // Section CRUD
    openSection,
    saveSection,
    addDescBlock,
    removeDescBlock,
    updateDescBlock,
    updateDescListItems,
    reorderDescBlocks,
    // Upload
    handleFieldUpload,
    uploadSectionCoverImage,
    uploadDescBlockImage,
  }
}
