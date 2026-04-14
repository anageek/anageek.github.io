"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Monitor, Smartphone, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/common/scroll-reveal"
import type { ProjectWithRelations } from "@/features/projects/types/project"
import SectionRenderer from "@/features/projects/components/section-renderer"
import ProjectGallery from "@/features/projects/components/project-gallery"

interface ProjectDetailProps {
  project: ProjectWithRelations
  prevProjectSlug?: string | null
  nextProjectSlug?: string | null
  currentIndex?: number
  totalProjects?: number
}

export default function ProjectDetail({
  project,
  prevProjectSlug = null,
  nextProjectSlug = null,
  currentIndex = 0,
  totalProjects = 0,
}: ProjectDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Collect ALL lightbox images: section blocks + section sidebar images + gallery images
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

  const handleImageClick = (imageSrc: string) => {
    const index = lightboxImages.indexOf(imageSrc)
    if (index !== -1) setSelectedImageIndex(index)
  }

  const navigateLightbox = (direction: "next" | "prev") => {
    if (selectedImageIndex === null) return
    if (direction === "next") {
      setSelectedImageIndex((selectedImageIndex + 1) % lightboxImages.length)
    } else {
      setSelectedImageIndex((selectedImageIndex - 1 + lightboxImages.length) % lightboxImages.length)
    }
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedImageIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigateLightbox("next")
      if (e.key === "ArrowLeft") navigateLightbox("prev")
      if (e.key === "Escape") setSelectedImageIndex(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [selectedImageIndex])

  const galleryImages = project.images.map((img) => img.url).filter(Boolean) as string[]

  return (
    <main className="min-h-screen bg-black text-white grid grid-cols-1 lg:grid-cols-3">
      {/* Mobile: Fixed top bar for Back link & Navigation */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-800/50 shadow-md flex items-center justify-between px-2">
        <Link
          href="/"
          className="flex items-center text-zinc-400 hover:text-white px-2 py-3 font-medium transition-colors text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-2 pr-2">
          {prevProjectSlug && (
            <Link
              href={`/project/${prevProjectSlug}`}
              className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-400 hover:text-white" />
            </Link>
          )}

          <div className="text-xs font-bold flex items-center">
            <span className="text-primary">{currentIndex + 1}</span>
            <span className="text-zinc-500">/{totalProjects}</span>
          </div>

          {nextProjectSlug && (
            <Link
              href={`/project/${nextProjectSlug}`}
              className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-zinc-400 hover:text-white" />
            </Link>
          )}
        </div>
      </div>

      {/* Left column: info (sidebar on desktop, block on mobile) */}
      <div
        id="FixedInfo"
        className="
          bg-zinc-950 col-span-1 container border-r border-zinc-800/50
          pt-16 lg:pt-0
          lg:static lg:w-auto
        "
      >
        <div className="py-6 px-4 lg:sticky lg:top-0 lg:py-10">
          {/* Desktop: Logo */}
          <Link href="/" className="mb-4 hidden lg:inline-block">
            <div className="relative h-8 w-8">
              <Image
                src="/images/logo/logo-small-white.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop: Back link and Navigation */}
          <div className="hidden lg:flex items-center justify-between mb-10 w-full">
            <Link
              href="/"
              className="inline-flex items-center text-zinc-400 hover:text-white font-medium transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>

            <div className="flex items-center gap-3">
              {prevProjectSlug && (
                <Link
                  href={`/project/${prevProjectSlug}`}
                  className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-zinc-400 hover:text-white" />
                </Link>
              )}

              <div className="text-xs font-bold flex items-center">
                <span className="text-primary">{currentIndex + 1}</span>
                <span className="text-zinc-500">/{totalProjects}</span>
              </div>

              {nextProjectSlug && (
                <Link
                  href={`/project/${nextProjectSlug}`}
                  className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-400 hover:text-white" />
                </Link>
              )}
            </div>
          </div>

          <ScrollReveal animation="fade-right" duration={600} threshold={0}>
          <div className="flex items-center space-x-6 my-2">
            <h1 className="text-4xl font-bold tracking-tighter">{project.title}</h1>
            {project.platform && project.platform.length > 0 && (
              <div className="my-2 space-x-2 flex items-center">
                {project.platform.map((platform, idx) => (
                  <span key={idx} className="text-zinc-600">
                    {platform === "PC" && <Monitor className="w-5 h-5" />}
                    {platform === "Mobile" && <Smartphone className="w-5 h-5" />}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 mt-8">
            {project.category?.label && (
              <div className="flex items-start gap-4">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[60px]">Genre</p>
                <p className="text-zinc-300 font-medium">{project.category.label}</p>
              </div>
            )}
            {project.role && (
              <div className="flex items-start gap-4">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[60px]">Role</p>
                <p className="text-zinc-300 font-medium">{project.role}</p>
              </div>
            )}
            {project.company && (
              <div className="flex items-start gap-4">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[60px]">Author</p>
                <p className="text-zinc-300 font-medium">{project.company}</p>
              </div>
            )}
            {project.status && (
              <div className="flex items-start gap-4">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[60px]">Status</p>
                <p className="text-primary font-semibold uppercase text-xs tracking-wide bg-primary/10 px-3 py-1 rounded-full border border-primary/20">{project.status}</p>
              </div>
            )}
            {project.tools && (
              <div className="flex items-start gap-4">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mt-0.5 min-w-[60px]">Tools</p>
                <p className="text-zinc-400 text-sm">{project.tools}</p>
              </div>
            )}
          </div>

          {project.description && (
            <div className="mt-8 pt-8 border-t border-zinc-800/50">
              <p className="text-zinc-400 font-light leading-relaxed text-sm">
                {project.description}
              </p>
            </div>
          )}

          {project.designUrl && project.designBtnLabel && (
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl py-6 mt-8 shadow-lg shadow-primary/20 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
              asChild
            >
              <a href={project.designUrl}>{project.designBtnLabel}</a>
            </Button>
          )}
          </ScrollReveal>
        </div>
      </div>

      {/* Right column: content */}
      <div className="col-span-2 container py-10 lg:px-12">
        {/* Video URL */}
        {project.videoUrl && (
          <ScrollReveal animation="scale-up" duration={700}>
          <div className="mb-12 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800/50">
            <iframe
              src={project.videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          </ScrollReveal>
        )}

        {/* Sections */}
        {project.sections?.map((section, index) => (
          <ScrollReveal key={section.id} animation="fade-up" duration={700} delay={index * 100}>
            <SectionRenderer
              section={section}
              projectTitle={project.title}
              sectionIndex={index}
              onImageClick={handleImageClick}
            />
          </ScrollReveal>
        ))}

        {/* Project Gallery */}
        <ScrollReveal animation="fade-up" duration={700}>
        <ProjectGallery
          images={galleryImages}
          projectTitle={project.title}
          onImageClick={handleImageClick}
        />
        </ScrollReveal>
      </div>

      {/* Unified Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110] p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-white transition-all hover:scale-110 z-[110]"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <div
            className="w-full h-full flex items-center justify-center p-4 md:p-20"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none transition-all duration-500">
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
            onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-white transition-all hover:scale-110 z-[110]"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {selectedImageIndex + 1} <span className="text-zinc-600 mx-1">/</span> {lightboxImages.length}
          </div>
        </div>
      )}
    </main>
  )
}
