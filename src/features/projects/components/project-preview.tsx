'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import SectionRenderer from './section-renderer'
import type { SectionState, DescBlock } from '@/features/projects/hooks/use-project-form'
import type { SectionBlock } from '@/features/projects/types/project'

function descBlockToRenderBlock(b: DescBlock): SectionBlock {
  if (b.type === 'layout') {
    const children = {
      columns: b.layoutColumns ?? 2,
      breakpoint: b.layoutBreakpoint ?? 'md',
      content: (b.children ?? []).map((col) =>
        col.map((c) => ({
          type: c.type,
          text: c.text ?? null,
          image: c.image ?? null,
          video: c.video ?? null,
          items: c.items?.length ? c.items : null,
        })),
      ),
    }
    return {
      id: 0,
      sectionId: 0,
      type: 'layout',
      text: null,
      image: null,
      video: null,
      items: null,
      children: JSON.stringify(children),
      sortOrder: 0,
    }
  }
  return {
    id: 0,
    sectionId: 0,
    type: b.type,
    text: b.text ?? null,
    image: b.image ?? null,
    video: b.video ?? null,
    items: b.items?.length ? b.items : null,
    children: null,
    sortOrder: 0,
  }
}

interface ProjectPreviewProps {
  sectionsState: SectionState[]
  projectTitle: string
  onClose: () => void
}

export function ProjectPreview({ sectionsState, projectTitle, onClose }: ProjectPreviewProps): React.ReactNode {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Lock body scroll while preview is open
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!mounted) return null

  const overlay = (
    <div className="fixed inset-0 z-[9999] bg-zinc-950 overflow-y-auto text-zinc-300">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-zinc-950/90 border-b border-zinc-800 backdrop-blur-xl">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Preview</p>
          <p className="text-sm font-semibold text-white">{projectTitle || 'Untitled'}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {sectionsState.length === 0 ? (
          <p className="text-zinc-600 text-center py-20">No sections to preview.</p>
        ) : (
          sectionsState.map((section, idx) => (
            <SectionRenderer
              key={section._key}
              section={{
                title: section.title,
                image: section.image || null,
                video: section.video || null,
                blocks: section.blocks.map(descBlockToRenderBlock),
              }}
              projectTitle={projectTitle}
              sectionIndex={idx}
              onImageClick={(src) => setLightboxSrc(src)}
            />
          ))
        )}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={() => setLightboxSrc(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
          />
        </div>
      )}
    </div>
  )

  return createPortal(overlay, document.body)
}
