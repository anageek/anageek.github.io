"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Loader2,
  Gamepad2,
  Palette,
  Boxes,
  Grid,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/categories")
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const action = categories.find(c => c.slug === currentCategory.slug) && !currentCategory.isNew ? "update" : "create"
    
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ action, category: currentCategory }),
      })
      if (response.ok) {
         toast.success(`Category ${action === 'create' ? 'created' : 'updated'} successfully!`)
         setIsEditing(false)
         fetchCategories()
      } else {
          toast.error("Error saving category")
      }
    } catch (err) {
      toast.error("Error communicating with server")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ action: "delete", category: currentCategory }),
      })
      if (response.ok) {
         toast.success("Category deleted successfully")
         setDeleteConfirmOpen(false)
         fetchCategories()
      } else {
         toast.error("Error deleting category")
      }
    } catch (err) {
      toast.error("Error communicating with server")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleVisibility = async (category: any) => {
    const updated = { ...category, visible: category.visible !== false ? false : true }
    
    setCategories(prev => prev.map(c => c.slug === category.slug ? updated : c))

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ action: "update", category: updated }),
      })
      if (!response.ok) {
        toast.error("Error updating category")
        setCategories(prev => prev.map(c => c.slug === category.slug ? category : c))
      }
    } catch {
      toast.error("Error communicating with server")
      setCategories(prev => prev.map(c => c.slug === category.slug ? category : c))
    }
  }

  const openEdit = (category: any) => {
    setCurrentCategory({ ...category, isNew: false })
    setIsEditing(true)
  }

  const openNew = () => {
    setCurrentCategory({
      label: "",
      slug: "",
      icon: "Palette",
      isNew: true
    })
    setIsEditing(true)
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4" />
      case 'Palette': return <Palette className="w-4 h-4" />
      case 'Boxes': return <Boxes className="w-4 h-4" />
      default: return <Grid className="w-4 h-4" />
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
       <p className="text-zinc-500 text-sm font-medium">Loading categories...</p>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-4xl font-black text-white tracking-tighter">Categories</h1>
           <p className="text-zinc-500 text-sm mt-1">Manage the types of projects displayed on your portfolio.</p>
        </div>
        <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold h-12 px-8 rounded-xl transition-all hover:scale-[1.02]">
           <Plus className="w-5 h-5" />
           New Category
        </Button>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl">
         <Table>
            <TableHeader className="bg-zinc-950/60 border-b border-zinc-900">
               <TableRow className="hover:bg-transparent border-zinc-900">
                  <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5 px-8">Icon</TableHead>
                  <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">Name</TableHead>
                  <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">Slug (JSON Key)</TableHead>
                  <TableHead className="text-right text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5 pr-8">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {categories.map((category) => (
                  <TableRow key={category.slug} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors group">
                     <TableCell className="px-8">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-blue-500 border border-zinc-800 group-hover:border-blue-500/30 transition-all">
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
                             title={category.visible !== false ? "Visible (Click to hide)" : "Hidden (Click to show)"}
                             className={`w-9 h-9 rounded-lg border transition-all ${
                               category.visible !== false
                                 ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                 : "bg-zinc-950 border-zinc-800 text-zinc-700 hover:text-zinc-400"
                             }`}
                           >
                              {category.visible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                           </Button>
                           <Button onClick={() => openEdit(category)} variant="ghost" size="icon" className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all">
                              <Edit2 className="w-4 h-4" />
                           </Button>
                           <Button onClick={() => { setCurrentCategory(category); setDeleteConfirmOpen(true); }} variant="ghost" size="icon" className="w-9 h-9 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500/50 hover:text-red-400 transition-all">
                              <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
         <DialogContent className="bg-zinc-950 border-zinc-900 text-zinc-300 p-8 shadow-2xl rounded-3xl">
            <DialogHeader>
               <DialogTitle className="text-2xl font-black text-white tracking-tighter">
                  {currentCategory?.isNew ? 'New Category' : 'Edit Category'}
               </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-6 mt-4">
               <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-zinc-500">Category Name</Label>
                  <Input 
                    value={currentCategory?.label || ""} 
                    onChange={(e) => setCurrentCategory({...currentCategory, label: e.target.value})}
                    className="bg-zinc-900/60 border-zinc-800 h-11 rounded-xl"
                    placeholder="e.g. Mobile Games"
                    required
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-zinc-500">Slug (Unique ID)</Label>
                  <Input 
                    value={currentCategory?.slug || ""} 
                    onChange={(e) => setCurrentCategory({...currentCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    className="bg-zinc-900/60 border-zinc-800 h-11 rounded-xl font-mono text-sm"
                    placeholder="e.g. mobile-games"
                    disabled={!currentCategory?.isNew}
                    required
                  />
                  {currentCategory?.isNew && <p className="text-[10px] text-zinc-600">This will be the identifier in the JSON file.</p>}
               </div>
               <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-zinc-500">Icon</Label>
                  <Select 
                    value={currentCategory?.icon || "Palette"} 
                    onValueChange={(val) => setCurrentCategory({...currentCategory, icon: val})}
                  >
                    <SelectTrigger className="bg-zinc-900/60 border-zinc-800 h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
                      <SelectItem value="Gamepad2">Gamepad (Games)</SelectItem>
                      <SelectItem value="Palette">Palette (Design/UI)</SelectItem>
                      <SelectItem value="Boxes">Boxes (Modeling)</SelectItem>
                      <SelectItem value="Grid">Grid (Others)</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <DialogFooter className="pt-4 gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="h-12 rounded-xl px-6">Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-10 rounded-xl flex-1">
                     {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Category"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
         <DialogContent className="max-w-md bg-zinc-950 border-zinc-900 text-zinc-300 p-8 shadow-2xl rounded-3xl">
            <div className="flex flex-col items-center text-center gap-6">
               <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Trash2 className="w-8 h-8" />
               </div>
               <div>
                  <DialogTitle className="text-2xl font-black text-white tracking-tighter mb-2">Delete Category?</DialogTitle>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                     This will remove the category <span className="text-white font-bold">"{currentCategory?.label}"</span> from the sidebar. Projects saved under the slug "{currentCategory?.slug}" will not be deleted, but may become inaccessible in the dashboard.
                  </p>
               </div>
            </div>
            <DialogFooter className="flex items-center gap-3 mt-8">
               <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="flex-1 h-12 rounded-xl">Cancel</Button>
               <Button onClick={handleDelete} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl">
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Delete"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}
