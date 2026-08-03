'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProjectWithCategory } from '@/features/projects/types/project'

interface FeaturedProjectsSectionProps {
  projects: ProjectWithCategory[]
}

function ProjectCard({ project }: { project: ProjectWithCategory }) {
  return (
    <Link href={`/project/${project.slug}`} className="block w-full h-full">
      <div className="rounded-lg group relative overflow-hidden shadow-[2px_2px_5px_black] transition-all duration-300 transform w-full aspect-[3/4] md:aspect-[2/3] hover:-translate-y-2 hover:shadow-[0_4px_20px_rgba(0,153,255,0.3)]">
        <Image
          src={project.coverImage || '/placeholder.svg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-100"
          style={{ zIndex: 10 }}
        />
        <Image
          src={project.coverAnimated || '/placeholder.svg'}
          alt={project.title}
          fill
          className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ zIndex: 20 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-30 transition-opacity duration-500 opacity-100 group-hover:opacity-0" />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-40 transition-opacity duration-100 opacity-100 group-hover:opacity-0">
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
          <p className="text-sm text-zinc-400">{project.role}</p>
        </div>
      </div>
    </Link>
  )
}

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) return null

  const isSlider = projects.length > 3
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateButtons = () => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateButtons()
    el.addEventListener('scroll', updateButtons, { passive: true })
    return () => el.removeEventListener('scroll', updateButtons)
  }, [])

  const slide = (dir: 'prev' | 'next') => {
    const el = trackRef.current
    if (!el) return
    const item = el.querySelector('[data-featured-item]') as HTMLElement
    if (!item) return
    const gap = 32
    const amount = item.offsetWidth + gap
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <div className="relative z-10 py-20 max-w-5xl mx-auto px-4">
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-3">Featured Projects</h2>
        <div className="h-1 w-16 bg-primary rounded-full" />
      </div>

      {isSlider ? (
        <div className="relative">
          {/* Track */}
          <div
            ref={trackRef}
            className="flex gap-8 overflow-x-scroll [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            {projects.map((project, idx) => (
              <div
                key={`${project.slug}-${idx}`}
                data-featured-item
                className="flex-none w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          {/* Prev button */}
          <button
            onClick={() => slide('prev')}
            disabled={!canPrev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-all disabled:opacity-0 disabled:pointer-events-none shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next button */}
          <button
            onClick={() => slide('next')}
            disabled={!canNext}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-all disabled:opacity-0 disabled:pointer-events-none shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <ProjectCard key={`${project.slug}-${idx}`} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
