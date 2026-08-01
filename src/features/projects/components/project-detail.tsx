"use client"

import { useState, useMemo, useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft, ArrowUp, Monitor, Smartphone,
  X, ChevronLeft, ChevronRight, ChevronDown, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/common/scroll-reveal"
import { ScrollToTop } from "@/components/common/scroll-to-top"
import type { ProjectWithRelations } from "@/features/projects/types/project"
import { toYouTubeEmbedUrl, cn } from "@/lib/utils"
import SectionRenderer from "@/features/projects/components/section-renderer"
import ProjectGallery from "@/features/projects/components/project-gallery"

interface SimpleProject {
  slug: string
  title: string
  category: { slug: string; label: string } | null
}

interface SimpleCategory {
  slug: string
  label: string
}

interface ProjectDetailProps {
  project: ProjectWithRelations
  allProjects: SimpleProject[]
  allCategories: SimpleCategory[]
}

const DESC_THRESHOLD = 280

export default function ProjectDetail({
  project,
  allProjects,
  allCategories,
}: ProjectDetailProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Sidebar hide/show on scroll
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 80) {
        setSidebarVisible(true)
      } else if (y > lastScrollY.current) {
        setSidebarVisible(false) // scrolling down → hide
      } else {
        setSidebarVisible(true)  // scrolling up → show
      }
      lastScrollY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lightbox
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const lightboxImages = useMemo(() => {
    const imgs: string[] = []
    project.sections?.forEach((section) => {
      section.blocks.forEach((block) => {
        if (block.type === "image" && block.image) imgs.push(block.image)
      })
      if (section.image) imgs.push(section.image)
    })
    project.images.forEach((img) => {
      if (img.url) imgs.push(img.url)
    })
    return imgs
  }, [project])

  const handleImageClick = (src: string) => {
    const i = lightboxImages.indexOf(src)
    if (i !== -1) setSelectedImageIndex(i)
  }
  const navigateLightbox = (dir: "next" | "prev") => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex(
      dir === "next"
        ? (selectedImageIndex + 1) % lightboxImages.length
        : (selectedImageIndex - 1 + lightboxImages.length) % lightboxImages.length,
    )
  }

  useEffect(() => {
    if (selectedImageIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigateLightbox("next")
      if (e.key === "ArrowLeft") navigateLightbox("prev")
      if (e.key === "Escape") setSelectedImageIndex(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedImageIndex])

  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [selectedImageIndex])

  // Description expand
  const [descExpanded, setDescExpanded] = useState(false)
  const isLongDesc = (project.description?.length ?? 0) > DESC_THRESHOLD

  // Category navigation
  const [selectedCategory, setSelectedCategory] = useState(
    project.category?.slug ?? (allCategories[0]?.slug ?? ""),
  )
  const [categoryOpen, setCategoryOpen] = useState(false)

  const categoryProjects = useMemo(
    () => allProjects.filter((p) => p.category?.slug === selectedCategory),
    [allProjects, selectedCategory],
  )
  const categoryIdx = categoryProjects.findIndex((p) => p.slug === project.slug)
  const prevSlug = categoryIdx > 0 ? (categoryProjects[categoryIdx - 1]?.slug ?? null) : null
  const nextSlug =
    categoryIdx < categoryProjects.length - 1
      ? (categoryProjects[categoryIdx + 1]?.slug ?? null)
      : null

  const navigateTo = (slug: string) =>
    startTransition(() => router.push(`/project/${slug}`))

  const selectedCategoryLabel =
    allCategories.find((c) => c.slug === selectedCategory)?.label ?? selectedCategory

  useEffect(() => {
    if (!categoryOpen) return
    const close = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-cat-dropdown]")) setCategoryOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [categoryOpen])

  // ── Shared navigation controls ──────────────────────────────────────────────
  function NavControls({ opensUp = false }: { opensUp?: boolean }) {
    return (
      <div className="flex items-center gap-2 flex-wrap gap-y-2">
        {/* Category dropdown */}
        <div className="relative" data-cat-dropdown="">
          <button
            type="button"
            onClick={() => setCategoryOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
          >
            <span className="max-w-[100px] truncate">{selectedCategoryLabel}</span>
            <ChevronDown className={cn("w-3 h-3 shrink-0 transition-transform", categoryOpen && "rotate-180")} />
          </button>
          {categoryOpen && (
            <div className={cn(
              "absolute left-0 z-[60] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl py-1 min-w-[140px]",
              opensUp ? "bottom-full mb-1" : "top-full mt-1",
            )}>
              {allCategories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => { setSelectedCategory(cat.slug); setCategoryOpen(false) }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs transition-colors",
                    cat.slug === selectedCategory
                      ? "text-primary font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prev arrow */}
        <button
          type="button"
          disabled={!prevSlug || isPending}
          onClick={() => prevSlug && navigateTo(prevSlug)}
          className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        <span className="text-xs font-bold tabular-nums flex items-center">
          <span className="text-primary">{categoryIdx >= 0 ? categoryIdx + 1 : "–"}</span>
          <span className="text-zinc-600 mx-0.5">/</span>
          <span className="text-zinc-500">{categoryProjects.length}</span>
        </span>

        {/* Next arrow */}
        <button
          type="button"
          disabled={!nextSlug || isPending}
          onClick={() => nextSlug && navigateTo(nextSlug)}
          className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          )}
        </button>
      </div>
    )
  }

  const galleryImages = project.images.map((img) => img.url).filter(Boolean) as string[]

  return (
    <>
      {/* ── Mobile fixed top bar ─────────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-800/50 flex items-center justify-between px-3 py-2.5">
        <Link href="/" className="flex items-center text-zinc-400 hover:text-white font-medium transition-colors text-sm">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Link>
        <NavControls />
      </div>

      {/* ── Desktop sidebar — fixed position, slides left ────────────────────── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 w-[340px]",
          "bg-zinc-950 border-r border-zinc-800/50 overflow-hidden",
          "transition-transform duration-300 ease-in-out",
          sidebarVisible ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header — shrink-0 */}
        <div className="shrink-0 pt-6 px-6 pb-4 border-b border-zinc-800/30">
          <Link href="/" className="mb-4 inline-block">
            <div className="relative h-7 w-7">
              <Image src="/images/logo/logo-small-white.png" alt="Logo" fill className="object-contain" />
            </div>
          </Link>

          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center text-zinc-400 hover:text-white font-medium transition-colors text-sm group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>
          </div>

          <NavControls />
        </div>

        {/* Content — fills remaining space, no scroll */}
        <div className="flex-1 min-h-0 overflow-hidden px-6 py-4">
          <ScrollReveal animation="fade-right" duration={600} threshold={0}>
            <div className="flex items-start gap-2 mb-2 flex-wrap">
              <h1 className="text-zinc-300  text-xl font-bold tracking-tighter leading-snug">{project.title}</h1>
              {project.platform && project.platform.length > 0 && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  {project.platform.map((p, i) => (
                    <span key={i} className="text-zinc-600">
                      {p === "PC" && <Monitor className="w-4 h-4" />}
                      {p === "Mobile" && <Smartphone className="w-4 h-4" />}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 mt-4">
              {project.category?.label && (
                <div className="flex items-start gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[56px]">Genre</p>
                  <p className="text-zinc-300 font-medium text-sm">{project.category.label}</p>
                </div>
              )}
              {project.role && (
                <div className="flex items-start gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[56px]">Role</p>
                  <p className="text-zinc-300 font-medium text-sm">{project.role}</p>
                </div>
              )}
              {project.company && (
                <div className="flex items-start gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[56px]">Author</p>
                  <p className="text-zinc-300 font-medium text-sm">{project.company}</p>
                </div>
              )}
              {project.status && (
                <div className="flex items-start gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[56px]">Status</p>
                  <p className="text-primary font-semibold uppercase text-xs tracking-wide bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit">
                    {project.status}
                  </p>
                </div>
              )}
              {project.tools && (
                <div className="flex items-start gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[56px]">Tools</p>
                  <p className="text-zinc-400 text-sm">{project.tools}</p>
                </div>
              )}
            </div>

            {project.description && (
              <div className="mt-5 pt-5 border-t border-zinc-800/50">
                <p className="text-zinc-400 font-light leading-relaxed text-sm line-clamp-4">
                  {project.description}
                </p>
                {isLongDesc && (
                  <button
                    type="button"
                    onClick={() => setDescExpanded(true)}
                    className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Ler mais ↓
                  </button>
                )}
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* CTA button — always pinned at bottom */}
        {project.designUrl && project.designBtnLabel && (
          <div className="shrink-0 px-6 pb-5 pt-4 border-t border-zinc-800/30">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl py-6 shadow-lg shadow-primary/20 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
              asChild
            >
              <a href={project.designUrl} target="_blank" rel="noopener noreferrer">
                {project.designBtnLabel}
              </a>
            </Button>
          </div>
        )}
      </aside>

      {/* ── Main content — slides right as sidebar hides ─────────────────────── */}
      <main
        className={cn(
          "min-h-screen bg-black text-white",
          "transition-[margin-left] duration-300 ease-in-out",
          sidebarVisible ? "lg:ml-[340px]" : "lg:ml-0",
        )}
      >
        {/* Mobile info block */}
        <div className="lg:hidden pt-24 pb-6 px-4">
          <ScrollReveal animation="fade-up" duration={600} threshold={0}>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tighter">{project.title}</h1>
              {project.platform && project.platform.length > 0 && (
                <div className="flex items-center gap-1">
                  {project.platform.map((p, i) => (
                    <span key={i} className="text-zinc-600">
                      {p === "PC" && <Monitor className="w-4 h-4" />}
                      {p === "Mobile" && <Smartphone className="w-4 h-4" />}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-3">
              {project.category?.label && (
                <div className="flex items-start gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[60px]">Genre</p>
                  <p className="text-zinc-300 text-sm font-medium">{project.category.label}</p>
                </div>
              )}
              {project.role && (
                <div className="flex items-start gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[60px]">Role</p>
                  <p className="text-zinc-300 text-sm font-medium">{project.role}</p>
                </div>
              )}
              {project.status && (
                <div className="flex items-start gap-3">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[60px]">Status</p>
                  <p className="text-primary font-semibold uppercase text-xs tracking-wide bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit">
                    {project.status}
                  </p>
                </div>
              )}
            </div>
            {project.description && (
              <div className="mt-6 pt-6 border-t border-zinc-800/50">
                <p className="text-zinc-400 font-light leading-relaxed text-sm">{project.description}</p>
              </div>
            )}
            {project.designUrl && project.designBtnLabel && (
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl py-5 mt-6 shadow-lg shadow-primary/20 border-0" asChild>
                <a href={project.designUrl} target="_blank" rel="noopener noreferrer">
                  {project.designBtnLabel}
                </a>
              </Button>
            )}
          </ScrollReveal>
        </div>

        {/* Content area */}
        <div className="container py-10 lg:px-12">
          {project.videoUrl && (
            <ScrollReveal animation="scale-up" duration={700}>
              <div className="mb-12 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800/50">
                <iframe
                  src={toYouTubeEmbedUrl(project.videoUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </ScrollReveal>
          )}

          {project.sections?.map((section, i) => (
            <ScrollReveal key={section.id} animation="fade-up" duration={700} delay={i * 100}>
              <SectionRenderer
                section={section}
                projectTitle={project.title}
                sectionIndex={i}
                onImageClick={handleImageClick}
              />
            </ScrollReveal>
          ))}

          <ScrollReveal animation="fade-up" duration={700}>
            <ProjectGallery
              images={galleryImages}
              projectTitle={project.title}
              onImageClick={handleImageClick}
            />
          </ScrollReveal>
        </div>
      </main>

      {/* ── Desktop bottom bar — slides up when sidebar hides ────────────────── */}
      <div
        className={cn(
          "hidden lg:block fixed bottom-0 left-0 right-0 z-50",
          "transition-transform duration-300 ease-in-out",
          !sidebarVisible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50 shadow-2xl">
          <div className="flex items-center justify-between px-8 py-3">
            <NavControls opensUp />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Topo
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile scroll-to-top ─────────────────────────────────────────────── */}
      <div className="lg:hidden">
        <ScrollToTop />
      </div>

      {/* ── Description bottom sheet ────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-[65] transition-opacity duration-300",
          descExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setDescExpanded(false)}
      >
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 max-h-[60vh] flex flex-col",
            "bg-zinc-950 border-t border-zinc-800/60 rounded-t-2xl shadow-2xl shadow-black/60",
            "transition-transform duration-300 ease-out",
            descExpanded ? "translate-y-0" : "translate-y-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pull handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-8 h-1 bg-zinc-700 rounded-full" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/40 shrink-0">
            <p className="text-sm font-semibold text-white truncate pr-4">{project.title}</p>
            <button
              type="button"
              onClick={() => setDescExpanded(false)}
              className="shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          {/* Scrollable description */}
          <div className="overflow-y-auto px-6 py-5">
            <p className="text-zinc-400 font-light leading-relaxed text-sm">{project.description}</p>
          </div>
        </div>
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110] p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox("prev") }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-white transition-all hover:scale-110 z-[110]"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <div
            className="w-full h-full flex items-center justify-center p-4 md:p-20"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
              <Image
                src={lightboxImages[selectedImageIndex]}
                alt="Lightbox View"
                fill
                className="object-contain pointer-events-auto"
                priority
              />
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox("next") }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-white transition-all hover:scale-110 z-[110]"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {selectedImageIndex + 1}
            <span className="text-zinc-600 mx-1">/</span>
            {lightboxImages.length}
            <span className="text-zinc-600 ml-3">ESC</span>
          </div>
        </div>
      )}
    </>
  )
}
