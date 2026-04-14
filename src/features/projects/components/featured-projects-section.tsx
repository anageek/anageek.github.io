import Link from "next/link"
import Image from "next/image"
import type { ProjectWithCategory } from "@/features/projects/types/project"

interface FeaturedProjectsSectionProps {
  projects: ProjectWithCategory[]
}

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  if (projects.length === 0) return null

  return (
    <div className="relative z-10 mt-12 max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center">Featured Projects</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <Link
            key={`${project.category.slug}-${project.slug}-${idx}`}
            href={`/project/${project.slug}`}
            className="block w-full h-full"
          >
            <div
              className={
                "rounded-lg group relative overflow-hidden shadow-[2px_2px_5px_black] transition-all duration-300 transform " +
                "w-full h-[15vw] max-h-[320px] min-h-[500px] col-span-1 rounded-lg hover:-translate-y-2 hover:shadow-[2px_2px_5px_#0099ff]"
              }
            >
              {/* Static cover as background */}
              <Image
                src={project.coverImage || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-100"
                style={{ zIndex: 10 }}
              />
              {/* Animated cover fades in on hover */}
              <Image
                src={project.coverAnimated || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ zIndex: 20 }}
              />

              {/* Blue highlight effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-30 transition-opacity duration-500 opacity-100 group-hover:opacity-0" />

              {/* Card content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-40 transition-opacity duration-100 opacity-100 group-hover:opacity-0">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-sm text-blue">{project.role}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
