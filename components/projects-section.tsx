"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import ProjectCard from "@/components/project-card"
import {projects} from "@/public/Projects-Content"


type Category = "games" | "uiux" | "modeling" | "design"

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("games")
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

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
          <nav className="flex space-x-8 border-b border-zinc-700 w-full justify-center mr-10 ml-10">
            {[
              { id: "games", label: "Games" },
              { id: "uiux", label: "UI/UX" },
              { id: "modeling", label: "3D Modeling" },
              { id: "design", label: "Graphic Design" },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as Category)}
                className={cn(
                  "px-4 py-2 transition-colors relative text-sm uppercase tracking-wider",
                  activeCategory === category.id
                    ? "text-[#0099ff] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#0099ff]"
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
                <Link href={`/project/games_${project.id}`} key={project.id}>
                  <ProjectCard
                    title={project.title}
                    role={project.role}
                    platform={project.platform}
                    tools={project.tools}
                    coverImage={project.coverImage}
                    coverAnimated={project.coverAnimated}
                    columns={2}
                  />
                </Link>
              ))}

            {activeCategory === "uiux" &&
              projects.uiux.map((project) => (
                <Link href={`/project/uiux_${project.id}`} key={project.id}>
                  <ProjectCard
                    title={project.title}
                    role={project.role}
                    platform={project.platform}
                    tools={project.tools}
                    coverImage={project.coverImage}
                    coverAnimated={project.coverAnimated}
                    columns={2}
                  />
                </Link>
              ))}

            {activeCategory === "modeling" &&
              projects.modeling.map((project) => (
                <Link href={`/project/modeling_${project.id}`} key={project.id}>
                  <ProjectCard
                    title={project.title}
                    role={project.role}
                    platform={project.platform}
                    tools={project.tools}
                    coverImage={project.coverImage}
                    coverAnimated={project.coverAnimated}
                    columns={3}
                  />
                </Link>
              ))}

            {activeCategory === "design" &&
              projects.design.map((project) => (
                <Link href={`/project/design_${project.id}`} key={project.id}>
                  <ProjectCard
                    title={project.title}
                    role={project.role}
                    platform={project.platform}
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
