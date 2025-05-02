import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// This would typically come from a database or API
// Sample project data
const projects = [
  {
    id: "1",
    title: "Naufrago",
    category: "Games",
    platform: "Solo Dev",
    description:
      "Naufrago is a survival exploration game set on a remote, mysterious island. This early alpha represents the first playable environment—Crab Island—where players must gather resources, craft tools, and adapt to the challenges of an isolated landscape.Development began in September 2019, with a focus on creating a grounded, immersive survival experience. This prototype showcases the game's core mechanics, atmosphere, and design direction.",
    tools: "Unreal Engine 4, Adobe Photoshop, Blender",
    images: [
      "/images/projects/games/bamboo.png?height=600&width=800",
      "/images/projects/games/bananatree.png?height=600&width=800",
      "/images/projects/games/modifyItem.png?height=600&width=800",
      "/images/projects/games/worktable.png?height=600&width=800",
      "/images/projects/games/worktableUI.gif?height=600&width=800",
    ],
    videoUrl: "https://www.youtube.com/watch?v=EwmypPEZRCk",
  },
  // More projects would be defined here
]

const getProjectData = (id: string) => {
  return projects.find((p) => p.id === id) || projects[0]
}

export async function generateStaticParams(params: any) {
  return projects
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = getProjectData(id)

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
             
                <iframe  className="w-full h-auto aspect-video"  src={project.videoUrl}  title="YouTube video player"  frameBorder="0"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"  allowFullScreen></iframe>
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
