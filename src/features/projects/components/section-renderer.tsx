import React from "react"
import Image from "next/image"
import type { SectionBlock } from "@/features/projects/types/project"
import type { LayoutChildren, RawBlock } from "@/features/projects/types/project"
import { toYouTubeEmbedUrl } from "@/lib/utils"

interface Section {
  title: string
  image?: string | null
  video?: string | null
  blocks: SectionBlock[]
}

interface SectionRendererProps {
  section: Section
  projectTitle: string
  sectionIndex: number
  onImageClick: (imageSrc: string) => void
}

const BP_CLASS: Record<string, string> = {
  sm: 'sm:grid-cols-2',
  md: 'md:grid-cols-2',
  lg: 'lg:grid-cols-2',
  always: 'grid-cols-2',
}

function renderBlock(
  block: SectionBlock | RawBlock,
  idx: number,
  projectTitle: string,
  onImageClick: (src: string) => void,
): React.ReactNode {
  if ((block.type === "heading" || block.type?.startsWith("heading-")) && block.text) {
    const level = block.type === "heading" ? 3 : (parseInt(block.type.replace("heading-", ""), 10) || 3)
    const Tag = `h${level}` as React.ElementType
    const sizeClass: Record<number, string> = {
      1: "text-3xl font-extrabold",
      2: "text-2xl font-bold",
      3: "text-xl font-semibold",
      4: "text-lg font-semibold",
    }
    return <Tag key={idx} className={`${sizeClass[level] ?? "text-lg font-semibold"} text-white`}>{block.text}</Tag>
  }
  if (block.type === "paragraph" && block.text) {
    return (
      <div
        key={idx}
        className="text-zinc-400 font-light leading-relaxed [&_strong]:text-zinc-300 [&_strong]:font-bold [&_b]:text-zinc-300 [&_b]:font-bold [&_em]:italic [&_i]:italic"
        dangerouslySetInnerHTML={{ __html: block.text }}
      />
    )
  }
  if (block.type === "list" && Array.isArray(block.items)) {
    return (
      <ul key={idx} className="space-y-3">
        {block.items.map((point: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-zinc-400 font-light text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    )
  }
  if (block.type === "image" && block.image) {
    return (
      <div
        key={idx}
        className="my-8 overflow-hidden cursor-zoom-in group border border-zinc-800/50 shadow-xl"
        onClick={() => onImageClick(block.image!)}
      >
        <Image
          src={block.image || "/placeholder.svg"}
          alt={`${projectTitle} - Section Image`}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
        />
      </div>
    )
  }
  if (block.type === "video" && block.video) {
    return (
      <div key={idx} className="my-8 w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-zinc-800/50">
        <iframe
          src={toYouTubeEmbedUrl(block.video)}
          title={`${projectTitle} block video`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }
  if (block.type === "gallery" && Array.isArray(block.items) && block.items.length > 0) {
    return (
      <div key={idx} className="my-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {block.items.map((url: string, i: number) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden cursor-zoom-in border border-zinc-800/50 shadow group"
            onClick={() => onImageClick(url)}
          >
            <Image
              src={url}
              alt={`${projectTitle} gallery ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    )
  }
  if (block.type === "layout") {
    let layoutData: LayoutChildren | null = null
    try {
      const raw = (block as SectionBlock).children
      if (raw) layoutData = JSON.parse(raw) as LayoutChildren
    } catch { /* ignore */ }

    if (layoutData) {
      const { columns, breakpoint, content } = layoutData
      const col3 = breakpoint === 'always' ? 'grid-cols-3' : `grid-cols-1 ${BP_CLASS[breakpoint]?.replace('-cols-2', '-cols-3') ?? 'md:grid-cols-3'}`
      const col2 = `grid-cols-1 ${BP_CLASS[breakpoint] ?? 'md:grid-cols-2'}`
      const gridClass = columns === 1 ? 'grid-cols-1' : columns === 3 ? col3 : col2

      return (
        <div key={idx} className={`grid gap-6 lg:gap-8 my-6 ${gridClass}`}>
          {content.map((col, colIdx) => (
            <div key={colIdx} className="space-y-4">
              {col.map((childBlock, childIdx) =>
                renderBlock(childBlock as SectionBlock, childIdx, projectTitle, onImageClick)
              )}
            </div>
          ))}
        </div>
      )
    }
  }
  return null
}

export default function SectionRenderer({ section, projectTitle, sectionIndex, onImageClick }: SectionRendererProps) {
  return (
    <div className="flex flex-col mb-16">
      <div className="relative mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-3">{section.title}</h2>
        <div className="h-1 w-16 bg-primary rounded-full" />
      </div>

      {/* Per-section video */}
      {section.video && (
        <div className="mb-8 w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-zinc-800/50">
          <iframe
            src={toYouTubeEmbedUrl(section.video)}
            title={`${section.title} video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      <div className={`grid grid-cols-1 gap-8 lg:gap-12 ${section.image ? "lg:grid-cols-2" : ""}`}>
        <div className="space-y-6">
          {section.blocks.map((block, idx) => renderBlock(block, idx, projectTitle, onImageClick))}
        </div>

        {section.image && (
          <div
            className="relative group cursor-zoom-in overflow-hidden border border-zinc-800/50 shadow-xl"
            onClick={() => onImageClick(section.image!)}
          >
            <Image
              src={section.image || "/placeholder.svg"}
              alt={`${projectTitle} - Section ${sectionIndex + 1}`}
              width={500}
              height={500}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  )
}
