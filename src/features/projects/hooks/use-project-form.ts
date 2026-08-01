'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { projectFormSchema, type ProjectFormValues, type RawBlock, type LayoutChildren } from '@/features/projects/types/project'

export type EditorTab = 'overview' | 'content'

const genKey = () => Math.random().toString(36).slice(2, 9)

export interface DescBlock {
  _key: string
  type: string
  text?: string
  image?: string
  video?: string
  items?: string[]
  // Layout block specific:
  layoutColumns?: number
  layoutBreakpoint?: string
  children?: DescBlock[][]
}

export interface SectionState {
  _key: string
  title: string
  image: string
  video: string
  blocks: DescBlock[]
  isOpen: boolean
  showSettings: boolean
}

// ── Converters ────────────────────────────────────────────────────────────────

function rawBlockToDesc(b: RawBlock): DescBlock {
  const base: DescBlock = {
    _key: genKey(),
    type: b.type,
    text: b.text ?? '',
    image: b.image ?? '',
    video: b.video ?? '',
    items: b.items ?? [],
  }
  if (b.type === 'layout' && b.children) {
    base.layoutColumns = b.children.columns
    base.layoutBreakpoint = b.children.breakpoint
    base.children = b.children.content.map((col) => col.map(rawBlockToDesc))
  }
  return base
}

function descBlockToRaw(b: DescBlock): RawBlock {
  if (b.type === 'layout') {
    return {
      type: 'layout',
      children: {
        columns: b.layoutColumns ?? 2,
        breakpoint: b.layoutBreakpoint ?? 'md',
        content: (b.children ?? []).map((col) => col.map(descBlockToRaw)),
      },
    }
  }
  return {
    type: b.type,
    text: b.text || undefined,
    image: b.image || undefined,
    video: b.video || undefined,
    items: b.items?.filter((s) => s.trim() !== '') || undefined,
  }
}

function initSections(formSections: ProjectFormValues['sections']): SectionState[] {
  return formSections.map((s, idx) => ({
    _key: genKey(),
    title: s.title,
    image: s.image ?? '',
    video: s.video ?? '',
    isOpen: idx === 0,
    showSettings: false,
    blocks: (s.blocks ?? []).map(rawBlockToDesc),
  }))
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useProjectForm(initialValues?: Partial<ProjectFormValues> & { id?: number }) {
  const [activeTab, setActiveTab] = useState<EditorTab>('overview')
  const [sectionsState, setSectionsState] = useState<SectionState[]>(() =>
    initSections(initialValues?.sections ?? []),
  )
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

  const { control, setValue } = form
  const imageFieldArray = useFieldArray({ control, name: 'images' as never })

  // ── Upload helpers ────────────────────────────────────────────────────────

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
      setValue(key as Parameters<typeof setValue>[0], url as never)
      toast.success('Upload concluído!')
    }
    setIsUploading(null)
  }

  const uploadSectionImage = async (sIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const key = `s${sIdx}.image`
    setIsUploading(key)
    const url = await uploadFile(file)
    if (url) {
      updateSectionMeta(sIdx, { image: url })
      toast.success('Upload concluído!')
    }
    setIsUploading(null)
    e.target.value = ''
  }

  const uploadBlockImage = async (sIdx: number, bIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const key = `s${sIdx}.b${bIdx}.image`
    setIsUploading(key)
    const url = await uploadFile(file)
    if (url) {
      updateBlock(sIdx, bIdx, { image: url })
      toast.success('Upload concluído!')
    }
    setIsUploading(null)
    e.target.value = ''
  }

  const uploadGalleryItem = async (
    sIdx: number,
    bIdx: number,
    itemIdx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const key = `s${sIdx}.b${bIdx}.gallery.${itemIdx}`
    setIsUploading(key)
    const url = await uploadFile(file)
    if (url) {
      setSectionsState((prev) => {
        const sections = [...prev]
        const blocks = [...sections[sIdx].blocks]
        const items = [...(blocks[bIdx].items ?? [])]
        if (itemIdx >= items.length) items.push(url)
        else items[itemIdx] = url
        blocks[bIdx] = { ...blocks[bIdx], items }
        sections[sIdx] = { ...sections[sIdx], blocks }
        return sections
      })
      toast.success('Upload concluído!')
    }
    setIsUploading(null)
    e.target.value = ''
  }

  // ── Section management ────────────────────────────────────────────────────

  const addSection = () =>
    setSectionsState((p) => [
      ...p,
      {
        _key: genKey(),
        title: 'New Section',
        image: '',
        video: '',
        blocks: [],
        isOpen: true,
        showSettings: false,
      },
    ])

  const removeSection = (idx: number) =>
    setSectionsState((p) => p.filter((_, i) => i !== idx))

  const reorderSections = (newSections: SectionState[]) => setSectionsState(newSections)

  const updateSectionMeta = (
    idx: number,
    meta: Partial<Pick<SectionState, 'title' | 'image' | 'video'>>,
  ) =>
    setSectionsState((p) => {
      const s = [...p]
      s[idx] = { ...s[idx], ...meta }
      return s
    })

  const toggleSection = (idx: number) =>
    setSectionsState((p) => {
      const s = [...p]
      s[idx] = { ...s[idx], isOpen: !s[idx].isOpen }
      return s
    })

  const toggleSectionSettings = (idx: number) =>
    setSectionsState((p) => {
      const s = [...p]
      s[idx] = { ...s[idx], showSettings: !s[idx].showSettings }
      return s
    })

  // ── Block management ──────────────────────────────────────────────────────

  const addBlock = (sIdx: number, type: string, atIndex?: number) =>
    setSectionsState((p) => {
      const sections = [...p]
      const blocks = [...sections[sIdx].blocks]
      const newBlock: DescBlock = {
        _key: genKey(),
        type,
        text: '',
        image: '',
        video: '',
        items: [],
        ...(type === 'layout'
          ? { layoutColumns: 2, layoutBreakpoint: 'md', children: [[], []] }
          : {}),
      }
      if (atIndex !== undefined) blocks.splice(atIndex, 0, newBlock)
      else blocks.push(newBlock)
      sections[sIdx] = { ...sections[sIdx], blocks }
      return sections
    })

  const removeBlock = (sIdx: number, bIdx: number) =>
    setSectionsState((p) => {
      const s = [...p]
      s[sIdx] = { ...s[sIdx], blocks: s[sIdx].blocks.filter((_, i) => i !== bIdx) }
      return s
    })

  const updateBlock = (sIdx: number, bIdx: number, changes: Partial<DescBlock>) =>
    setSectionsState((p) => {
      const sections = [...p]
      const blocks = [...sections[sIdx].blocks]
      blocks[bIdx] = { ...blocks[bIdx], ...changes }
      sections[sIdx] = { ...sections[sIdx], blocks }
      return sections
    })

  const reorderBlocks = (sIdx: number, newBlocks: DescBlock[]) =>
    setSectionsState((p) => {
      const s = [...p]
      s[sIdx] = { ...s[sIdx], blocks: newBlocks }
      return s
    })

  // ── Layout block management ───────────────────────────────────────────────

  const updateLayoutConfig = (sIdx: number, bIdx: number, cols: number, bp: string) =>
    setSectionsState((p) => {
      const sections = [...p]
      const blocks = [...sections[sIdx].blocks]
      const block = { ...blocks[bIdx] }
      const oldChildren = block.children ?? []
      const newChildren = Array.from({ length: cols }, (_, i) => oldChildren[i] ?? [])
      blocks[bIdx] = { ...block, layoutColumns: cols, layoutBreakpoint: bp, children: newChildren }
      sections[sIdx] = { ...sections[sIdx], blocks }
      return sections
    })

  const addLayoutChild = (sIdx: number, bIdx: number, colIdx: number, type: string, atIndex?: number) =>
    setSectionsState((p) => {
      const sections = [...p]
      const blocks = [...sections[sIdx].blocks]
      const block = { ...blocks[bIdx] }
      const children = (block.children ?? []).map((c) => [...c])
      const newBlock: DescBlock = { _key: genKey(), type, text: '', image: '', video: '', items: [] }
      if (atIndex !== undefined) children[colIdx].splice(atIndex, 0, newBlock)
      else children[colIdx].push(newBlock)
      blocks[bIdx] = { ...block, children }
      sections[sIdx] = { ...sections[sIdx], blocks }
      return sections
    })

  const removeLayoutChild = (sIdx: number, bIdx: number, colIdx: number, childIdx: number) =>
    setSectionsState((p) => {
      const sections = [...p]
      const blocks = [...sections[sIdx].blocks]
      const block = { ...blocks[bIdx] }
      const children = (block.children ?? []).map((c) => [...c])
      children[colIdx] = children[colIdx].filter((_, i) => i !== childIdx)
      blocks[bIdx] = { ...block, children }
      sections[sIdx] = { ...sections[sIdx], blocks }
      return sections
    })

  const updateLayoutChild = (
    sIdx: number,
    bIdx: number,
    colIdx: number,
    childIdx: number,
    changes: Partial<DescBlock>,
  ) =>
    setSectionsState((p) => {
      const sections = [...p]
      const blocks = [...sections[sIdx].blocks]
      const block = { ...blocks[bIdx] }
      const children = (block.children ?? []).map((c) => [...c])
      children[colIdx][childIdx] = { ...children[colIdx][childIdx], ...changes }
      blocks[bIdx] = { ...block, children }
      sections[sIdx] = { ...sections[sIdx], blocks }
      return sections
    })

  const reorderLayoutColumn = (sIdx: number, bIdx: number, colIdx: number, newColBlocks: DescBlock[]) =>
    setSectionsState((p) => {
      const sections = [...p]
      const blocks = [...sections[sIdx].blocks]
      const block = { ...blocks[bIdx] }
      const children = (block.children ?? []).map((c) => [...c])
      children[colIdx] = newColBlocks
      blocks[bIdx] = { ...block, children }
      sections[sIdx] = { ...sections[sIdx], blocks }
      return sections
    })

  // ── Sync to form before save ──────────────────────────────────────────────

  const syncSectionsToForm = () => {
    setValue(
      'sections',
      sectionsState.map((s) => ({
        title: s.title,
        image: s.image,
        video: s.video,
        blocks: s.blocks.map(descBlockToRaw),
      })),
    )
  }

  return {
    form,
    activeTab,
    setActiveTab,
    sectionsState,
    isUploading,
    imageFieldArray,
    // Section management
    addSection,
    removeSection,
    reorderSections,
    updateSectionMeta,
    toggleSection,
    toggleSectionSettings,
    // Block management
    addBlock,
    removeBlock,
    updateBlock,
    reorderBlocks,
    // Layout block management
    updateLayoutConfig,
    addLayoutChild,
    removeLayoutChild,
    updateLayoutChild,
    reorderLayoutColumn,
    // Uploads
    handleFieldUpload,
    uploadSectionImage,
    uploadBlockImage,
    uploadGalleryItem,
    // Sync
    syncSectionsToForm,
  }
}
