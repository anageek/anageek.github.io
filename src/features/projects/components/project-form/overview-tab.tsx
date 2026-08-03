'use client'

import { useRef } from 'react'
import { Controller } from 'react-hook-form'
import { Image as ImageIcon, Upload, X } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { UseFormReturn } from 'react-hook-form'
import type { ChangeEvent } from 'react'
import type { ProjectFormValues } from '@/features/projects/types/project'

interface CategoryOption {
  id: number
  slug: string
  label: string
}

interface OverviewTabProps {
  form: UseFormReturn<ProjectFormValues>
  categories: CategoryOption[]
  isUploading: string | null
  onFieldUpload: (e: ChangeEvent<HTMLInputElement>, fieldName: string) => void
}

export function OverviewTab({ form, categories, isUploading, onFieldUpload }: OverviewTabProps) {
  const { register, control, setValue, watch, formState: { errors } } = form
  const watchedProject = watch()
  const coverImageRef = useRef<HTMLInputElement>(null)
  const coverAnimatedRef = useRef<HTMLInputElement>(null)

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

        {/* Left: Cover previews + URLs */}
        <div className="space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Preview
          </Label>

          {/* Cover — proporção 3:4 (portrait, igual ao card real) */}
          <div
            className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer group"
            style={{ aspectRatio: '3/4' }}
            onClick={() => coverImageRef.current?.click()}
            title="Clique para fazer upload"
          >
            {watchedProject.coverImage ? (
              <>
                <img src={watchedProject.coverImage} alt="cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                  <Upload className="w-4 h-4 text-white" />
                  <span className="text-xs text-white font-medium">Substituir</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setValue('coverImage', '') }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 group-hover:bg-zinc-800/40 transition-colors">
                <Upload className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors">Cover</span>
              </div>
            )}
            {isUploading === 'coverImage' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                <span className="text-xs text-white">Enviando...</span>
              </div>
            )}
            <span className="absolute bottom-2 left-2 text-[10px] font-bold text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded z-10">
              Cover
            </span>
            <input ref={coverImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFieldUpload(e, 'coverImage')} />
          </div>

          {/* Cover Animado — proporção 2:3 */}
          <div
            className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer group"
            style={{ aspectRatio: '2/3' }}
            onClick={() => coverAnimatedRef.current?.click()}
            title="Clique para fazer upload"
          >
            {watchedProject.coverAnimated ? (
              <>
                <img src={watchedProject.coverAnimated} alt="cover animado" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                  <Upload className="w-4 h-4 text-white" />
                  <span className="text-xs text-white font-medium">Substituir</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setValue('coverAnimated', '') }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 group-hover:bg-zinc-800/40 transition-colors">
                <Upload className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors">Cover Animado</span>
              </div>
            )}
            {isUploading === 'coverAnimated' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                <span className="text-xs text-white">Enviando...</span>
              </div>
            )}
            <span className="absolute bottom-2 left-2 text-[10px] font-bold text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded z-10">
              Hover
            </span>
            <input ref={coverAnimatedRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFieldUpload(e, 'coverAnimated')} />
          </div>

          <Field label="URL Cover">
            <LinkField
              value={watchedProject.coverImage ?? ''}
              onChange={(v) => setValue('coverImage', v)}
              onUpload={(e) => onFieldUpload(e, 'coverImage')}
              uploading={isUploading === 'coverImage'}
            />
          </Field>

          <Field label="URL Cover (Hovering)">
            <LinkField
              value={watchedProject.coverAnimated ?? ''}
              onChange={(v) => setValue('coverAnimated', v)}
              onUpload={(e) => onFieldUpload(e, 'coverAnimated')}
              uploading={isUploading === 'coverAnimated'}
            />
          </Field>
        </div>

        {/* Right: Metadata fields */}
        <div className="space-y-4">
          <Field label="Category" error={errors.categoryId?.message}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 h-10 rounded-lg">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field label="Project Name" error={errors.title?.message}>
            <Input
              {...register('title')}
              className="bg-zinc-900 border-zinc-800 h-10 text-white font-bold rounded-lg"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Genre">
              <Input
                {...register('subCategory')}
                className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
              />
            </Field>
            <Field label="Role">
              <Input
                {...register('role')}
                className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Developed By">
              <Input
                {...register('company')}
                className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
              />
            </Field>
            <Field label="Status">
              <Input
                {...register('status')}
                className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tools Used">
              <Input
                {...register('tools')}
                className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
              />
            </Field>
            <Field label="Platform">
              <div className="flex flex-wrap gap-3">
                {['PC', 'Mobile', 'VR', 'Console'].map((p) => {
                  const platforms = form.watch('platform') || []
                  const isSelected = platforms.includes(p)
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        const current = form.getValues('platform') || []
                        if (current.includes(p)) {
                          form.setValue('platform', current.filter((x: string) => x !== p))
                        } else {
                          form.setValue('platform', [...current, p])
                        }
                      }}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
                        isSelected
                          ? 'bg-primary/20 border-primary/30 text-primary'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'
                      )}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              {...register('description')}
              rows={4}
              className="bg-zinc-900 border-zinc-800 resize-none rounded-lg text-sm leading-relaxed"
            />
          </Field>

          <Field label="CTA Display Name">
            <Input
              {...register('designBtnLabel')}
              className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
            />
          </Field>

          <Field label="CTA">
            <LinkField
              value={watchedProject.designUrl ?? ''}
              onChange={(v) => setValue('designUrl', v)}
            />
          </Field>
        </div>
      </div>
    </div>
  )
}
