'use client'

import { useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical, Trash2, Upload, Plus, X, Loader2, ImageIcon, Video, LayoutGrid, ArrowRightLeft,
  Bold, Italic, Underline, Strikethrough, Quote, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link,
} from 'lucide-react'
import Image from 'next/image'
import { toYouTubeEmbedUrl } from '@/lib/utils'
import type { DescBlock } from '@/features/projects/hooks/use-project-form'

// ─── contentEditable sync hook (innerText) ────────────────────────────────────
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

// ─── contentEditable sync hook (innerHTML) ────────────────────────────────────
function useSyncedHTMLEditable(value: string) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el === document.activeElement) return
    if (el.innerHTML === value) return
    el.innerHTML = value ?? ''
  })
  return ref
}

// ─── HeadingBlock ─────────────────────────────────────────────────────────────
function HeadingBlock({
  type,
  text,
  onUpdate,
  onTypeChange,
}: {
  type: string
  text: string
  onUpdate: (v: string) => void
  onTypeChange: (t: string) => void
}) {
  const level = type === 'heading' ? 3 : (parseInt(type.replace('heading-', ''), 10) || 3)
  const ref = useSyncedEditable(text)
  const Tag = `h${level}` as React.ElementType

  const sizeClass: Record<number, string> = {
    1: 'text-3xl font-extrabold',
    2: 'text-2xl font-bold',
    3: 'text-xl font-bold',
    4: 'text-lg font-semibold',
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-0.5">
        {([1, 2, 3, 4] as const).map((n) => (
          <button
            key={n}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); onTypeChange(`heading-${n}`) }}
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider transition-colors ${
              level === n
                ? 'bg-primary text-white'
                : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            H{n}
          </button>
        ))}
      </div>
      <Tag
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Heading…"
        onInput={(e: React.FormEvent<HTMLElement>) => onUpdate(e.currentTarget.innerText)}
        className={`${sizeClass[level] ?? 'text-xl font-bold'} text-white outline-none focus:ring-1 focus:ring-primary/30 rounded px-1 -mx-1 min-h-[1.5rem]`}
      />
    </div>
  )
}

// ─── Alignment toolbar options (defined outside for stability) ─────────────────
const alignOpts = [
  { cmd: 'justifyLeft', Icon: AlignLeft, title: 'Esquerda' },
  { cmd: 'justifyCenter', Icon: AlignCenter, title: 'Centro' },
  { cmd: 'justifyRight', Icon: AlignRight, title: 'Direita' },
  { cmd: 'justifyFull', Icon: AlignJustify, title: 'Justificado' },
]

// ─── ParagraphBlock ────────────────────────────────────────────────────────────
function ParagraphBlock({ text, onUpdate }: { text: string; onUpdate: (v: string) => void }) {
  const ref = useSyncedHTMLEditable(text)
  const [formats, setFormats] = useState({ bold: false, italic: false, underline: false, strike: false, inLink: false })
  const [linkMode, setLinkMode] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const savedRangeRef = useRef<Range | null>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)

  const refreshFormats = () => {
    try {
      const sel = window.getSelection()
      const node = sel?.anchorNode
      const inLink = node
        ? !!(node.nodeType === Node.TEXT_NODE
            ? node.parentElement?.closest('a')
            : (node as Element).closest?.('a'))
        : false
      setFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strike: document.queryCommandState('strikeThrough'),
        inLink,
      })
    } catch { /* ignore */ }
  }

  const execCmd = (cmd: string, value?: string) => {
    ref.current?.focus()
    document.execCommand(cmd, false, value)
    if (ref.current) onUpdate(ref.current.innerHTML)
    refreshFormats()
  }

  const openLinkInput = (e: React.MouseEvent) => {
    e.preventDefault()
    if (formats.inLink) {
      ref.current?.focus()
      document.execCommand('unlink')
      if (ref.current) onUpdate(ref.current.innerHTML)
      refreshFormats()
      return
    }
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange()
      setLinkUrl('')
      setLinkMode(true)
      setTimeout(() => linkInputRef.current?.focus(), 0)
    }
  }

  const applyLink = () => {
    const url = linkUrl.trim()
    if (!url || !savedRangeRef.current) { cancelLink(); return }
    ref.current?.focus()
    const sel = window.getSelection()
    if (sel) {
      sel.removeAllRanges()
      sel.addRange(savedRangeRef.current)
    }
    document.execCommand('createLink', false, url)
    if (ref.current) onUpdate(ref.current.innerHTML)
    setLinkMode(false)
    setLinkUrl('')
    savedRangeRef.current = null
    refreshFormats()
  }

  const cancelLink = () => {
    setLinkMode(false)
    setLinkUrl('')
    savedRangeRef.current = null
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-0.5 flex-wrap">
        <button
          type="button"
          title="Negrito"
          onMouseDown={(e) => { e.preventDefault(); execCmd('bold') }}
          className={`p-1 rounded transition-colors ${formats.bold ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'}`}
        >
          <Bold className="w-3 h-3" />
        </button>
        <button
          type="button"
          title="Itálico"
          onMouseDown={(e) => { e.preventDefault(); execCmd('italic') }}
          className={`p-1 rounded transition-colors ${formats.italic ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'}`}
        >
          <Italic className="w-3 h-3" />
        </button>
        <button
          type="button"
          title="Sublinhado"
          onMouseDown={(e) => { e.preventDefault(); execCmd('underline') }}
          className={`p-1 rounded transition-colors ${formats.underline ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'}`}
        >
          <Underline className="w-3 h-3" />
        </button>
        <button
          type="button"
          title="Tachado"
          onMouseDown={(e) => { e.preventDefault(); execCmd('strikeThrough') }}
          className={`p-1 rounded transition-colors ${formats.strike ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'}`}
        >
          <Strikethrough className="w-3 h-3" />
        </button>
        <div className="w-px h-3.5 bg-zinc-800 mx-0.5" />
        {alignOpts.map(({ cmd, Icon, title }) => (
          <button
            key={cmd}
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); execCmd(cmd) }}
            className="p-1 rounded text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-colors"
          >
            <Icon className="w-3 h-3" />
          </button>
        ))}
        <div className="w-px h-3.5 bg-zinc-800 mx-0.5" />
        <button
          type="button"
          title="Citação (blockquote)"
          onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'blockquote') }}
          className="p-1 rounded transition-colors text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800"
        >
          <Quote className="w-3 h-3" />
        </button>
        <div className="w-px h-3.5 bg-zinc-800 mx-0.5" />
        <button
          type="button"
          title={formats.inLink ? 'Remover link' : 'Inserir link (selecione texto primeiro)'}
          onMouseDown={openLinkInput}
          className={`p-1 rounded transition-colors ${formats.inLink ? 'bg-zinc-700 text-primary' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'}`}
        >
          <Link className="w-3 h-3" />
        </button>
      </div>

      {linkMode && (
        <div className="flex items-center gap-1.5">
          <input
            ref={linkInputRef}
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); applyLink() }
              if (e.key === 'Escape') cancelLink()
            }}
            placeholder="https://…"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-mono text-zinc-300 outline-none focus:border-zinc-500"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={applyLink}
            className="px-2 py-1 text-xs bg-primary hover:bg-primary/90 text-white rounded transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={cancelLink}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div
        ref={ref as React.Ref<HTMLDivElement>}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Start typing…"
        onInput={(e) => {
          onUpdate(e.currentTarget.innerHTML)
          refreshFormats()
        }}
        onKeyUp={refreshFormats}
        onMouseUp={refreshFormats}
        className="text-zinc-400 font-light leading-relaxed outline-none focus:ring-1 focus:ring-primary/30 rounded px-1 -mx-1 min-h-[1.5rem] [&_strong]:font-bold [&_strong]:text-zinc-300 [&_b]:font-bold [&_b]:text-zinc-300 [&_em]:italic [&_i]:italic [&_u]:underline [&_u]:underline-offset-2 [&_s]:line-through [&_strike]:line-through [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-600 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-zinc-500 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:cursor-pointer"
      />
    </div>
  )
}

// ─── ButtonBlock ───────────────────────────────────────────────────────────────
function ButtonBlock({
  text,
  href,
  onUpdateText,
  onUpdateHref,
}: {
  text: string
  href: string
  onUpdateText: (v: string) => void
  onUpdateHref: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={text}
        onChange={(e) => onUpdateText(e.target.value)}
        placeholder="Label do botão…"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-zinc-600"
      />
      <input
        type="text"
        value={href}
        onChange={(e) => onUpdateHref(e.target.value)}
        placeholder="https://… ou /pagina"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-400 outline-none focus:border-zinc-600"
      />
      {text && (
        <div className="flex">
          <div className="px-5 py-2 bg-primary rounded-xl text-white text-sm font-medium pointer-events-none select-none">
            {text}
          </div>
        </div>
      )}
    </div>
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
        <>
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
          <input
            type="text"
            value={image}
            onChange={(e) => onChangeUrl(e.target.value)}
            placeholder="or paste URL…"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-zinc-600"
          />
        </>
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
const BASE_TYPE_LABELS: Record<string, string> = {
  paragraph: '¶',
  list: '≡',
  image: '⬜',
  video: '▶',
  gallery: '▦',
  layout: '▤',
  button: '⊕',
}

function getTypeLabel(type: string): string {
  if (type === 'heading') return 'H'
  if (type.startsWith('heading-')) {
    const n = type.replace('heading-', '')
    return `H${n}`
  }
  return BASE_TYPE_LABELS[type] ?? '?'
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
  onUpdateType?: (type: string) => void
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
  onUpdateType,
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
          {getTypeLabel(block.type ?? '')}
        </span>
      </div>

      {/* Block content */}
      <div className="flex-1 min-w-0 py-1">
        {(block.type === 'heading' || block.type?.startsWith('heading-')) && (
          <HeadingBlock
            type={block.type}
            text={block.text ?? ''}
            onUpdate={onUpdateText}
            onTypeChange={(t) => onUpdateType?.(t)}
          />
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
        {block.type === 'button' && (
          <ButtonBlock
            text={block.text ?? ''}
            href={block.video ?? ''}
            onUpdateText={onUpdateText}
            onUpdateHref={onUpdateVideo}
          />
        )}
        {(!block.type || (!['paragraph', 'list', 'image', 'video', 'gallery', 'button'].includes(block.type) && !block.type.startsWith('heading'))) && block.type !== 'layout' && (
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
