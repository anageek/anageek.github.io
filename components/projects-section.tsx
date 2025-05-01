"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import ProjectCard from "@/components/project-card"

// Sample project data
const projects = {
  games: [
    {
      id: 1,
      title: "Pixel Escape - O Enigma de Lucas",
      platform: "PC",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      title: "Pirate's Attack",
      platform: "PC",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      title: "Naufrago - The Crab Island",
      platform: "PC",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 4,
      title: "Poles Apart",
      platform: "PC",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 5,
      title: "Joe's Christmas",
      platform: "PC",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 6,
      title: "Elemental Worlds",
      platform: "PC",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 7,
      title: "Cold Trail",
      platform: "PC",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 8,
      title: "Escape from Coronga",
      platform: "PC",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    }
  ],
  uiux: [
    {
      id: 9,
      title: "Game Launcher Redesign",
      tools: "Figma, Adobe XD",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 10,
      title: "Mobile Game Store",
      tools: "Sketch, Principle",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 11,
      title: "In-game Store UI",
      tools: "Figma, After Effects",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 12,
      title: "Game Settings Panel",
      tools: "Adobe XD, Illustrator",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
  ],
  modeling: [
    {
      id: 13,
      title: "Character Assets",
      tools: "Blender, ZBrush",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 14,
      title: "Environment Props",
      tools: "Maya, Substance Painter",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 15,
      title: "Weapon Models",
      tools: "3DS Max, Substance Designer",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 16,
      title: "Vehicle Designs",
      tools: "Blender, Marmoset",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 17,
      title: "Architectural Elements",
      tools: "Maya, V-Ray",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
  ],
  design: [
    {
      id: 18,
      title: "Game Logo Collection",
      tools: "Illustrator, Photoshop",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 19,
      title: "Marketing Materials",
      tools: "InDesign, Photoshop",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 20,
      title: "Character Concept Art",
      tools: "Procreate, Photoshop",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 21,
      title: "UI Icon Set",
      tools: "Illustrator, Figma",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 22,
      title: "Game Cover Art",
      tools: "Photoshop, Illustrator",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
  ],
}

type Category = "games" | "uiux" | "modeling" | "design"

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("games")

  return (
    <section id="projects" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Projects</h2>

        <div className="flex justify-center mb-12">
          <nav className="flex space-x-8 border-b border-zinc-700 w-full max-w-2xl justify-center">
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
                    ? "text-[#0099ff] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0099ff]"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategory === "games" &&
            projects.games.map((project) => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <ProjectCard
                  title={project.title}
                  subtitle={project.platform}
                  image={project.image}
                  animatedImage={project.animatedImage}
                  columns={2}
                />
              </Link>
            ))}

          {activeCategory === "uiux" &&
            projects.uiux.map((project) => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <ProjectCard
                  title={project.title}
                  subtitle={project.tools}
                  image={project.image}
                  animatedImage={project.animatedImage}
                  columns={2}
                />
              </Link>
            ))}

          {activeCategory === "modeling" &&
            projects.modeling.map((project) => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <ProjectCard
                  title={project.title}
                  subtitle={project.tools}
                  image={project.image}
                  animatedImage={project.animatedImage}
                  columns={3}
                />
              </Link>
            ))}

          {activeCategory === "design" &&
            projects.design.map((project) => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <ProjectCard
                  title={project.title}
                  subtitle={project.tools}
                  image={project.image}
                  animatedImage={project.animatedImage}
                  columns={3}
                />
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}
