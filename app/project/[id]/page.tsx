import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// This would typically come from a database or API
const getProjectData = (id: string) => {
  // Sample project data
  const projects = [
    {
      id: "1",
      title: "Fantasy RPG UI",
      category: "Games",
      platform: "PC, Console",
      description:
        "A complete UI system for a fantasy role-playing game, including inventory management, character stats, quest tracking, and dialogue systems.",
      tools: "Unity, Adobe Photoshop, Illustrator",
      images: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      videoUrl: "/placeholder-video.mp4",
    },
    // More projects would be defined here
  ]

  return projects.find((p) => p.id === id) || projects[0]
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = getProjectData(params.id)

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <Link href="/#projects" className="inline-flex items-center text-[#0099ff] hover:text-[#007acc] mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {project.videoUrl && (
              <div className="mb-8 overflow-hidden">
                <video controls className="w-full h-auto">
                  <source src={project.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {project.images.map((image, index) => (
                <div key={index} className="overflow-hidden">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${project.title} - Image ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
              <div className="mb-6">
                <span className="inline-block border border-[#0099ff] text-[#0099ff] text-sm px-3 py-1 mr-2">
                  {project.category}
                </span>
                <span className="inline-block border border-zinc-700 text-white text-sm px-3 py-1">
                  {project.platform}
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-zinc-300">{project.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Tools Used</h2>
                <p className="text-zinc-300">{project.tools}</p>
              </div>

              <Button className="w-full bg-[#0099ff] hover:bg-[#007acc] border-0">View Live Demo</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
