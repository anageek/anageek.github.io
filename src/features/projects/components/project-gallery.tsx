"use client"

import Image from "next/image"

interface ProjectGalleryProps {
  images: string[]
  projectTitle: string
  onImageClick: (imageSrc: string) => void
}

export default function ProjectGallery({
  images,
  projectTitle,
  onImageClick,
}: ProjectGalleryProps) {
  if (images.length === 0) return null

  return (
    <>
      {/* Main Images Gallery */}
      <div className="relative mb-8 mt-16 pt-16 border-t border-zinc-800/50">
        <h2 className="text-2xl font-semibold tracking-tight mb-3">Project Gallery</h2>
        <div className="h-1 w-16 bg-primary rounded-full" />
      </div>

      <div
        className={`grid gap-6 ${images.length === 1
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2"
          }`}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="overflow-hidden cursor-zoom-in group border border-zinc-800/50 shadow-xl shadow-black/20"
            onClick={() => onImageClick(image)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${projectTitle} - Image ${index + 1}`}
              width={800}
              height={600}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        ))}
      </div>
    </>
  )
}
