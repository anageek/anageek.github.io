"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import ProjectCard from "@/components/project-card"
import { projects } from "@/public/Projects-Content"


type Category = "games" | "uiux" | "modeling" | "design"

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("games")
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})


   // For sliding indicator
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  useEffect(() => {
    const activeBtn = btnRefs.current[activeCategory]
    const nav = navRef.current
    if (activeBtn && nav) {
      const navRect = nav.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()
      setIndicatorStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      })
    }
  }, [activeCategory])


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
      { threshold: 0.5 } // Adjust as needed
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="gradient-bg-top bg-slate-900 "
    >
      <div className="container pt-20 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-5 text-center">Projects</h2>
<div className="flex justify-center ">
          <nav
            ref={navRef}
            className="relative flex border-b border-zinc-700 w-full justify-center mr-10 ml-10"
          >
            {/* Sliding indicator */}
            <span
              className="absolute bottom-0 h-[4px] bg-[#0099ff] transition-all duration-300"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                pointerEvents: "none",
              }}
            />
            {[
              { id: "games", label: "Games" },
              { id: "uiux", label: "UI/UX" },
              { id: "modeling", label: "3D Modeling" },
              { id: "design", label: "Graphic Design" },
            ].map((category) => (
              <button
                key={category.id}
                ref={el => { btnRefs.current[category.id] = el; }}
                onClick={() => setActiveCategory(category.id as Category)}
                className={cn(
                  "relative z-10 px-8 py-2 transition-colors text-sm uppercase tracking-wider text-left font-regular text-md font-sans text-white",
                  activeCategory === category.id
                    ? "text-[#ffffff] font-bold"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>
        <div
          ref={scrollRef}
          className="p-4 overflow-y-auto scrollbar-custom  bg-black/20 mr-10 ml-10 rounded-b-lg"
          style={{
            height: "calc(2 * 17.5vw)", // 2 rows + 1 gap (adjust if you change card height/gap)
            maxHeight: "700px", // Optional: prevent it from getting too tall on huge screens
            minHeight: "380px", // Optional: minimum height for small screens
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {activeCategory === "games" &&
              projects.games.map((project) => (
                <Link href={`/project?id=${project.id}&category=games`} key={project.id}>
                  <ProjectCard
                    title={project.title}
                    role={project.role}
                    tools={project.tools}
                    coverImage={project.coverImage}
                    coverAnimated={project.coverAnimated}
                    columns={2}
                  />
                </Link>
              ))}

            {activeCategory === "uiux" &&
              projects.uiux.map((project) => (
                <Link href={`/project?id=${project.id}&category=uiux`} key={project.id}>
                  <ProjectCard
                    title={project.title}
                    role={project.role}
                    tools={project.tools}
                    coverImage={project.coverImage}
                    coverAnimated={project.coverAnimated}
                    columns={2}
                  />
                </Link>
              ))}

            {activeCategory === "modeling" &&
              projects.modeling.map((project) => (
                <Link href={`/project?id=${project.id}&category=modeling`} key={project.id}>
                  <ProjectCard
                    title={project.title}
                    role={project.role}
                    tools={project.tools}
                    coverImage={project.coverImage}
                    coverAnimated={project.coverAnimated}
                    columns={3}
                  />
                </Link>
              ))}

            {activeCategory === "design" &&
              projects.design.map((project) => (
                <Link href={`/project?id=${project.id}&category=design`} key={project.id}>
                  <ProjectCard
                    title={project.title}
                    role={project.role}
                    tools={project.tools}
                    coverImage={project.coverImage}
                    coverAnimated={project.coverAnimated}
                    columns={3}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
