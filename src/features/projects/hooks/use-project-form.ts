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
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      return (data.url as string) ?? null
    } catch {
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
      toast.success('Uploaded!')
    } else {
      toast.error('Upload failed')
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
      toast.error('Section title is required')
      return
    }
    const sectionValue: ProjectFormValues['sections'][number] = {
      title: sectionDraft.title,
      image: sectionDraft.image,
      video: sectionDraft.video,
      blocks: sectionDraft.blocks.map((b) => ({
        type: b.type ?? 'paragraph',
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

  const addDescBlock = () =>
    setSectionDraft((p) => ({
      ...p,
      blocks: [...p.blocks, { type: '', text: '', image: '', video: '', items: [] }],
    }))

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

  const updateDescListItems = (i: number, itemsStr: string) =>
    setSectionDraft((p) => {
      const blocks = [...p.blocks]
      blocks[i] = {
        ...blocks[i],
        items: itemsStr.split('\n').filter((s) => s.trim() !== ''),
      }
      return { ...p, blocks }
    })

  const uploadSectionCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading('section.image')
    const url = await uploadFile(file)
    if (url) setSectionDraft((p) => ({ ...p, image: url }))
    setIsUploading(null)
  }

  const uploadDescBlockImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(`desc.image.${idx}`)
    const url = await uploadFile(file)
    if (url) updateDescBlock(idx, 'image', url)
    setIsUploading(null)
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
    // Upload
    handleFieldUpload,
    uploadSectionCoverImage,
    uploadDescBlockImage,
  }
}
