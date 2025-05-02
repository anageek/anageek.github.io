"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  title: string
  subtitle: string
  image: string
  animatedImage: string
  columns: number
}

export default function ProjectCard({ title, subtitle, image, animatedImage, columns }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "group relative overflow-hidden transition-all duration-300 h-[300px] transform",
        columns === 3 ? "col-span-1" : "col-span-1 md:col-span-1",
        "hover:-translate-y-2" // Add this line for the floating effect
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

      <div className="relative w-full h-full">
        {isHovered ? (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={animatedImage || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-zinc-300">{subtitle}</p>
      </div>
    </div>
  )
}
