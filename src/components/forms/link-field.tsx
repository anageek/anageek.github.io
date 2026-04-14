'use client'

import type { ChangeEvent } from 'react'
import { Link as LinkIcon, Upload, Loader2 } from 'lucide-react'

interface LinkFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onUpload?: (e: ChangeEvent<HTMLInputElement>) => void
  uploading?: boolean
}

export function LinkField({ value, onChange, placeholder, onUpload, uploading }: LinkFieldProps) {
  return (
    <div className="flex items-center h-10 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-3 border-r border-zinc-800 text-zinc-600 flex items-center">
        <LinkIcon className="w-3.5 h-3.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[11px] font-mono text-zinc-300 px-3 focus:outline-none placeholder:text-zinc-700 h-full"
      />
      {onUpload && (
        <label className="px-3 border-l border-zinc-800 text-zinc-600 hover:text-zinc-300 cursor-pointer transition-colors flex items-center h-full">
          {uploading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Upload className="w-3.5 h-3.5" />
          }
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*,image/gif"
            onChange={onUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}
