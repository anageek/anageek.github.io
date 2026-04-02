"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Calendar,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  Type,
  List as ListIcon,
  Link as LinkIcon,
  Save,
  Undo2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const projectSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  role: z.string().min(1, "Sua Role é obrigatória"),
  company: z.string().min(1, "Empresa é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  platform: z.array(z.string()).min(1, "Selecione ao menos uma plataforma"),
  description: z.string().min(10, "Descrição muito curta"),
  tools: z.string().min(1, "Ferramentas são obrigatórias"),
  coverImage: z.string().url("URL de capa inválida"),
  coverAnimated: z.string().optional(),
  videoUrl: z.string().optional(),
  designurl: z.string().optional(),
  designButtonLabel: z.string().optional(),
  images: z.array(z.string().url("URL de imagem inválida")).optional().default([]),
  sections: z.array(z.any()).optional().default([]),
})

type ProjectFormValues = z.infer<typeof projectSchema>

export default function AdminDashboard() {
  const [projectsData, setProjectsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category") || "games"

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  })

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images" as any,
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/projects")
      const data = await response.json()
      setProjectsData(data)
    } catch (err) {
      toast.error("Falha ao carregar projetos")
    } finally {
      setLoading(false)
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
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({ action: "delete", category: categoryFilter, project: projectToDelete }),
      })
      if (response.ok) {
         toast.success("Projeto excluído com sucesso")
         setDeleteConfirmOpen(false)
         fetchProjects()
      } else {
         toast.error("Erro ao excluir projeto")
      }
    } catch (err) {
      toast.error("Erro na comunicação com o servidor")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = async (data: ProjectFormValues) => {
    setSaving(true)
    const action = data.id ? "update" : "create"
    
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({ action, category: categoryFilter, project: data }),
      })
      if (response.ok) {
         toast.success(`Projeto ${action === 'create' ? 'criado' : 'atualizado'} com sucesso!`)
         setIsEditing(false)
         fetchProjects()
      } else {
          toast.error("Erro ao salvar projeto")
      }
    } catch (err) {
      toast.error("Erro na comunicação com o servidor")
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (project: any) => {
    reset(project)
    setIsEditing(true)
  }

  const openNew = () => {
    reset({
      title: "",
      role: "",
      company: "",
      status: "Alpha Version",
      category: categoryFilter,
      platform: ["PC"],
      description: "",
      tools: "",
      coverImage: "/images/projects/placeholder.png",
      coverAnimated: "",
      videoUrl: "",
      designurl: "",
      designButtonLabel: "View Project",
      images: [],
      sections: []
    })
    setIsEditing(true)
  }

  const watchedProject = watch()

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
       <p className="text-zinc-500 text-sm font-medium">Sincronizando com projetos.json...</p>
    </div>
  )

  const filteredProjects = projectsData[categoryFilter]?.filter((p: any) => 
    p.title.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="border-blue-500/20 text-blue-500 bg-blue-500/5 text-[9px] uppercase tracking-widest font-black px-2 py-0.5">Gestor de Conteúdo</Badge>
           </div>
           <h1 className="text-4xl font-black text-white capitalize tracking-tighter">{categoryFilter}</h1>
           <p className="text-zinc-500 text-sm mt-1">Gerencie a vitrine e detalhes dos seus projetos de {categoryFilter}.</p>
        </div>
        <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-lg shadow-blue-600/20 h-12 px-8 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
           <Plus className="w-5 h-5" />
           Novo Projeto
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="Total de Projetos" value={projectsData[categoryFilter]?.length || 0} icon={<Layers />} color="text-blue-400" />
         <StatCard label="Páginas Ativas" value={filteredProjects.length} icon={<CheckCircle2 />} color="text-emerald-400" />
         <StatCard label="Última Atualização" value="Hoje" icon={<Calendar />} color="text-blue-400" />
      </div>

      {/* Data Table */}
      <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl relative">
         <div className="p-6 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/40">
            <div className="relative flex-1 max-w-md group">
               <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
               <Input 
                 placeholder="Buscar por título ou tecnologia..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-11 h-11 bg-zinc-950/60 border-zinc-800 text-zinc-200 focus:ring-blue-500/20 rounded-xl" 
               />
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest hidden md:inline">Ordem por ID</span>
               <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 text-zinc-500 text-xs font-bold gap-2 hover:bg-zinc-900 rounded-xl h-10 px-4">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Mídia
               </Button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <Table>
               <TableHeader className="bg-zinc-950/60 border-b border-zinc-900">
                  <TableRow className="hover:bg-transparent border-zinc-900">
                     <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest text-center py-5 w-16">ID</TableHead>
                     <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">Projeto</TableHead>
                     <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">Empresa / Role</TableHead>
                     <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">Status</TableHead>
                     <TableHead className="text-right text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5 pr-8">Ações</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                       <TableCell colSpan={5} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-3">
                             <XCircle className="w-10 h-10 text-zinc-800" />
                             <p className="text-zinc-600 font-medium tracking-tight">Nenhum projeto encontrado nesta categoria.</p>
                             <Button onClick={() => setSearch("")} variant="link" className="text-blue-500 mt-2">Limpar filtros de busca</Button>
                          </div>
                       </TableCell>
                    </TableRow>
                  ) : filteredProjects.map((project: any) => (
                     <TableRow key={project.id} className="border-zinc-900 hover:bg-zinc-900/50 transition-colors group">
                        <TableCell className="text-center text-zinc-700 font-mono text-xs">{project.id}</TableCell>
                        <TableCell>
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-blue-500/30 p-1 transition-all shadow-inner group-hover:shadow-blue-500/10">
                                 <img src={project.coverImage} alt="" className="w-full h-full object-cover rounded-[10px]" />
                              </div>
                              <div>
                                 <p className="text-white font-black text-base tracking-tight leading-none mb-1.5">{project.title}</p>
                                 <div className="flex items-center gap-2">
                                    <span className="p-0 text-zinc-500 text-[10px] uppercase font-bold">
                                       {project.tools.split(',')[0]}
                                    </span>
                                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="text-[10px] text-zinc-600 font-medium ">{project.platform.join(', ')}</span>
                                 </div>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell>
                           <p className="text-xs text-zinc-300 font-bold tracking-tight mb-1">{project.company}</p>
                           <div className="flex items-center gap-1.5 text-zinc-600">
                              <Type className="w-3 h-3" />
                              <span className="text-[10px] font-medium uppercase tracking-tighter">{project.role}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${project.status?.includes('Alpha') ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{project.status}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                           <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                              <Button onClick={() => openEdit(project)} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all shadow-sm">
                                 <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button onClick={() => openDeleteConfirm(project)} variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500/50 hover:text-red-400 transition-all shadow-sm">
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

      {/* Full Screen Editor Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
         <DialogContent className="max-w-6xl w-[95vw] h-[90vh] overflow-hidden bg-zinc-950 border-zinc-900 text-zinc-300 p-0 shadow-2xl rounded-3xl flex flex-col">
            <DialogHeader className="p-8 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl shrink-0">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                       {watchedProject?.id ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                    </div>
                    <div>
                      <DialogTitle className="text-3xl font-black text-white tracking-tighter">{watchedProject?.id ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
                      <p className="text-zinc-500 text-sm mt-0.5 font-medium tracking-tight">Configure todas as propriedades e visualizações da página do projeto.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="text-zinc-500 font-black text-xs uppercase tracking-widest px-6 hover:bg-zinc-900">Descartar</Button>
                     <Button type="submit" form="project-form" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest px-10 h-12 rounded-xl shadow-2xl shadow-blue-600/20 group">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                           <span className="flex items-center gap-2">
                              <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              Publicar Alterações
                           </span>
                        )}
                     </Button>
                  </div>
               </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-12 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
               <form id="project-form" onSubmit={handleSubmit(handleSave)} className="space-y-16 max-w-4xl mx-auto">
                  {/* Visual Identitity */}
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                     <div className="lg:col-span-1 space-y-4">
                        <SectionHeader title="Mídias Principais" subtitle="Capas e Vídeos" />
                        <div className="space-y-6">
                           <div className="group relative aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-inner flex items-center justify-center">
                              {watchedProject?.coverImage ? (
                                 <img src={watchedProject.coverImage} className="w-full h-full object-cover" />
                              ) : (
                                 <ImageIcon className="w-10 h-10 text-zinc-800" />
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                 <p className="text-[10px] text-zinc-400 font-bold text-center uppercase tracking-tighter">Preview Automatico via Link abaixo</p>
                              </div>
                           </div>
                           <Field label="URL Imagem de Capa" error={errors.coverImage?.message}>
                              <Input {...register("coverImage")} className="bg-zinc-900/60 border-zinc-800 text-[10px] font-mono h-10 px-4 rounded-lg focus:border-blue-500/50" placeholder="/images/projects/..." />
                           </Field>
                           <Field label="URL Capa Animada (GIF)" error={errors.coverAnimated?.message}>
                              <Input {...register("coverAnimated")} className="bg-zinc-900/60 border-zinc-800 text-[10px] font-mono h-10 px-4 rounded-lg focus:border-blue-500/50" placeholder="/images/projects/..." />
                           </Field>
                        </div>
                     </div>

                     <div className="lg:col-span-2 space-y-10">
                        <SectionHeader title="Conteúdo Base" subtitle="Informações primárias" />
                        <div className="grid grid-cols-2 gap-8">
                           <div className="col-span-2">
                             <Field label="Nome do Projeto" error={errors.title?.message}>
                                <Input {...register("title")} className="bg-zinc-900/60 border-zinc-800 h-12 text-lg font-bold text-white rounded-xl" placeholder="Ex: Ghosts of Tabor" />
                             </Field>
                           </div>
                           <Field label="Empresa" error={errors.company?.message}>
                              <Input {...register("company")} className="bg-zinc-900/60 border-zinc-800 h-11 rounded-xl" />
                           </Field>
                           <Field label="Seu Papel / Role" error={errors.role?.message}>
                              <Input {...register("role")} className="bg-zinc-900/60 border-zinc-800 h-11 rounded-xl" />
                           </Field>
                           <Field label="Status de Atividade" error={errors.status?.message}>
                              <Input {...register("status")} className="bg-zinc-900/60 border-zinc-800 h-11 rounded-xl" />
                           </Field>
                           <Field label="Categorias (Tags)" error={errors.category?.message}>
                              <Input {...register("category")} className="bg-zinc-900/60 border-zinc-800 h-11 rounded-xl" placeholder="FPS, VR, Survival..." />
                           </Field>
                        </div>
                        <Field label="Descrição Narrativa do Projeto" error={errors.description?.message}>
                           <Textarea {...register("description")} rows={6} className="bg-zinc-900/60 border-zinc-800 resize-none font-medium text-sm leading-relaxed rounded-2xl p-5 shadow-inner" />
                        </Field>
                     </div>
                  </div>

                  {/* Technical details */}
                  <div className="pt-12 border-t border-zinc-900 space-y-10">
                     <SectionHeader title="Links & Ferramentas" subtitle="Integrações externas" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <Field label="Ferramentas Utilizadas" error={errors.tools?.message}>
                              <Input {...register("tools")} className="bg-zinc-900/60 border-zinc-800 h-11 rounded-xl" placeholder="Unreal Engine, Figma, etc." />
                           </Field>
                           <div className="grid grid-cols-2 gap-4">
                              <Field label="Link Externo" error={errors.designurl?.message}>
                                 <div className="relative">
                                    <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-zinc-700" />
                                    <Input {...register("designurl")} className="bg-zinc-900/60 border-zinc-800 pl-10 h-11 rounded-xl font-mono text-[10px]" />
                                 </div>
                              </Field>
                              <Field label="Texto do Botão" error={errors.designButtonLabel?.message}>
                                 <Input {...register("designButtonLabel")} className="bg-zinc-900/60 border-zinc-800 h-11 rounded-xl" />
                              </Field>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <Field label="YouTube Embed Code (URL)" error={errors.videoUrl?.message}>
                              <div className="relative">
                                 <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-zinc-700" />
                                 <Input {...register("videoUrl")} className="bg-zinc-900/60 border-zinc-800 pl-10 h-11 rounded-xl font-mono text-[10px]" />
                              </div>
                           </Field>
                        </div>
                     </div>
                  </div>

                  {/* Advanced Data (Images / Sections) */}
                  <div className="pt-12 border-t border-zinc-900 space-y-10">
                     <div className="flex items-center justify-between">
                        <SectionHeader title="Galeria de Imagens" subtitle="Lista de fotos do projeto" />
                        <Button 
                          type="button" 
                          onClick={() => appendImage("")} 
                          className="relative h-9 px-8 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-lg uppercase tracking-tighter transition-all group overflow-hidden shadow-lg shadow-blue-600/20"
                        >
                           <span className="group-hover:opacity-0 group-hover:scale-95 transition-all duration-300">
                            Adicionar URL
                           </span>
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <Plus className="w-5 h-5 text-white" />
                           </div>
                        </Button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {imageFields.map((field, idx) => (
                           <div key={field.id} className="group flex items-center gap-3">
                              <div className="flex-1 relative">
                                 <Input 
                                   {...register(`images.${idx}` as const)}
                                   className={`bg-zinc-900/40 border-zinc-800 h-10 text-[10px] font-mono rounded-lg ${errors.images?.[idx] ? "border-red-500/50" : ""}`} 
                                 />
                                 {errors.images?.[idx] && <p className="text-[9px] text-red-500 mt-1 ml-1">{errors.images[idx]?.message}</p>}
                              </div>
                              <Button 
                                 type="button"
                                 variant="ghost" 
                                 size="icon" 
                                 onClick={() => removeImage(idx)}
                                 className="w-10 h-10 text-zinc-600 hover:text-red-500 rounded-lg hover:bg-red-500/10"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        ))}
                     </div>
                  </div>
               </form>
            </div>
         </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
         <DialogContent className="max-w-md bg-zinc-950 border-zinc-900 text-zinc-300 p-8 shadow-2xl rounded-3xl overflow-hidden">
            <div className="flex flex-col items-center text-center gap-6 py-4">
               <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2">
                  <Trash2 className="w-8 h-8" />
               </div>
               <div>
                  <DialogTitle className="text-2xl font-black text-white tracking-tighter mb-2">Confirmar Exclusão</DialogTitle>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                     Você tem certeza que deseja excluir o projeto <span className="text-zinc-200 font-bold">"{projectToDelete?.title}"</span>? Esta ação não pode ser desfeita.
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
                  Cancelar
               </Button>
               <Button 
                 onClick={handleDelete} 
                 disabled={isDeleting}
                 className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest px-6 h-12 rounded-xl shadow-lg shadow-red-600/20"
               >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Excluir Agora"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}

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

function SectionHeader({ title, subtitle }: any) {
   return (
      <div className="flex flex-col gap-1">
         <h3 className="text-base font-black text-white uppercase tracking-widest">{title}</h3>
         <p className="text-zinc-600 text-xs font-medium">{subtitle}</p>
      </div>
   )
}

function Field({ label, children, error }: any) {
   return (
      <div className="space-y-2">
         <Label className="text-[11px] text-zinc-500 uppercase tracking-widest font-black flex items-center gap-2">
            <span>{label}</span>
         </Label>
         {children}
         {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">{error}</p>}
      </div>
   )
}
