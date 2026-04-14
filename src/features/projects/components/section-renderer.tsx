import Image from "next/image"
import type { SectionBlock } from "@/features/projects/types/project"

interface Section {
  title: string
  image?: string | null
  video?: string | null
  blocks: SectionBlock[]
}

interface SectionRendererProps {
  section: Section
  projectTitle: string
  sectionIndex: number
  onImageClick: (imageSrc: string) => void
}

export default function SectionRenderer({ section, projectTitle, sectionIndex, onImageClick }: SectionRendererProps) {
  return (
    <div className="flex flex-col mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">{section.title}</h1>
        <div className="h-1 w-20 bg-blue-600 rounded-full" />
      </div>

      {/* Per-section video */}
      {section.video && (
        <div className="mb-8 w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-zinc-800/50">
          <iframe
            src={section.video}
            title={`${section.title} video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      <div className={`grid gap-12 ${section.image ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        <div className="space-y-6">
          {section.blocks.map((block, idx) => {
            if (block.type === "heading" && block.text) {
              return <h3 key={idx} className="text-xl font-bold text-white">{block.text}</h3>
            }
            if (block.type === "paragraph" && block.text) {
              return <p key={idx} className="text-zinc-400 font-light leading-relaxed text-justify">{block.text}</p>
            }
            if (block.type === "list" && Array.isArray(block.items)) {
              return (
                <ul key={idx} className="space-y-3">
                  {block.items.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-400 font-light text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              )
            }
            if (block.type === "image" && block.image) {
              return (
                <div
                  key={idx}
                  className="my-8 rounded-3xl overflow-hidden cursor-zoom-in group border border-zinc-800/50 shadow-xl"
                  onClick={() => onImageClick(block.image!)}
                >
                  <Image
                    src={block.image || "/placeholder.svg"}
                    alt={`${projectTitle} - Section Image`}
                    width={800}
                    height={600}
                    className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              )
            }
            if (block.type === "video" && block.video) {
              return (
                <div key={idx} className="my-8 w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-zinc-800/50">
                  <iframe
                    src={block.video}
                    title={`${projectTitle} block video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )
            }
            return null
          })}
        </div>

        {section.image && (
          <div
            className="relative group cursor-zoom-in rounded-3xl overflow-hidden border border-zinc-800/50 shadow-xl"
            onClick={() => onImageClick(section.image!)}
          >
            <Image
              src={section.image || "/placeholder.svg"}
              alt={`${projectTitle} - Section ${sectionIndex + 1}`}
              width={500}
              height={500}
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  )
}
