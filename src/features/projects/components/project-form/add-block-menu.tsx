'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Heading2, AlignLeft, List, ImageIcon, Video } from 'lucide-react'

const BLOCK_TYPES = [
  { type: 'heading', label: 'Heading', Icon: Heading2 },
  { type: 'paragraph', label: 'Para', Icon: AlignLeft },
  { type: 'list', label: 'List', Icon: List },
  { type: 'image', label: 'Image', Icon: ImageIcon },
  { type: 'video', label: 'Video', Icon: Video },
] as const

interface AddBlockMenuProps {
  onAdd: (type: string) => void
}

export function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center my-1 h-6 group/adder"
    >
      {/* Divider line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px bg-zinc-800/0 group-hover/adder:bg-zinc-800 transition-colors" />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative z-10 opacity-0 group-hover/adder:opacity-100 focus:opacity-100 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 hover:border-zinc-600 transition-all"
      >
        <Plus className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute top-8 z-50 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-1.5 flex gap-0.5">
          {BLOCK_TYPES.map(({ type, label, Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type)
                setOpen(false)
              }}
              className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white min-w-[52px]"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function AddBlockButton({ onAdd }: AddBlockMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={containerRef} className="relative flex justify-center mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 hover:bg-zinc-900/50 transition-all text-xs font-medium"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Block
      </button>

      {open && (
        <div className="absolute top-full mt-2 z-50 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-1.5 flex gap-0.5">
          {BLOCK_TYPES.map(({ type, label, Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type)
                setOpen(false)
              }}
              className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white min-w-[52px]"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
