'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  Eye,
  EyeOff,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatCard } from '@/components/common/stat-card'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { EmptyState } from '@/components/common/empty-state'
import { toggleProjectField, deleteProject } from '@/features/projects'
import { toast } from 'sonner'
import type { Project } from '@/features/projects/types/project'
import type { Category } from '@/features/projects/types/project'

interface ProjectTableProps {
  projects: Project[]
  categories: Category[]
  categorySlug: string
}

export function ProjectTable({ projects, categories, categorySlug }: ProjectTableProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [optimisticProjects, setOptimisticProjects] = useState<Project[]>(projects)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = optimisticProjects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleToggle = async (project: Project, field: 'visible' | 'featured') => {
    const currentValue = field === 'visible' ? project.visible !== false : project.featured === true
    const newValue = !currentValue

    // Optimistic update
    setOptimisticProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, [field]: newValue } : p)),
    )

    try {
      await toggleProjectField(project.id, field, newValue)
    } catch {
      toast.error('Error updating project')
      // Rollback
      setOptimisticProjects((prev) =>
        prev.map((p) => (p.id === project.id ? project : p)),
      )
    }
  }

  const openDeleteConfirm = (project: Project) => {
    setProjectToDelete(project)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    try {
      await deleteProject(projectToDelete.id)
      toast.success('Project deleted')
      setOptimisticProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id))
      setDeleteOpen(false)
      router.refresh()
    } catch {
      toast.error('Error deleting project')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="border-blue-500/20 text-blue-500 bg-blue-500/5 text-[9px] uppercase tracking-widest font-black px-2 py-0.5"
            >
              Content Manager
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-white capitalize tracking-tighter">
            {categorySlug}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage your {categorySlug} projects and details.
          </p>
        </div>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-lg shadow-blue-600/20 h-12 px-8 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Link href="/admin/projects/new">+ New Project</Link>
        </Button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Projects"
          value={optimisticProjects.length}
          icon={<Layers />}
          color="text-blue-400"
        />
        <StatCard
          label="Active Pages"
          value={filtered.length}
          icon={<CheckCircle2 />}
          color="text-emerald-400"
        />
        <StatCard
          label="Last Update"
          value="Today"
          icon={<Calendar />}
          color="text-blue-400"
        />
      </div>

      {/* ── Projects Table ─────────────────────────────────────────────────── */}
      <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="p-6 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/40">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-600" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-11 h-11 bg-zinc-950/60 border-zinc-800 text-zinc-200 rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-950/60 border-b border-zinc-900">
              <TableRow className="hover:bg-transparent border-zinc-900">
                <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest text-center py-5 w-16">
                  ID
                </TableHead>
                <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">
                  Project
                </TableHead>
                <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">
                  Company / Role
                </TableHead>
                <TableHead className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5">
                  Status
                </TableHead>
                <TableHead className="text-right text-zinc-600 font-bold uppercase text-[10px] tracking-widest py-5 pr-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState title="No projects found in this category." />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((project) => (
                  <TableRow
                    key={project.id}
                    className="border-zinc-900 hover:bg-zinc-900/50 transition-colors group"
                  >
                    <TableCell className="text-center text-zinc-700 font-mono text-xs">
                      {project.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800 group-hover:border-blue-500/30 p-1 transition-all">
                          {project.coverImage && (
                            <img
                              src={project.coverImage}
                              alt=""
                              className="w-full h-full object-cover rounded-[10px]"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-black text-base tracking-tight leading-none mb-1.5">
                            {project.title}
                          </p>
                          <span className="text-zinc-500 text-[10px] uppercase font-bold">
                            {project.tools?.split(',')[0]}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-zinc-300 font-bold">{project.company}</p>
                      <p className="text-[10px] font-medium uppercase text-zinc-600">
                        {project.role}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.status ? 'bg-blue-500' : 'bg-zinc-700'
                          }`}
                        />
                        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                          {project.status || '—'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-2">
                        {/* Visible toggle */}
                        <Button
                          onClick={() => handleToggle(project, 'visible')}
                          variant="ghost"
                          size="icon"
                          title={
                            project.visible !== false
                              ? 'Visible — click to hide'
                              : 'Hidden — click to show'
                          }
                          className={`w-9 h-9 rounded-lg border transition-all ${
                            project.visible !== false
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-700 hover:text-zinc-400'
                          }`}
                        >
                          {project.visible !== false ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                        {/* Featured toggle */}
                        <Button
                          onClick={() => handleToggle(project, 'featured')}
                          variant="ghost"
                          size="icon"
                          title={
                            project.featured
                              ? 'Featured — click to unfeature'
                              : 'Not featured — click to feature'
                          }
                          className={`w-9 h-9 rounded-lg border transition-all ${
                            project.featured
                              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'
                          }`}
                        >
                          <Star
                            className={`w-4 h-4 ${project.featured ? 'fill-yellow-400' : ''}`}
                          />
                        </Button>
                        {/* Edit */}
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"
                        >
                          <Link href={`/admin/projects/${project.id}/edit`}>
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Button>
                        {/* Delete */}
                        <Button
                          onClick={() => openDeleteConfirm(project)}
                          variant="ghost"
                          size="icon"
                          className="w-9 h-9 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500/50 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ── Delete Confirm ─────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Confirm Delete"
        description={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  )
}
