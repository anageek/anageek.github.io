"use client"

import { ProgressiveImage } from "@/components/common/progressive-image"

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
            className="overflow-hidden cursor-pointer group"
            onClick={() => onImageClick(image)}
          >
            <ProgressiveImage
              src={image || "/placeholder.svg"}
              alt={`${projectTitle} - Image ${index + 1}`}
              width={1600}
              height={1200}
              quality={100}
              sizes="(max-width: 768px) 100vw, calc((100vw - 340px) / 2)"
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
              wrapperClassName="w-full"
            />
          </div>
        ))}
      </div>
    </>
  )
}
