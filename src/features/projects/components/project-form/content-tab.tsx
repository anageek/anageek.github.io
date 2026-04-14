'use client'

import { Plus, Eye, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LinkField } from '@/components/forms/link-field'
import type { UseFormReturn } from 'react-hook-form'
import type { ChangeEvent } from 'react'
import type { ProjectFormValues } from '@/features/projects/types/project'

interface FieldItem {
  id: string
  [key: string]: unknown
}

interface FieldArrayLike {
  fields: FieldItem[]
  append: (value: unknown) => void
  remove: (index: number) => void
}

interface ContentTabProps {
  form: UseFormReturn<ProjectFormValues>
  imageFieldArray: FieldArrayLike
  sectionFieldArray: FieldArrayLike
  isUploading: string | null
  onSectionOpen: (index: number | null) => void
  onFieldUpload: (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: string,
    index?: number,
  ) => void
}

export function ContentTab({
  form,
  imageFieldArray,
  sectionFieldArray,
  isUploading,
  onSectionOpen,
  onFieldUpload,
}: ContentTabProps) {
  const { setValue, watch } = form
  const watchedProject = watch()

  const { fields: imageFields, append: appendImage, remove: removeImage } = imageFieldArray
  const { fields: sectionFields, remove: removeSection } = sectionFieldArray

  return (
    <div className="p-8 space-y-8">

      {/* Sections table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Sections
          </Label>
          <Button
            type="button"
            onClick={() => onSectionOpen(null)}
            className="h-9 px-5 text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            + Add Section
          </Button>
        </div>

        <div className="border border-zinc-800 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-950/80">
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead className="text-zinc-600 text-[10px] uppercase font-black tracking-widest py-4 w-16 text-center">
                  ID
                </TableHead>
                <TableHead className="text-zinc-600 text-[10px] uppercase font-black tracking-widest py-4">
                  Section
                </TableHead>
                <TableHead className="text-zinc-600 text-[10px] uppercase font-black tracking-widest py-4 text-right pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectionFields.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-16 text-zinc-600 text-sm font-medium"
                  >
                    No sections yet. Click &quot;+ Add Section&quot; to create one.
                  </TableCell>
                </TableRow>
              ) : (
                sectionFields.map((field, idx) => (
                  <TableRow
                    key={field.id}
                    className="border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                  >
                    <TableCell className="text-center text-zinc-700 font-mono text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="text-zinc-300 text-[11px] font-black uppercase tracking-widest">
                      {String(field.title ?? '')}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onSectionOpen(idx)}
                          className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSection(idx)}
                          className="w-8 h-8 rounded-lg bg-red-500/5 border border-red-500/20 hover:bg-red-500/20 text-red-500/60 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-4 pt-4 border-t border-zinc-900">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Image Gallery
          </Label>
          <Button
            type="button"
            onClick={() => appendImage('')}
            variant="ghost"
            className="h-8 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
          >
            <Plus className="w-3 h-3 mr-1.5" />
            Add Image
          </Button>
        </div>

        <div className="space-y-2">
          {imageFields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="flex-1">
                <LinkField
                  value={(watchedProject.images?.[idx] as string) ?? ''}
                  onChange={(v) => setValue(`images.${idx}` as never, v as never)}
                  onUpload={(e) => onFieldUpload(e, 'images', idx)}
                  uploading={isUploading === `images.${idx}`}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeImage(idx)}
                className="w-8 h-8 text-zinc-600 hover:text-red-500 rounded-lg hover:bg-red-500/10 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
