"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Monitor, Smartphone, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { projects } from "@/public/Projects-Content"
import { Suspense, useEffect, useState, useMemo } from "react"

function ProjectContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id") || ""
  const category = searchParams.get("category") || ""

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Reset lightbox when project changes
  useEffect(() => {
    setSelectedImageIndex(null)
  }, [id, category])

  const getProjectData = projects[category as keyof typeof projects] ?? []
  const project = getProjectData.find((p) => String(p.id) === id)

  // Carousel Logic (All images in page)
  const lightboxImages = useMemo(() => {
    if (!project) return []
    const imgs: string[] = []
    project.sections?.forEach(section => {
      section.description.forEach((item: any) => {
        if (item.type === "image" && item.image) imgs.push(item.image)
        if (!item.type && item.image) imgs.push(item.image)
      })
      if (section.image) imgs.push(section.image)
    })
    if (project.images) imgs.push(...project.images)
    return imgs
  }, [project])

  // Project Navigation Logic
  const categoryProjects = projects[category as keyof typeof projects] || []
  const currentIndex = categoryProjects.findIndex(p => String(p.id) === id)
  const prevProject = categoryProjects[(currentIndex - 1 + categoryProjects.length) % categoryProjects.length]
  const nextProject = categoryProjects[(currentIndex + 1) % categoryProjects.length]

  if (!id || !category || !project) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 text-white text-2xl">
        <p className="bg-zinc-800/50 rounded-2xl border border-zinc-700/50 px-20 py-10 text-zinc-400 font-sans font-light backdrop-blur-xl">Project not found</p>
      </div>
    )
  }

  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (selectedImageIndex === null) return
    if (direction === 'next') {
      setSelectedImageIndex((selectedImageIndex + 1) % lightboxImages.length)
    } else {
      setSelectedImageIndex((selectedImageIndex - 1 + lightboxImages.length) % lightboxImages.length)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white grid grid-cols-1 lg:grid-cols-3">
      {/* Mobile: Fixed top bar for Back link & Navigation */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 shadow-md flex items-center justify-between px-2">
        <Link
          href="/#projects"
          className="flex items-center text-zinc-500 hover:text-white px-2 py-3 font-medium transition-colors text-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-2 pr-2">
          <Link
            href={`/project?id=${prevProject.id}&category=${category}`}
            className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-400 hover:text-white" />
          </Link>

          <div className="text-xs font-bold font-sans flex items-center">
            <span className="text-blue-500">{currentIndex + 1}</span>
            <span className="text-zinc-500">/{categoryProjects.length}</span>
          </div>

          <Link
            href={`/project?id=${nextProject.id}&category=${category}`}
            className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-zinc-400 hover:text-white" />
          </Link>
        </div>
      </div>

      {/* Left column: info (sidebar on desktop, block on mobile) */}
      <div
        id="FixedInfo"
        className="
          bg-zinc-950/30 col-span-1 container border-r border-zinc-800/50
          pt-16 lg:pt-0
          lg:static lg:w-auto
        "
      >
        <div className="py-6 px-2 lg:sticky lg:top-0 lg:py-10">
          {/* Desktop: Back link and Navigation */}
          <div className="hidden lg:flex items-center justify-between mb-10 w-full">
            <Link
              href="/#projects"
              className="inline-flex items-center text-zinc-500 hover:text-white font-medium transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href={`/project?id=${prevProject.id}&category=${category}`}
                className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-400 hover:text-white" />
              </Link>

              <div className="text-xs font-bold font-sans flex items-center">
                <span className="text-blue-500">{currentIndex + 1}</span>
                <span className="text-zinc-500">/{categoryProjects.length}</span>
              </div>

              <Link
                href={`/project?id=${nextProject.id}&category=${category}`}
                className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-zinc-400 hover:text-white" />
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 my-2">
            <h1 className="text-4xl font-black tracking-tighter">{project.title}</h1>
            {project.platform && (
              <div className="my-2 space-x-2 flex items-center">
                {(Array.isArray(project.platform) ? project.platform : [project.platform]).map((platform, idx) => (
                  <span key={idx} className="text-zinc-600">
                    {platform === "PC" && <Monitor className="w-5 h-5" />}
                    {platform === "Mobile" && <Smartphone className="w-5 h-5" />}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 mt-8">
            {project.category && (
              <div className="flex items-start gap-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Genre</p>
                <p className="text-zinc-300 font-medium">{project.category}</p>
              </div>
            )}
            {project.role && (
              <div className="flex items-start gap-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Role</p>
                <p className="text-zinc-300 font-medium">{project.role}</p>
              </div>
            )}
            {project.company && (
              <div className="flex items-start gap-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Author</p>
                <p className="text-zinc-300 font-medium">{project.company}</p>
              </div>
            )}
            {project.status && (
              <div className="flex items-start gap-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Status</p>
                <p className="text-blue-500 font-black uppercase text-[10px] tracking-tighter bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">{project.status}</p>
              </div>
            )}
            {project.tools && (
              <div className="flex items-start gap-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Tools</p>
                <p className="text-zinc-300 font-light text-sm">{project.tools}</p>
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

          {project.designurl && project.designButtonLabel && (
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl py-6 mt-8 shadow-lg shadow-blue-900/20 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]" asChild>
              <a href={project.designurl}>{project.designButtonLabel}</a>
            </Button>
          )}

          {/* Project Navigation moved to Header */}
        </div>
      </div>

      {/* Right column: content */}
      <div className="col-span-2 container py-10 lg:px-12">
        {/* Video URL*/}
        {project.videoUrl && (
          <div className="mb-12 w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800/50">
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
        )}

        {/* Sections*/}
        {project.sections?.map((section, index) => (
          <div key={index} className="flex flex-col mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative mb-8">
              <h1 className="text-3xl font-black tracking-tight mb-2">{section.title}</h1>
              <div className="h-1 w-20 bg-blue-600 rounded-full" />
            </div>

            {/* Per-section video (new format) */}
            {(section as any).video && (
              <div className="mb-8 w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-zinc-800/50">
                <iframe
                  src={(section as any).video}
                  title={`${section.title} video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            <div className={`grid gap-12 ${section.image ? "lg:grid-cols-2" : "grid-cols-1"}`}>
              <div className="space-y-6">
                {section.description.map((item, idx) => {
                  // Legacy typed format
                  if (item.type === "heading" && item.text) {
                    return <h3 key={idx} className="text-xl font-bold text-white">{item.text}</h3>
                  }
                  if (item.type === "paragraph" && item.text) {
                    return <p key={idx} className="text-zinc-400 font-light leading-relaxed text-justify">{item.text}</p>
                  }
                  if (item.type === "list" && Array.isArray(item.items)) {
                    return (
                      <ul key={idx} className="space-y-3">
                        {item.items.map((point: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-400 font-light text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  if (item.type === "image" && item.image) {
                    return (
                      <div
                        key={idx}
                        className="my-8 rounded-3xl overflow-hidden cursor-zoom-in group border border-zinc-800/50 shadow-xl"
                        onClick={() => setSelectedImageIndex(lightboxImages.indexOf(item.image!))}
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={`${project.title} - Section Image`}
                          width={800}
                          height={600}
                          className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      </div>
                    )
                  }
                  if (item.type === "video" && item.video) {
                    return (
                      <div key={idx} className="my-8 w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-zinc-800/50">
                        <iframe
                          src={item.video}
                          title={`${project.title} block video`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    )
                  }
                  // New simplified format (no type field)
                  if (!item.type) {
                    return (
                      <div key={idx} className="space-y-6">
                        {item.text && (
                          <p className="text-zinc-400 font-light leading-relaxed text-justify">{item.text}</p>
                        )}
                        {item.image && (
                          <div
                            className="rounded-3xl overflow-hidden cursor-zoom-in group border border-zinc-800/50 shadow-xl"
                            onClick={() => setSelectedImageIndex(lightboxImages.indexOf(item.image!))}
                          >
                            <Image
                              src={item.image}
                              alt={`${project.title} - Section Image`}
                              width={800}
                              height={600}
                              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
                            />
                          </div>
                        )}
                        {(item as any).video && (
                          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-zinc-800/50">
                            <iframe
                              src={(item as any).video}
                              title={`${project.title} block video`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              {section.image && (
                <div
                  className="relative group cursor-zoom-in rounded-3xl overflow-hidden border border-zinc-800/50 shadow-xl"
                  onClick={() => setSelectedImageIndex(lightboxImages.indexOf(section.image!))}
                >
                  <Image
                    src={section.image || "/placeholder.svg"}
                    alt={`${project.title} - Section ${index + 1}`}
                    width={500}
                    height={500}
                    className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Main Images Gallery */}
        <div className="relative mb-8 mt-16 pt-16 border-t border-zinc-800/50">
          <h1 className="text-3xl font-black tracking-tight mb-2">Project Gallery</h1>
          <div className="h-1 w-20 bg-blue-600 rounded-full" />
        </div>

        <div
          className={`grid gap-6 ${project.images.length === 1
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2"
            }`}
        >
          {project.images.map((image, index) => (
            <div 
              key={index} 
              className="rounded-3xl overflow-hidden cursor-zoom-in group border border-zinc-800/50 shadow-xl shadow-black/20"
              onClick={() => setSelectedImageIndex(lightboxImages.indexOf(image))}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${project.title} - Image ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation moved to Header */}

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
           <button 
             onClick={() => setSelectedImageIndex(null)}
             className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110] p-2 hover:bg-white/10 rounded-full"
           >
              <X className="w-8 h-8" />
           </button>

           <button 
             onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
             className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-white transition-all hover:scale-110 z-[110]"
           >
              <ChevronLeft className="w-12 h-12" />
           </button>

           <div className="w-full h-full flex items-center justify-center p-4 md:p-20" onClick={() => setSelectedImageIndex(null)}>
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
             onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
             className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-white transition-all hover:scale-110 z-[110]"
           >
              <ChevronRight className="w-12 h-12" />
           </button>

           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {selectedImageIndex + 1} <span className="text-zinc-600 mx-1">/</span> {lightboxImages.length}
           </div>
        </div>
      )}
    </main>
  )
}

export default function ProjectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 text-white"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProjectContent />
    </Suspense>
  )
}
