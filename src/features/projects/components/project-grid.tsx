"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import ProjectCard from "@/features/projects/components/project-card"
import type { ProjectWithCategory, Category } from "@/features/projects/types/project"

interface ProjectGridProps {
  projects: ProjectWithCategory[]
  categories: Category[]
}

export default function ProjectGrid({ projects, categories }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? categories[0].slug : ""
  )

  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
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

  // Reset scroll when category changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [activeCategory])

  // Reset scroll when section comes into view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && scrollRef.current) {
            scrollRef.current.scrollTop = 0
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
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
          className={cn(
            "relative flex",
            "md:flex-row flex-col",
            "md:border-b border-zinc-800 md:w-full md:justify-center md:mb-8"
          )}
          style={{
            minWidth: "max-content",
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
        <div
          ref={scrollRef}
          className={cn(
            "p-4 overflow-y-auto scrollbar-custom rounded-lg",
            "md:ml-0 md:mr-0 flex-1"
          )}
          style={{
            height: "calc(2 * 17.5vw)",
            maxHeight: "700px",
            minHeight: "380px",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {categories.map((cat) => {
              if (activeCategory !== cat.slug) return null
              const list = projectsByCategory[cat.slug] ?? []
              if (list.length === 0) return (
                <div key={cat.slug} className="col-span-full text-center text-zinc-400 py-8">
                  No projects found.
                </div>
              )
              return list.map((project, idx) =>
                project.slug ? (
                  <Link href={`/project/${project.slug}`} key={`${cat.slug}-${project.slug}-${idx}`}>
                    <ProjectCard
                      slug={project.slug}
                      title={project.title}
                      role={project.role ?? ""}
                      tools={project.tools ?? ""}
                      coverImage={project.coverImage ?? ""}
                      coverAnimated={project.coverAnimated ?? ""}
                      columns={cat.slug === "games" || cat.slug === "uiux" ? 2 : 3}
                    />
                  </Link>
                ) : null
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
