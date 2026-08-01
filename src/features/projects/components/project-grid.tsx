"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import ProjectCard from "@/features/projects/components/project-card"
import type { ProjectWithCategory, Category } from "@/features/projects/types/project"

const ITEMS_PER_PAGE = 6

interface ProjectGridProps {
  projects: ProjectWithCategory[]
  categories: Category[]
}

export default function ProjectGrid({ projects, categories }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? categories[0].slug : ""
  )
  const [currentPage, setCurrentPage] = useState(0)

  const navRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // For sliding indicator
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; top: number; height: number }>({
    left: 0,
    width: 0,
    top: 0,
    height: 0,
  })
  const [isMobile, setIsMobile] = useState(false)

  // Group projects by category slug
  const projectsByCategory = categories.reduce<Record<string, ProjectWithCategory[]>>((acc, cat) => {
    acc[cat.slug] = projects.filter(
      (p) => p.category.slug === cat.slug && p.visible !== false
    )
    return acc
  }, {})

  const filteredProjects = projectsByCategory[activeCategory] ?? []
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  const paginatedProjects = filteredProjects.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)

  // Responsive check
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Sliding indicator position
  useEffect(() => {
    const activeBtn = btnRefs.current[activeCategory]
    const nav = navRef.current
    if (activeBtn && nav && !isMobile) {
      const navRect = nav.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()
      if (isMobile) {
        setIndicatorStyle({
          left: 0,
          width: 4,
          top: btnRect.top - navRect.top,
          height: btnRect.height,
        })
      } else {
        setIndicatorStyle({
          left: btnRect.left - navRect.left,
          width: btnRect.width,
          top: 0,
          height: 4,
        })
      }
    }
  }, [activeCategory, isMobile])

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(0)
  }, [activeCategory])

  return (
    <section
      id="projects"
      className="bg-black"
    >
      <div className="container pt-20 pb-20">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight mb-3">Projects</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>
        {/* Category Nav always on top */}
        <nav
          ref={navRef}
          role="tablist"
          aria-label="Project categories"
          className={cn(
            "relative flex",
            "md:flex-row flex-col",
            "md:border-b border-zinc-800 md:w-full md:justify-center md:mb-8"
          )}
          style={{
            position: "relative",
            height: isMobile ? "auto" : undefined,
          }}
        >
          {/* Sliding indicator */}
          <span
            className={cn(
              "absolute bg-primary transition-all duration-300 pointer-events-none",
              isMobile
                ? "left-0 top-0 w-[4px]"
                : "bottom-0 left-0 h-[4px]"
            )}
            style={
              isMobile
                ? { top: indicatorStyle.top, height: indicatorStyle.height, width: 4 }
                : { left: indicatorStyle.left, width: indicatorStyle.width, height: 4 }
            }
          />
          {categories.map((category) => (
            <button
              key={category.slug}
              ref={el => { btnRefs.current[category.slug] = el; }}
              role="tab"
              aria-selected={activeCategory === category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                "relative z-10 px-8 py-2 transition-colors text-sm uppercase tracking-wider text-left font-normal",
                isMobile
                  ? "border-b border-zinc-800 last:border-b-0"
                  : "",
                activeCategory === category.slug
                  ? "text-white font-medium"
                  : "text-zinc-500 hover:text-white",
              )}
            >
              {category.label}
            </button>
          ))}
        </nav>
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {paginatedProjects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center py-16">
              <svg className="w-12 h-12 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-zinc-500 text-sm">No projects in this category yet</p>
            </div>
          ) : paginatedProjects.map((project, idx) =>
            project.slug ? (
              <Link href={`/project/${project.slug}`} key={`${project.slug}-${idx}`}>
                <ProjectCard
                  slug={project.slug}
                  title={project.title}
                  role={project.role ?? ""}
                  tools={project.tools ?? ""}
                  coverImage={project.coverImage ?? ""}
                  coverAnimated={project.coverAnimated ?? ""}
                  columns={activeCategory === "games" || activeCategory === "uiux" ? 2 : 3}
                />
              </Link>
            ) : null
          )}
        </div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="w-9 h-9 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-zinc-500 font-medium tabular-nums">
              <span className="text-white">{currentPage + 1}</span>
              <span className="mx-1 text-zinc-700">/</span>
              {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="w-9 h-9 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
