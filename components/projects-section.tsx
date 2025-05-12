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
      title: "Ghosts of Tabor",
      role: "UX UI Artist",
      platform: "VR",
      tools:"",
      image: "/images/projects/games/GhostsOfTabor/Cover.png",
      animatedImage: "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
    },
    {
      id: 2,
      title: "Polker",
      role: "Unreal Developer",
      platform: "PC,Mobile",
      tools:"",
      image: "/images/projects/games/Polker/Cover.png",
      animatedImage: "/images/projects/games/Polker/AnimatedCover.png",
    },
    {
      id: 3,
      title: "Kalyskah",
      role: "Unreal Developer",
      platform: "PC",
      tools:"",
      image: "/images/projects/games/Kalyskah/Cover.png",
      animatedImage: "/images/projects/games/Kalyskah/AnimatedCover.jpeg",
    },
    {
      id: 4,
      title: "Naufrago",
      role: "Unreal Developer, Personal Project",
      platform: "PC",
      tools:"",
      image: "/images/projects/games/Naufrago/Cover.png",
      animatedImage: "/images/projects/games/Naufrago/AnimatedCover.gif",
    },
    {
      id: 5,
      title: "Pixel Escape",
      role: "Unreal Developer, Personal Project",
      platform: "PC",
      tools:"",
      image: "/images/projects/games/PixelEscape/Cover.png",
      animatedImage: "/images/projects/games/PixelEscape/AnimatedCover.gif",
    },
    {
      id: 6,
      title: "Pirate's Attack",
      role: "Unreal Developer, Personal Project",
      platform: "PC",
      tools:"",
      image: "/images/projects/games/PiratesAttack/Cover.jpeg",
      animatedImage: "/images/projects/games/PiratesAttack/AnimatedCover.png",
    },
    {
      id: 7,
      title: "Joe's Christmas",
      role: "Unreal Developer, Personal Project",
      platform: "PC",
      tools:"",
      image: "/images/projects/games/JoesChristmas/Cover.jpeg",
      animatedImage: "/images/projects/games/JoesChristmas/AnimatedCover.jpg",
    },
  ],
  uiux: [
    {
      id: 8,
      title: "Game Launcher Redesign",
      role: "",
      platform: "",
      tools: "Figma, Adobe XD",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 9,
      title: "Mobile Game Store",
      role: "",
      platform: "",
      tools: "Sketch, Principle",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 10,
      title: "In-game Store UI",
      role: "",
      platform: "",
      tools: "Figma, After Effects",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 11,
      title: "Game Settings Panel",
      role: "",
      platform: "",
      tools: "Adobe XD, Illustrator",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
  ],
  modeling: [
    {
      id: 12,
      title: "Character Assets",
      role: "",
      platform: "",
      tools: "Blender, ZBrush",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 13,
      title: "Environment Props",
      role: "",
      platform: "",
      tools: "Maya, Substance Painter",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 14,
      title: "Weapon Models",
      role: "",
      platform: "",
      tools: "3DS Max, Substance Designer",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 15,
      title: "Vehicle Designs",
      role: "",
      platform: "",
      tools: "Blender, Marmoset",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 16,
      title: "Architectural Elements",
      role: "",
      platform: "",
      tools: "Maya, V-Ray",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
  ],
  design: [
    {
      id: 17,
      title: "Game Logo Collection",
      role: "",
      platform: "",
      tools: "Illustrator, Photoshop",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 18,
      title: "Marketing Materials",
      role: "",
      platform: "",
      tools: "InDesign, Photoshop",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 19,
      title: "Character Concept Art",
      role: "",
      platform: "",
      tools: "Procreate, Photoshop",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 20,
      title: "UI Icon Set",
      role: "",
      platform: "",
      tools: "Illustrator, Figma",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 21,
      title: "Game Cover Art",
      role: "",
      platform: "",
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
    <section id="projects" className="gradient-bg-top bg-slate-900 "  >
      <div className="container py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Projects</h2>

        <div className="flex justify-center mb-5 ">
          <nav className="flex space-x-8 border-b border-zinc-700 w-full justify-center">
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
          className="bg-stone-950 p-5 max-h-[calc(2*300px+1.5rem)] overflow-y-auto scrollbar-custom"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCategory === "games" &&
              projects.games.map((project) => (
                <Link href={`/project/${project.id}`} key={project.id}>
                  <ProjectCard
                    title={project.title}
                    role={project.role}
                    platform={project.platform}
                    tools={project.tools}
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
                    role={project.role}
                    platform={project.platform}
                    tools={project.tools}
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
                    role={project.role}
                    platform={project.platform}
                    tools={project.tools}
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
                    role={project.role}
                    platform={project.platform}
                    tools={project.tools}
                    image={project.image}
                    animatedImage={project.animatedImage}
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
