'use client'

import { useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Upload, Plus, X, Loader2, ImageIcon, Video, LayoutGrid, ArrowRightLeft } from 'lucide-react'
import Image from 'next/image'
import { toYouTubeEmbedUrl } from '@/lib/utils'
import type { DescBlock } from '@/features/projects/hooks/use-project-form'

// ─── contentEditable sync hook ────────────────────────────────────────────────
function useSyncedEditable(value: string) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el === document.activeElement) return
    if (el.innerText === value) return
    el.innerText = value ?? ''
  })

  return ref
}

// ─── HeadingBlock ─────────────────────────────────────────────────────────────
function HeadingBlock({ text, onUpdate }: { text: string; onUpdate: (v: string) => void }) {
  const ref = useSyncedEditable(text)
  return (
    <h3
      ref={ref as React.Ref<HTMLHeadingElement>}
      contentEditable
      suppressContentEditableWarning
      data-placeholder="Heading…"
      onInput={(e) => onUpdate(e.currentTarget.innerText)}
      className="text-xl font-bold text-white outline-none focus:ring-1 focus:ring-primary/30 rounded px-1 -mx-1 min-h-[1.5rem]"
    />
  )
}

// ─── ParagraphBlock ────────────────────────────────────────────────────────────
function ParagraphBlock({ text, onUpdate }: { text: string; onUpdate: (v: string) => void }) {
  const ref = useSyncedEditable(text)
  return (
    <p
      ref={ref as React.Ref<HTMLParagraphElement>}
      contentEditable
      suppressContentEditableWarning
      data-placeholder="Start typing…"
      onInput={(e) => onUpdate(e.currentTarget.innerText)}
      className="text-zinc-400 font-light leading-relaxed text-justify outline-none focus:ring-1 focus:ring-primary/30 rounded px-1 -mx-1 min-h-[1.5rem] whitespace-pre-wrap"
    />
  )
}

// ─── ListBlock ─────────────────────────────────────────────────────────────────
function ListBlock({
  items,
  onUpdate,
}: {
  items: string[]
  onUpdate: (items: string[]) => void
}) {
  const [localItems, setLocalItems] = useState<string[]>(items.length ? items : [''])
  const skipNextSync = useRef(false)

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }
    setLocalItems(items.length ? items : [''])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)])

  const update = (next: string[]) => {
    skipNextSync.current = true
    setLocalItems(next)
    onUpdate(next.filter((s) => s.trim() !== ''))
  }

  const addItem = () => update([...localItems, ''])

  const removeItem = (i: number) => {
    const next = localItems.filter((_, idx) => idx !== i)
    update(next.length ? next : [''])
  }

  return (
    <ul className="space-y-1">
      {localItems.map((item, i) => (
        <li key={i} className="flex items-center gap-2 group/item">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-0.5" />
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...localItems]
              next[i] = e.target.value
              update(next)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const next = [...localItems]
                next.splice(i + 1, 0, '')
                update(next)
              }
              if (e.key === 'Backspace' && item === '' && localItems.length > 1) {
                e.preventDefault()
                removeItem(i)
              }
            }}
            placeholder="List item…"
            className="flex-1 bg-transparent text-zinc-400 font-light text-sm outline-none focus:ring-0 placeholder:text-zinc-700"
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="opacity-0 group-hover/item:opacity-100 text-zinc-700 hover:text-red-400 transition-all p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-400 text-xs transition-colors mt-1"
        >
          <Plus className="w-3 h-3" />
          Add item
        </button>
      </li>
    </ul>
  )
}

// ─── GalleryBlock ──────────────────────────────────────────────────────────────
function GalleryBlock({
  items,
  blockIdx,
  isUploading,
  onUpdate,
  onUploadItem,
}: {
  items: string[]
  blockIdx: number
  isUploading: string | null
  onUpdate: (items: string[]) => void
  onUploadItem: (e: React.ChangeEvent<HTMLInputElement>, itemIdx: number) => void
}) {
  const [targetIdx, setTargetIdx] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const removeItem = (i: number) => onUpdate(items.filter((_, idx) => idx !== i))
  const addItem = () => onUpdate([...items, ''])
  const updateUrl = (i: number, url: string) => {
    const next = [...items]
    next[i] = url
    onUpdate(next)
  }

  const handleUploadClick = (idx: number) => {
    setTargetIdx(idx)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (targetIdx === null) return
    onUploadItem(e, targetIdx)
    setTargetIdx(null)
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {items.map((url, i) => (
          <div key={i} className="relative group/gitem">
            <div className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/gitem:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUploadClick(i)}
                  disabled={isUploading === `gallery.${blockIdx}.${i}`}
                  className="p-1.5 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  {isUploading === `gallery.${blockIdx}.${i}` ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="p-1.5 bg-zinc-900 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            {!url && (
              <input
                type="text"
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder="URL…"
                className="mt-1 w-full bg-zinc-900 border border-zinc-800 rounded text-[10px] px-2 py-1 text-zinc-400 font-mono outline-none focus:border-zinc-600"
              />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="aspect-square rounded-lg border-2 border-dashed border-zinc-800 hover:border-zinc-600 flex items-center justify-center text-zinc-700 hover:text-zinc-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <p className="text-[10px] text-zinc-700">{items.length} image{items.length !== 1 ? 's' : ''} · hover to upload or remove</p>
    </div>
  )
}

// ─── ImageBlock ────────────────────────────────────────────────────────────────
function ImageBlock({
  image,
  onUpload,
  onChangeUrl,
  isUploading,
}: {
  image: string
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeUrl: (url: string) => void
  isUploading: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [urlMode, setUrlMode] = useState(false)

  // URL-only mode when no upload handler provided
  if (!onUpload) {
    return (
      <div className="space-y-2 w-full">
        {image && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800">
            <Image src={image} alt="Block image" fill className="object-cover" sizes="600px" />
          </div>
        )}
        <input
          type="text"
          value={image}
          onChange={(e) => onChangeUrl(e.target.value)}
          placeholder="https://…"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-zinc-600"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2 w-full">
      {image ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-zinc-800 group/img">
          <div className="relative w-full aspect-video">
            <Image
              src={image}
              alt="Block image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white hover:bg-zinc-800 transition-colors"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => setUrlMode((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white hover:bg-zinc-800 transition-colors"
            >
              URL
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs font-medium">Click to upload image</span>
            </>
          )}
        </button>
      )}

      {urlMode && (
        <input
          type="text"
          value={image}
          onChange={(e) => onChangeUrl(e.target.value)}
          placeholder="https://…"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-zinc-600"
        />
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUpload}
        disabled={isUploading}
      />
    </div>
  )
}

// ─── VideoBlock ─────────────────────────────────────────────────────────────────
function VideoBlock({
  video,
  onChangeUrl,
}: {
  video: string
  onChangeUrl: (url: string) => void
}) {
  const embedUrl = video ? toYouTubeEmbedUrl(video) : null
  const isValidEmbed = embedUrl && embedUrl !== video

  return (
    <div className="space-y-2 w-full">
      {isValidEmbed ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800">
          <iframe
            src={embedUrl}
            title="Video embed"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        <div className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 text-zinc-600">
          <Video className="w-8 h-8" />
          <span className="text-xs font-medium">Paste a YouTube URL below</span>
        </div>
      )}

      <input
        type="text"
        value={video}
        onChange={(e) => onChangeUrl(e.target.value)}
        placeholder="https://youtube.com/watch?v=…"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-zinc-600"
      />
    </div>
  )
}

// ─── Block type label ──────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  heading: 'H',
  paragraph: '¶',
  list: '≡',
  image: '⬜',
  video: '▶',
  gallery: '▦',
}

// ─── SortableBlock ─────────────────────────────────────────────────────────────
interface SortableBlockProps {
  id: string
  index: number
  block: DescBlock
  isUploading: string | null
  onRemove: () => void
  onUpdateText: (val: string) => void
  onUpdateListItems: (items: string[]) => void
  onUpdateVideo: (url: string) => void
  onUpdateImage: (url: string) => void
  onUploadImage?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUploadGalleryItem?: (e: React.ChangeEvent<HTMLInputElement>, itemIdx: number) => void
  onMoveToColumn?: () => void
  moveColumnLabel?: string
}

export function SortableBlock({
  id,
  index,
  block,
  isUploading,
  onRemove,
  onUpdateText,
  onUpdateListItems,
  onUpdateVideo,
  onUpdateImage,
  onUploadImage,
  onUploadGalleryItem,
  onMoveToColumn,
  moveColumnLabel,
}: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/block flex items-start gap-2 py-1 ${isDragging ? 'opacity-40 z-50' : ''}`}
    >
      {/* Drag handle + type badge */}
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover/block:opacity-100 p-1 text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing transition-opacity rounded"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-[10px] text-zinc-700 font-mono select-none">
          {TYPE_LABELS[block.type ?? ''] ?? '?'}
        </span>
      </div>

      {/* Block content */}
      <div className="flex-1 min-w-0 py-1">
        {block.type === 'heading' && (
          <HeadingBlock text={block.text ?? ''} onUpdate={onUpdateText} />
        )}
        {block.type === 'paragraph' && (
          <ParagraphBlock text={block.text ?? ''} onUpdate={onUpdateText} />
        )}
        {block.type === 'list' && (
          <ListBlock items={block.items ?? []} onUpdate={onUpdateListItems} />
        )}
        {block.type === 'image' && (
          <ImageBlock
            image={block.image ?? ''}
            onUpload={onUploadImage}
            onChangeUrl={onUpdateImage}
            isUploading={isUploading === `desc.image.${index}`}
          />
        )}
        {block.type === 'video' && (
          <VideoBlock video={block.video ?? ''} onChangeUrl={onUpdateVideo} />
        )}
        {block.type === 'gallery' && (
          <GalleryBlock
            items={block.items ?? []}
            blockIdx={index}
            isUploading={isUploading}
            onUpdate={onUpdateListItems}
            onUploadItem={onUploadGalleryItem ?? (() => {})}
          />
        )}
        {!block.type && (
          <p className="text-zinc-700 text-sm italic">Unknown block type</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-1 mt-1 shrink-0">
        {onMoveToColumn && (
          <button
            type="button"
            onClick={onMoveToColumn}
            title={moveColumnLabel}
            className="opacity-0 group-hover/block:opacity-100 p-1.5 text-zinc-700 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
          >
            <ArrowRightLeft className="w-3 h-3" />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="opacity-0 group-hover/block:opacity-100 p-1.5 text-zinc-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── ColumnIcon export (used in section-editor) ────────────────────────────────
export { LayoutGrid }
