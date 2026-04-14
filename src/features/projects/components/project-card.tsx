"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  slug: string
  title: string
  role: string
  tools: string
  coverImage: string
  coverAnimated: string
  columns: number
}

export default function ProjectCard({ title, role, tools, coverImage, coverAnimated, columns }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Preload animated cover for smooth hover
  useEffect(() => {
    if (coverAnimated) {
      const img = new window.Image()
      img.src = coverAnimated
    }
  }, [coverAnimated])

  return (
    <div
      data-testid="project-card"
      className={cn(
        "rounded-lg group relative overflow-hidden shadow-[2px_2px_5px_black] transition-all duration-300 transform",
        "w-full h-[15vw] max-h-[320px] min-h-[180px]", // Responsive height
        columns === 3 ? "col-span-1" : "col-span-1 md:col-span-1",
        "rounded-lg hover:-translate-y-2",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-black"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Blue highlight effect */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-20
          transition-opacity duration-500
          ${isHovered ? "opacity-0" : "opacity-100"}
        `}
      />
      <div className="relative w-full h-full ">
        {isHovered ? (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={coverAnimated || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-100 "
            />
          </div>
        ) : (
          <Image
            src={coverImage || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-100 "
          />
        )}
      </div>

      <div className={
            `transition-opacity duration-500 ease-in-out
            ${!isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
      >
          <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-zinc-400">{role}</p>
          </div>
       </div>
    </div>
  )
}
