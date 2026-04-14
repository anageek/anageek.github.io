'use client'

import {
  Gamepad2,
  Palette,
  Boxes,
  Grid,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { toast } from 'sonner'
import { createCategory, updateCategory } from '@/features/categories'
import type { Category } from '@/features/categories'

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
  onSave?: () => void
}

interface FormState {
  label: string
  slug: string
  icon: string
}

export function CategoryForm({ open, onOpenChange, category, onSave }: CategoryFormProps) {
  const isEdit = Boolean(category)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>({
    label: category?.label ?? '',
    slug: category?.slug ?? '',
    icon: category?.icon ?? 'Palette',
  })

  // Reset form when dialog opens/closes or category changes
  const handleOpenChange = (val: boolean) => {
    if (val) {
      setForm({
        label: category?.label ?? '',
        slug: category?.slug ?? '',
        icon: category?.icon ?? 'Palette',
      })
    }
    onOpenChange(val)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit && category) {
        const result = await updateCategory(category.id, {
          label: form.label,
          icon: form.icon,
          visible: category.visible ?? true,
        })
        if (result && !result.success) {
          toast.error('Error updating category')
          return
        }
        toast.success('Category updated successfully!')
      } else {
        const result = await createCategory({
          label: form.label,
          slug: form.slug,
          icon: form.icon,
          visible: true,
        })
        if (result && !result.success) {
          toast.error('Error creating category')
          return
        }
        toast.success('Category created successfully!')
      }
      onOpenChange(false)
      onSave?.()
    } catch {
      toast.error('Error communicating with server')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-900 text-zinc-300 p-8 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white tracking-tighter">
            {isEdit ? 'Edit Category' : 'New Category'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-zinc-500">Category Name</Label>
            <Input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="bg-zinc-900/60 border-zinc-800 h-11 rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-zinc-500">Slug (Unique ID)</Label>
            <Input
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
              }
              className="bg-zinc-900/60 border-zinc-800 h-11 rounded-lg font-mono text-sm"
              disabled={isEdit}
              required
            />
            {!isEdit && (
              <p className="text-[10px] text-zinc-600">This will be the identifier in the database.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-zinc-500">Icon</Label>
            <Select
              value={form.icon}
              onValueChange={(val) => setForm({ ...form, icon: val })}
            >
              <SelectTrigger className="bg-zinc-900/60 border-zinc-800 h-11 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
                <SelectItem value="Gamepad2">
                  <span className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-primary" /> Games
                  </span>
                </SelectItem>
                <SelectItem value="Palette">
                  <span className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Design / UI
                  </span>
                </SelectItem>
                <SelectItem value="Boxes">
                  <span className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-primary" /> 3D / Modeling
                  </span>
                </SelectItem>
                <SelectItem value="Grid">
                  <span className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-primary" /> Others
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4 gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-lg px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-10 rounded-lg flex-1"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
