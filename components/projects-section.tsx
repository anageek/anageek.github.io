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
      image: "/images/projects/games/GhostsOfTabor/Cover.png",
      animatedImage: "/images/projects/games/GhostsOfTabor/AnimatedCover.gif",
    },
    {
      id: 2,
      title: "Polker",
      role: "Unreal Developer",
      platform: "PC,Mobile",
      image: "/images/projects/games/Polker/Cover.png",
      animatedImage: "/images/projects/games/Polker/AnimatedCover.png",
    },
    {
      id: 3,
      title: "Kalyskah",
      role: "Unreal Developer",
      platform: "PC",
      image: "/images/projects/games/kalyskah/Cover.png",
      animatedImage: "/images/projects/games/kalyskah/AnimatedCover.jpeg",
    },
    {
      id: 4,
      title: "Naufrago",
      role: "Unreal Developer, Personal Project",
      platform: "PC",
      image: "/images/projects/games/Naufrago/Cover.png",
      animatedImage: "/images/projects/games/Naufrago/AnimatedCover.gif",
    },
    {
      id: 5,
      title: "Pixel Escape",
      role: "Unreal Developer, Personal Project",
      platform: "PC",
      image: "/images/projects/games/PixelEscape/Cover.png",
      animatedImage: "/images/projects/games/PixelEscape/AnimatedCover.gif",
    },
    {
      id: 6,
      title: "Pirate's Attack",
      role: "Unreal Developer, Personal Project",
      platform: "PC",
      image: "/images/projects/games/PiratesAttack/Cover.jpeg",
      animatedImage: "/images/projects/games/PiratesAttack/AnimatedCover.png",
    },
    {
      id: 7,
      title: "Joe's Christmas",
      role: "Unreal Developer, Personal Project",
      platform: "PC",
      image: "/images/projects/games/JoesChristmas/Cover.jpeg",
      animatedImage: "/images/projects/games/JoesChristmas/AnimatedCover.jpg",
    },
  ],
  uiux: [
    {
      id: 5,
      title: "Game Launcher Redesign",
      tools: "Figma, Adobe XD",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 6,
      title: "Mobile Game Store",
      tools: "Sketch, Principle",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 7,
      title: "In-game Store UI",
      tools: "Figma, After Effects",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 8,
      title: "Game Settings Panel",
      tools: "Adobe XD, Illustrator",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
  ],
  modeling: [
    {
      id: 9,
      title: "Character Assets",
      tools: "Blender, ZBrush",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 10,
      title: "Environment Props",
      tools: "Maya, Substance Painter",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 11,
      title: "Weapon Models",
      tools: "3DS Max, Substance Designer",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 12,
      title: "Vehicle Designs",
      tools: "Blender, Marmoset",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 13,
      title: "Architectural Elements",
      tools: "Maya, V-Ray",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
  ],
  design: [
    {
      id: 14,
      title: "Game Logo Collection",
      tools: "Illustrator, Photoshop",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 15,
      title: "Marketing Materials",
      tools: "InDesign, Photoshop",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 16,
      title: "Character Concept Art",
      tools: "Procreate, Photoshop",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 17,
      title: "UI Icon Set",
      tools: "Illustrator, Figma",
      image: "/placeholder.svg?height=400&width=600",
      animatedImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 18,
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
    <section id="projects" className="pb-20  bg-zinc-900">
      <div className="gradient-bg-top" />
      <div className="container margin-top--">
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
                  role={project.role}
                  platform={project.platform}
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
                  tools={project.tools}
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
