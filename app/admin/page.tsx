"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Plus, Search, Edit2, Trash2, Calendar, Layers, Image as ImageIcon,
  CheckCircle2, XCircle, Loader2, Link as LinkIcon, Save, Upload,
  Eye, EyeOff, Star, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// ─── Schemas ─────────────────────────────────────────────────────────────────

const descBlockSchema = z.object({
  type: z.string().optional(),
  text: z.string().optional().default(""),
  image: z.string().optional().default(""),
  video: z.string().optional().default(""),
  items: z.array(z.string()).optional()
}).passthrough()

const sectionSchema = z.object({
  title: z.string().min(1, "Title required"),
  image: z.string().optional().default(""),
  video: z.string().optional().default(""),
  description: z.array(descBlockSchema).default([])
})

const projectSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  role: z.string().optional().default(""),
  company: z.string().optional().default(""),
  status: z.string().optional().default(""),
  category: z.string().optional().default(""),
  projectCategory: z.string().optional().default(""),
  platform: z.array(z.string()).optional().default([]),
  description: z.string().optional().default(""),
  tools: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  coverAnimated: z.string().optional().default(""),
  images: z.array(z.string()).optional().default([]),
  videoUrl: z.string().optional().default(""),
  designurl: z.string().optional().default(""),
  designButtonLabel: z.string().optional().default(""),
  sections: z.array(sectionSchema).default([]),
  visible: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false)
})

type ProjectFormValues = z.infer<typeof projectSchema>
type SectionDraft = {
  title: string
  image: string
  video: string
  description: Array<{ type?: string; text?: string; image?: string; video?: string; items?: string[] }>
}
type EditorTab = "overview" | "content" | "section"

// ─── Helper Components ────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-900/80 p-7 rounded-3xl flex items-center justify-between group hover:border-zinc-800 transition-all hover:translate-y-[-4px] shadow-lg shadow-black/20">
      <div>
        <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[2px]">{label}</p>
        <p className="text-4xl font-black text-white mt-2 group-hover:text-blue-500 transition-colors tracking-tighter">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl bg-zinc-950 border border-zinc-800/50 ${color} shadow-2xl shadow-black/40 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  )
}

function Field({ label, children, error }: any) {
  return (
    <div className="space-y-1.5">
      {children}
      {label && <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</Label>}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  )
}

function LinkField({ value, onChange, placeholder, onUpload, uploading }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploading?: boolean
}) {
  return (
    <div className="flex items-center h-10 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-3 border-r border-zinc-800 text-zinc-600 flex items-center">
        <LinkIcon className="w-3.5 h-3.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[11px] font-mono text-zinc-300 px-3 focus:outline-none placeholder:text-zinc-700 h-full"
      />
      {onUpload && (
        <label className="px-3 border-l border-zinc-800 text-zinc-600 hover:text-zinc-300 cursor-pointer transition-colors flex items-center h-full">
          {uploading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Upload className="w-3.5 h-3.5" />
          }
          <input type="file" className="hidden" accept="image/*,video/*,image/gif" onChange={onUpload} disabled={uploading} />
        </label>
      )}
    </div>
  )
}

function ChevronTabs({ active, tabs, onChange }: {
  active: string
  tabs: string[]
  onChange: (t: string) => void
}) {
  return (
    <div className="flex items-center">
      {tabs.map((tab, i) => {
        const isActive = active === tab.toLowerCase()
        const isFirst = i === 0
        const isLast = i === tabs.length - 1
        const clip = isFirst
          ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
          : isLast
          ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 14px 50%)"
          : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)"

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab.toLowerCase())}
            style={{ clipPath: clip }}
            className={[
              "px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-all select-none",
              i > 0 ? "-ml-2" : "",
              isActive ? "bg-white text-black z-10 relative" : "bg-zinc-900 text-zinc-500 hover:text-zinc-300 z-0 relative"
            ].join(" ")}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}

// ─── Page Entry ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-blue-500">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    }>
      <AdminContent />
    </Suspense>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

function AdminContent() {
  const [projectsData, setProjectsData] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploading, setIsUploading] = useState<string | null>(null)

  // Editor tab state
  const [activeTab, setActiveTab] = useState<EditorTab>("overview")
  const [sectionDraft, setSectionDraft] = useState<SectionDraft>({
    title: "", image: "", video: "", description: []
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category") || "games"

  const {
    register, handleSubmit, reset, control, watch, setValue, getValues,
    formState: { errors }
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { platform: [], images: [], sections: [] }
  })

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control, name: "images" as any
  })
  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control, name: "sections" as any
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    try {
      const [projResp, catResp] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/categories")
      ])
      setProjectsData(await projResp.json())
      setCategories(await catResp.json())
    } catch {
      toast.error("Failed to load data")
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const data = await res.json()
      return data.url ?? null
    } catch {
      return null
    }
  }

  const handleFieldUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    index?: number
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const key = index !== undefined ? `${fieldName}.${index}` : fieldName
    setIsUploading(key)
    const url = await uploadFile(file)
    if (url) {
      setValue(key as any, url)
      toast.success("Uploaded!")
    } else {
      toast.error("Upload failed")
    }
    setIsUploading(null)
  }

  // ── Section tab management ────────────────────────────────────────────────

  const openSection = (index: number | null) => {
    if (index !== null) {
      const secs = getValues("sections") || []
      const sec = secs[index] as any
      setSectionDraft({
        title: sec.title ?? "",
        image: sec.image ?? "",
        video: sec.video ?? "",
        description: (sec.description ?? []).map((d: any) => ({
          type: d.type ?? "",
          text: d.text ?? "",
          image: d.image ?? "",
          video: d.video ?? "",
          items: d.items ?? []
        }))
      })
    } else {
      setSectionDraft({ title: "", image: "", video: "", description: [] })
    }
    setEditingIndex(index)
    setActiveTab("section")
  }

  const saveSection = () => {
    if (!sectionDraft.title.trim()) {
      toast.error("Section title is required")
      return
    }
    const secs = [...(getValues("sections") || [])] as any[]
    if (editingIndex !== null) {
      secs[editingIndex] = {
        ...sectionDraft,
        // Ensure image/video are set explicitly if needed
      }
      setValue("sections", secs)
    } else {
      appendSection(sectionDraft as any)
    }
    setActiveTab("content")
  }

  const addDescBlock = () => setSectionDraft(p => ({
    ...p, description: [...p.description, { type: "", text: "", image: "", video: "", items: [] }]
  }))

  const removeDescBlock = (i: number) => setSectionDraft(p => ({
    ...p, description: p.description.filter((_, idx) => idx !== i)
  }))

  const updateDescBlock = (i: number, field: "type" | "text" | "image" | "video", val: string) =>
    setSectionDraft(p => {
      const desc = [...p.description]
      desc[i] = { ...desc[i], [field]: val }
      return { ...p, description: desc }
    })

  const updateDescListItems = (i: number, itemsStr: string) =>
    setSectionDraft(p => {
      const desc = [...p.description]
      desc[i] = { ...desc[i], items: itemsStr.split('\n').filter(s => s.trim() !== '') }
      return { ...p, description: desc }
    })

  const uploadSectionCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading("section.image")
    const url = await uploadFile(file)
    if (url) setSectionDraft(p => ({ ...p, image: url }))
    setIsUploading(null)
  }

  const uploadDescBlockImage = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(`desc.image.${idx}`)
    const url = await uploadFile(file)
    if (url) updateDescBlock(idx, "image", url)
    setIsUploading(null)
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleToggle = async (project: any, field: "visible" | "featured") => {
    const currentValue = field === "visible"
      ? project.visible !== false   // default: visible
      : project.featured === true   // default: not featured
    const updated = { ...project, [field]: !currentValue }
    
    // Optimistic UI update
    setProjectsData((prev: any) => {
      if (!prev || !prev[categoryFilter]) return prev;
      return {
        ...prev,
        [categoryFilter]: prev[categoryFilter].map((p: any) => 
          p.id === project.id ? updated : p
        )
      };
    });

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({ action: "update", category: categoryFilter, project: updated })
      })
      if (!res.ok) {
        toast.error("Error updating project")
        // Rollback
        setProjectsData((prev: any) => {
          if (!prev || !prev[categoryFilter]) return prev;
          return {
            ...prev,
            [categoryFilter]: prev[categoryFilter].map((p: any) => 
              p.id === project.id ? project : p
            )
          };
        });
      }
    } catch {
      toast.error("Error")
      // Rollback
      setProjectsData((prev: any) => {
        if (!prev || !prev[categoryFilter]) return prev;
        return {
          ...prev,
          [categoryFilter]: prev[categoryFilter].map((p: any) => 
            p.id === project.id ? project : p
          )
        };
      });
    }
  }

  const openDeleteConfirm = (project: any) => {
    setProjectToDelete(project)
    setDeleteConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({ action: "delete", category: categoryFilter, project: projectToDelete })
      })
      if (res.ok) {
        toast.success("Project deleted")
        setDeleteConfirmOpen(false)
        fetchData(false)
      } else {
        toast.error("Error deleting")
      }
    } catch {
      toast.error("Error")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = async (data: ProjectFormValues) => {
    setSaving(true)
    const action = data.id ? "update" : "create"
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({ 
          action, 
          category: data.projectCategory || categoryFilter, 
          originalCategory: categoryFilter,
          project: data 
        })
      })
      if (res.ok) {
        toast.success(`Project ${action === "create" ? "created" : "updated"}!`)
        setIsEditing(false)
        fetchData(false)
      } else {
        toast.error("Error saving project")
      }
    } catch {
      toast.error("Error")
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (project: any) => {
    reset({ ...project, projectCategory: categoryFilter })
    setActiveTab("overview")
    setIsEditing(true)
  }

  const openNew = () => {
    reset({
      title: "", role: "", company: "", status: "", category: "", projectCategory: categoryFilter,
      platform: [], description: "", tools: "",
      coverImage: "", coverAnimated: "",
      videoUrl: "", designurl: "", designButtonLabel: "",
      images: [], sections: []
    })
    setActiveTab("overview")
    setIsEditing(true)
  }

  const watchedProject = watch()

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <p className="text-zinc-500 text-sm font-medium">Syncing with projects.json...</p>
    </div>
  )

  const filteredProjects = projectsData?.[categoryFilter]?.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-blue-500/20 text-blue-500 bg-blue-500/5 text-[9px] uppercase tracking-widest font-black px-2 py-0.5">
              Content Manager
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-white capitalize tracking-tighter">{categoryFilter}</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your {categoryFilter} projects and details.</p>
        </div>
        <Button
          onClick={openNew}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-lg shadow-blue-600/20 h-12 px-8 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          New Project
        </Button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Projects" value={projectsData?.[categoryFilter]?.length || 0} icon={<Layers />} color="text-blue-400" />
        <StatCard label="Active Pages" value={filteredProjects.length} icon={<CheckCircle2 />} color="text-emerald-400" />
        <StatCard label="Last Update" value="Today" icon={<Calendar />} color="text-blue-400" />
      </div>

      {/* ── Projects Table ─────────────────────────────────────────────────── */}
      <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="p-6 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/40">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-600" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-zinc-950/60 border-zinc-800 text-zinc-200 rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-950/60 border-b border-zinc-900">
              <TableRow className="hover:bg-transparent border-zinc-900">
                <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest text-center py-5 w-16">ID</TableHead>
                <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">Project</TableHead>
                <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">Company / Role</TableHead>
                <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">Status</TableHead>
                <TableHead className="text-right text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <XCircle className="w-10 h-10 text-zinc-800" />
                      <p className="text-zinc-600 font-medium">No projects found in this category.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProjects.map((project: any) => (
                <TableRow key={project.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors group">
                  <TableCell className="text-center text-zinc-700 font-mono text-xs">{project.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-blue-500/30 p-1 transition-all">
                        {project.coverImage && (
                          <img src={project.coverImage} alt="" className="w-full h-full object-cover rounded-[10px]" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-black text-base tracking-tight leading-none mb-1.5">{project.title}</p>
                        <span className="text-zinc-500 text-[10px] uppercase font-bold">
                          {project.tools?.split(",")[0]}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-zinc-300 font-bold">{project.company}</p>
                    <p className="text-[10px] font-medium uppercase text-zinc-600">{project.role}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${project.status ? "bg-blue-500" : "bg-zinc-700"}`} />
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                        {project.status || "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      {/* Visible toggle */}
                      <Button
                        onClick={() => handleToggle(project, "visible")}
                        variant="ghost" size="icon"
                        title={project.visible !== false ? "Visible — click to hide" : "Hidden — click to show"}
                        className={`w-9 h-9 rounded-lg border transition-all ${
                          project.visible !== false
                            ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            : "bg-zinc-950 border-zinc-800 text-zinc-700 hover:text-zinc-400"
                        }`}
                      >
                        {project.visible !== false
                          ? <Eye className="w-4 h-4" />
                          : <EyeOff className="w-4 h-4" />
                        }
                      </Button>
                      {/* Featured toggle */}
                      <Button
                        onClick={() => handleToggle(project, "featured")}
                        variant="ghost" size="icon"
                        title={project.featured ? "Featured — click to unfeature" : "Not featured — click to feature"}
                        className={`w-9 h-9 rounded-lg border transition-all ${
                          project.featured
                            ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                            : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${project.featured ? "fill-yellow-400" : ""}`} />
                      </Button>
                      {/* Edit */}
                      <Button
                        onClick={() => openEdit(project)}
                        variant="ghost" size="icon"
                        className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {/* Delete */}
                      <Button
                        onClick={() => openDeleteConfirm(project)}
                        variant="ghost" size="icon"
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
      </div>

      {/* ── Editor Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] overflow-hidden bg-zinc-950 border-zinc-900 text-zinc-300 p-0 shadow-2xl rounded-3xl flex flex-col">

          {/* Dialog Header */}
          <DialogHeader className="p-8 pb-0 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl shrink-0">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black text-white tracking-tighter">
                    {watchedProject?.id ? "Edit Project" : "New Project"}
                  </DialogTitle>
                  <p className="text-zinc-500 text-xs font-medium mt-0.5">
                    Configure todas as propriedades e visualizações da página do projeto.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="text-zinc-500 font-black text-xs uppercase tracking-widest px-6 hover:bg-zinc-900"
                >
                  DESCARTAR
                </Button>

                {activeTab === "section" ? (
                  <Button
                    type="button"
                    onClick={saveSection}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest px-8 h-10 rounded-xl shadow-xl shadow-blue-600/20"
                  >
                    Save Section
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={saving}
                    onClick={handleSubmit(handleSave)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest px-8 h-10 rounded-xl shadow-xl shadow-blue-600/20 flex items-center gap-2"
                  >
                    {saving
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><Save className="w-4 h-4" /> PUBLICAR ALTERAÇÕES</>
                    }
                  </Button>
                )}
              </div>
            </div>

            <ChevronTabs
              active={activeTab}
              tabs={["Overview", "Content", "Section"]}
              onChange={(t) => {
                if (t === "section" && activeTab !== "section") {
                  openSection(null)
                } else {
                  setActiveTab(t as EditorTab)
                }
              }}
            />
          </DialogHeader>

          {/* ── Tab Content ─────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">

            {/* OVERVIEW ───────────────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

                  {/* Left: Cover previews + URLs */}
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Preview</Label>

                    {/* 4:3 cover */}
                    <div
                      className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                      style={{ aspectRatio: "4/3" }}
                    >
                      {watchedProject?.coverImage
                        ? <img src={watchedProject.coverImage} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-zinc-800" /></div>
                      }
                      <span className="absolute bottom-2 right-2 text-[9px] font-black text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded">
                        4:3
                      </span>
                    </div>

                    {/* 4:6 animated cover */}
                    <div
                      className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                      style={{ aspectRatio: "4/6" }}
                    >
                      {watchedProject?.coverAnimated
                        ? <img src={watchedProject.coverAnimated} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-zinc-800" /></div>
                      }
                      <span className="absolute bottom-2 right-2 text-[9px] font-black text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded">
                        4:6
                      </span>
                    </div>

                    <Field label="URL Cover">
                      <LinkField
                        value={watchedProject?.coverImage ?? ""}
                        onChange={(v) => setValue("coverImage", v)}
                        onUpload={(e) => handleFieldUpload(e, "coverImage")}
                        uploading={isUploading === "coverImage"}
                      />
                    </Field>

                    <Field label="URL Cover(Hovering)">
                      <LinkField
                        value={watchedProject?.coverAnimated ?? ""}
                        onChange={(v) => setValue("coverAnimated", v)}
                        onUpload={(e) => handleFieldUpload(e, "coverAnimated")}
                        uploading={isUploading === "coverAnimated"}
                      />
                    </Field>
                  </div>

                  {/* Right: Metadata fields */}
                  <div className="space-y-4">
                    <Field label="Project Name" error={errors.title?.message}>
                      <Input
                        {...register("title")}
                        className="bg-zinc-900 border-zinc-800 h-10 text-white font-bold rounded-lg"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Genre">
                        <Input
                          {...register("category")}
                          className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
                        />
                      </Field>
                      <Field label="Role">
                        <Input
                          {...register("role")}
                          className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Developed By">
                        <Input
                          {...register("company")}
                          className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
                        />
                      </Field>
                      <Field label="Status">
                        <Input
                          {...register("status")}
                          className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Tools Used">
                        <Input
                          {...register("tools")}
                          className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
                        />
                      </Field>
                      <Field label="Category">
                        <Controller
                          name="platform"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value?.[0] ?? ""}
                              onValueChange={(v) => field.onChange([v])}
                            >
                              <SelectTrigger className="bg-zinc-900 border-zinc-800 h-10 rounded-lg">
                                <SelectValue placeholder="Select platform..." />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-950 border-zinc-900 text-zinc-300">
                                {["PC", "Mobile", "VR", "Console"].map((p) => (
                                  <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </Field>
                    </div>

                    <Field label="Description">
                      <Textarea
                        {...register("description")}
                        rows={4}
                        className="bg-zinc-900 border-zinc-800 resize-none rounded-lg text-sm leading-relaxed"
                      />
                    </Field>

                    <Field label="CTA Display Name">
                      <Input
                        {...register("designButtonLabel")}
                        className="bg-zinc-900 border-zinc-800 h-10 rounded-lg"
                      />
                    </Field>

                    <Field label="CTA">
                      <LinkField
                        value={watchedProject?.designurl ?? ""}
                        onChange={(v) => setValue("designurl", v)}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENT ────────────────────────────────────────────────────── */}
            {activeTab === "content" && (
              <div className="p-8 space-y-8">

                {/* Sections table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sections</Label>
                    <Button
                      type="button"
                      onClick={() => openSection(null)}
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
                          <TableHead className="text-zinc-600 text-[10px] uppercase font-black tracking-widest py-4 w-16 text-center">ID</TableHead>
                          <TableHead className="text-zinc-600 text-[10px] uppercase font-black tracking-widest py-4">Section</TableHead>
                          <TableHead className="text-zinc-600 text-[10px] uppercase font-black tracking-widest py-4 text-right pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sectionFields.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-16 text-zinc-600 text-sm font-medium">
                              No sections yet. Click "+ Add Section" to create one.
                            </TableCell>
                          </TableRow>
                        ) : sectionFields.map((field: any, idx) => (
                          <TableRow key={field.id} className="border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                            <TableCell className="text-center text-zinc-700 font-mono text-xs">{idx + 1}</TableCell>
                            <TableCell className="text-zinc-300 text-[11px] font-black uppercase tracking-widest">
                              {field.title}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openSection(idx)}
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
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Gallery */}
                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Image Gallery</Label>
                    <Button
                      type="button"
                      onClick={() => appendImage("" as any)}
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
                            value={(watchedProject?.images?.[idx] as any) ?? ""}
                            onChange={(v) => setValue(`images.${idx}` as any, v)}
                            onUpload={(e) => handleFieldUpload(e, "images", idx)}
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
            )}

            {/* SECTION ────────────────────────────────────────────────────── */}
            {activeTab === "section" && (
              <div className="p-8 space-y-6">

                <Field label="Header">
                  <Input
                    value={sectionDraft.title}
                    onChange={(e) => setSectionDraft(p => ({ ...p, title: e.target.value }))}
                    className="bg-zinc-900 border-zinc-800 h-10 text-white font-bold rounded-lg"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Image (Change Layout)">
                    <LinkField
                      value={sectionDraft.image}
                      onChange={(v) => setSectionDraft(p => ({ ...p, image: v }))}
                      onUpload={uploadSectionCoverImage}
                      uploading={isUploading === "section.image"}
                    />
                  </Field>
                  <Field label="Video">
                    <LinkField
                      value={sectionDraft.video}
                      onChange={(v) => setSectionDraft(p => ({ ...p, video: v }))}
                    />
                  </Field>
                </div>

                {/* Description blocks */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Description</Label>

                  {sectionDraft.description.length === 0 && (
                    <p className="text-zinc-700 text-sm py-4 text-center border border-dashed border-zinc-800 rounded-xl">
                      No description blocks yet.
                    </p>
                  )}

                  {sectionDraft.description.map((block, idx) => (
                    <div key={idx} className="relative border border-zinc-800 rounded-xl p-5 space-y-4 bg-zinc-950/30">
                      <button
                        type="button"
                        onClick={() => removeDescBlock(idx)}
                        className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      <Field label="Block Type">
                        <Select
                          value={block.type || "none"}
                          onValueChange={(v) => updateDescBlock(idx, "type", v === "none" ? "" : v)}
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

                      {(!block.type || block.type === "paragraph" || block.type === "heading" || block.type === "none") && (
                        <Field label="Text">
                          <Textarea
                            value={block.text || ""}
                            onChange={(e) => updateDescBlock(idx, "text", e.target.value)}
                            rows={3}
                            className="bg-zinc-900 border-zinc-800 resize-none rounded-lg text-sm leading-relaxed"
                          />
                        </Field>
                      )}

                      {block.type === "list" && (
                        <Field label="List Items (one per line)">
                          <Textarea
                            value={(block.items || []).join('\n')}
                            onChange={(e) => updateDescListItems(idx, e.target.value)}
                            rows={4}
                            className="bg-zinc-900 border-zinc-800 resize-none rounded-lg text-sm leading-relaxed"
                          />
                        </Field>
                      )}

                      {(!block.type || block.type === "image" || block.type === "none") && (
                        <Field label="Image">
                          <LinkField
                            value={block.image || ""}
                            onChange={(v) => updateDescBlock(idx, "image", v)}
                            onUpload={(e) => uploadDescBlockImage(e, idx)}
                            uploading={isUploading === `desc.image.${idx}`}
                          />
                        </Field>
                      )}

                      {block.type === "video" && (
                        <Field label="Video Embed URL">
                          <LinkField
                            value={block.video || ""}
                            onChange={(v) => updateDescBlock(idx, "video", v)}
                          />
                        </Field>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={addDescBlock}
                    variant="ghost"
                    className="h-10 w-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 rounded-xl hover:bg-zinc-900 flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Add description
                  </Button>
                </div>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ─────────────────────────────────────────────────── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md bg-zinc-950 border-zinc-900 text-zinc-300 p-8 shadow-2xl rounded-3xl overflow-hidden">
          <div className="flex flex-col items-center text-center gap-6 py-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-white tracking-tighter mb-2">Confirm Delete</DialogTitle>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="text-zinc-200 font-bold">"{projectToDelete?.title}"</span>?
                This action cannot be undone.
              </p>
            </div>
          </div>
          <DialogFooter className="flex items-center gap-3 mt-6 sm:justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteConfirmOpen(false)}
              className="flex-1 text-zinc-500 font-black text-xs uppercase tracking-widest px-6 hover:bg-zinc-900 h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest px-6 h-12 rounded-xl shadow-lg shadow-red-600/20"
            >
              {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
