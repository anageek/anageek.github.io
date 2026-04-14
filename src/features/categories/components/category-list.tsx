'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Gamepad2,
  Palette,
  Boxes,
  Grid,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { updateCategory, deleteCategory } from '@/features/categories'
import type { Category } from '@/features/categories'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { CategoryForm } from './category-form'

interface CategoryListProps {
  categories: Category[]
}

function getIcon(iconName: string) {
  switch (iconName) {
    case 'Gamepad2':
      return <Gamepad2 className="w-4 h-4" />
    case 'Palette':
      return <Palette className="w-4 h-4" />
    case 'Boxes':
      return <Boxes className="w-4 h-4" />
    default:
      return <Grid className="w-4 h-4" />
  }
}

export function CategoryList({ categories: initialCategories }: CategoryListProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>(initialCategories)

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined)

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = categories.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()),
  )

  const handleToggleVisibility = async (category: Category) => {
    const updated = { ...category, visible: !category.visible }
    setCategories((prev) => prev.map((c) => (c.id === category.id ? updated : c)))

    try {
      const result = await updateCategory(category.id, {
        label: category.label,
        icon: category.icon,
        visible: updated.visible,
      })
      if (result && !result.success) {
        toast.error('Error updating category')
        setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)))
      }
      router.refresh()
    } catch {
      toast.error('Error communicating with server')
      setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)))
    }
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setFormOpen(true)
  }

  const openNew = () => {
    setEditingCategory(undefined)
    setFormOpen(true)
  }

  const openDelete = (category: Category) => {
    setDeletingCategory(category)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingCategory) return
    setIsDeleting(true)
    try {
      const result = await deleteCategory(deletingCategory.id)
      if (result && !result.success) {
        toast.error(result.error ?? 'Error deleting category')
        return
      }
      toast.success('Category deleted successfully')
      setDeleteOpen(false)
      router.refresh()
    } catch {
      toast.error('Error communicating with server')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = () => {
    router.refresh()
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tighter">Categories</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage the types of projects displayed on your portfolio.
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-primary hover:bg-primary/90 text-white gap-2 font-medium shadow-lg shadow-primary/20 h-12 px-8 rounded-xl transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          New Category
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-zinc-900/60 border-zinc-800 rounded-lg h-10"
        />
      </div>

      <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl overflow-hidden backdrop-blur-3xl shadow-2xl">
        <Table>
          <TableHeader className="bg-zinc-950/60 border-b border-zinc-900">
            <TableRow className="hover:bg-transparent border-zinc-900">
              <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5 px-8">
                Icon
              </TableHead>
              <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">
                Name
              </TableHead>
              <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">
                Slug (JSON Key)
              </TableHead>
              <TableHead className="text-right text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5 pr-8">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="border-zinc-900">
                <TableCell colSpan={4} className="text-center py-12 text-zinc-600">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 opacity-30" />
                  No categories found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((category) => (
              <TableRow
                key={category.id}
                className="border-zinc-900 hover:bg-zinc-900/50 transition-colors group"
              >
                <TableCell className="px-8">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-primary border border-zinc-800 group-hover:border-primary/30 transition-all">
                    {getIcon(category.icon)}
                  </div>
                </TableCell>
                <TableCell className="text-white font-bold">{category.label}</TableCell>
                <TableCell className="text-zinc-500 font-mono text-xs">{category.slug}</TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      onClick={() => handleToggleVisibility(category)}
                      variant="ghost"
                      size="icon"
                      title={
                        category.visible !== false
                          ? 'Visible (Click to hide)'
                          : 'Hidden (Click to show)'
                      }
                      className={`w-9 h-9 rounded-lg border transition-all ${
                        category.visible !== false
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-700 hover:text-zinc-400'
                      }`}
                    >
                      {category.visible !== false ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => openEdit(category)}
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => openDelete(category)}
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500/50 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Category?"
        description={`This will remove the category "${deletingCategory?.label}" from the sidebar. Projects saved under the slug "${deletingCategory?.slug}" will not be deleted, but may become inaccessible in the dashboard.`}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  )
}
