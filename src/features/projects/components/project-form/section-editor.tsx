'use client'

import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field } from '@/components/forms/field'
import { LinkField } from '@/components/forms/link-field'
import type { SectionDraft } from '@/features/projects/hooks/use-project-form'
import type { ChangeEvent } from 'react'

interface SectionEditorProps {
  sectionDraft: SectionDraft
  isUploading: string | null
  onTitleChange: (title: string) => void
  onImageChange: (image: string) => void
  onVideoChange: (video: string) => void
  onAddDescBlock: () => void
  onRemoveDescBlock: (index: number) => void
  onUpdateDescBlock: (
    index: number,
    field: 'type' | 'text' | 'image' | 'video',
    val: string,
  ) => void
  onUpdateDescListItems: (index: number, itemsStr: string) => void
  onUploadSectionImage: (e: ChangeEvent<HTMLInputElement>) => void
  onUploadDescBlockImage: (e: ChangeEvent<HTMLInputElement>, idx: number) => void
}

export function SectionEditor({
  sectionDraft,
  isUploading,
  onTitleChange,
  onImageChange,
  onVideoChange,
  onAddDescBlock,
  onRemoveDescBlock,
  onUpdateDescBlock,
  onUpdateDescListItems,
  onUploadSectionImage,
  onUploadDescBlockImage,
}: SectionEditorProps) {
  return (
    <div className="p-8 space-y-6">

      <Field label="Header">
        <Input
          value={sectionDraft.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-zinc-900 border-zinc-800 h-10 text-white font-bold rounded-lg"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Image (Change Layout)">
          <LinkField
            value={sectionDraft.image}
            onChange={onImageChange}
            onUpload={onUploadSectionImage}
            uploading={isUploading === 'section.image'}
          />
        </Field>
        <Field label="Video">
          <LinkField
            value={sectionDraft.video}
            onChange={onVideoChange}
          />
        </Field>
      </div>

      {/* Description blocks */}
      <div className="space-y-4">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Description
        </Label>

        {sectionDraft.blocks.length === 0 && (
          <p className="text-zinc-700 text-sm py-4 text-center border border-dashed border-zinc-800 rounded-xl">
            No description blocks yet.
          </p>
        )}

        {sectionDraft.blocks.map((block, idx) => (
          <div
            key={idx}
            className="relative border border-zinc-800 rounded-xl p-5 space-y-4 bg-zinc-950/30"
          >
            <button
              type="button"
              onClick={() => onRemoveDescBlock(idx)}
              className="absolute top-3 right-3 w-6 h-6 rounded-xl flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all z-10"
            >
              <X className="w-3 h-3" />
            </button>

            <Field label="Block Type">
              <Select
                value={block.type || 'none'}
                onValueChange={(v) => onUpdateDescBlock(idx, 'type', v === 'none' ? '' : v)}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800 h-10 w-64 rounded-lg">
                  <SelectValue placeholder="Paragraph/Text" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
                  <SelectItem value="none">Mixed Output (Text + Image)</SelectItem>
                  <SelectItem value="heading">Heading (Title)</SelectItem>
                  <SelectItem value="paragraph">Paragraph Only</SelectItem>
                  <SelectItem value="list">List items</SelectItem>
                  <SelectItem value="image">Image Only</SelectItem>
                  <SelectItem value="video">Video Embed</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {(!block.type ||
              block.type === 'paragraph' ||
              block.type === 'heading' ||
              block.type === 'none') && (
              <Field label="Text">
                <Textarea
                  value={block.text || ''}
                  onChange={(e) => onUpdateDescBlock(idx, 'text', e.target.value)}
                  rows={3}
                  className="bg-zinc-900 border-zinc-800 resize-none rounded-lg text-sm leading-relaxed"
                />
              </Field>
            )}

            {block.type === 'list' && (
              <Field label="List Items (one per line)">
                <Textarea
                  value={(block.items || []).join('\n')}
                  onChange={(e) => onUpdateDescListItems(idx, e.target.value)}
                  rows={4}
                  className="bg-zinc-900 border-zinc-800 resize-none rounded-lg text-sm leading-relaxed"
                />
              </Field>
            )}

            {(!block.type || block.type === 'image' || block.type === 'none') && (
              <Field label="Image">
                <LinkField
                  value={block.image || ''}
                  onChange={(v) => onUpdateDescBlock(idx, 'image', v)}
                  onUpload={(e) => onUploadDescBlockImage(e, idx)}
                  uploading={isUploading === `desc.image.${idx}`}
                />
              </Field>
            )}

            {block.type === 'video' && (
              <Field label="Video Embed URL">
                <LinkField
                  value={block.video || ''}
                  onChange={(v) => onUpdateDescBlock(idx, 'video', v)}
                />
              </Field>
            )}
          </div>
        ))}

        <Button
          type="button"
          onClick={onAddDescBlock}
          variant="ghost"
          className="h-10 w-full text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 rounded-xl hover:bg-zinc-900 flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          + Add description
        </Button>
      </div>
    </div>
  )
}
