'use client'

import { Controller } from 'react-hook-form'
import { Image as ImageIcon } from 'lucide-react'
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

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

        {/* Left: Cover previews + URLs */}
        <div className="space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Preview
          </Label>

          {/* 4:3 cover */}
          <div
            className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            style={{ aspectRatio: '4/3' }}
          >
            {watchedProject.coverImage ? (
              <img
                src={watchedProject.coverImage}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-zinc-800" />
              </div>
            )}
            <span className="absolute bottom-2 right-2 text-[10px] font-bold text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded">
              4:3
            </span>
          </div>

          {/* 4:6 animated cover */}
          <div
            className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            style={{ aspectRatio: '4/6' }}
          >
            {watchedProject.coverAnimated ? (
              <img
                src={watchedProject.coverAnimated}
                alt="cover animated"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-zinc-800" />
              </div>
            )}
            <span className="absolute bottom-2 right-2 text-[10px] font-bold text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded">
              4:6
            </span>
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
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.[0] ?? ''}
                    onValueChange={(v) => field.onChange([v])}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 h-10 rounded-lg">
                      <SelectValue placeholder="Select platform..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
                      {['PC', 'Mobile', 'VR', 'Console'].map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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
