'use client'

import type { ChangeEvent } from 'react'
import { Upload, Loader2, ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onUpload: (file: File) => Promise<string>
}

export function ImageUpload({ value, onChange, onUpload }: ImageUploadProps) {
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await onUpload(file)
    onChange(url)
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full aspect-video rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center gap-2 text-zinc-600">
          <ImageIcon className="w-8 h-8" />
          <p className="text-xs font-medium">No image selected</p>
        </div>
      )}

      <label className="flex items-center justify-center gap-2 h-10 w-full bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 cursor-pointer transition-all text-sm font-medium">
        <Upload className="w-4 h-4" />
        Upload image
        <input
          type="file"
          className="hidden"
          accept="image/*,video/*,image/gif"
          onChange={handleFileChange}
        />
      </label>
    </div>
  )
}

interface ImageUploadWithLoadingProps extends ImageUploadProps {
  loading?: boolean
}

export function ImageUploadWithLoading({ value, onChange, onUpload, loading }: ImageUploadWithLoadingProps) {
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await onUpload(file)
    onChange(url)
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full aspect-video rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center gap-2 text-zinc-600">
          <ImageIcon className="w-8 h-8" />
          <p className="text-xs font-medium">No image selected</p>
        </div>
      )}

      <label className="flex items-center justify-center gap-2 h-10 w-full bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 cursor-pointer transition-all text-sm font-medium">
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Upload className="w-4 h-4" />
        }
        {loading ? 'Uploading…' : 'Upload image'}
        <input
          type="file"
          className="hidden"
          accept="image/*,video/*,image/gif"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>
    </div>
  )
}
