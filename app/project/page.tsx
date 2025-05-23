"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "@/public/Projects-Content"
import { Monitor, Smartphone, } from "lucide-react"
import { Suspense, useEffect, useState } from "react"




const allProjects = Object.values(projects).flat();

export default function ProjectPage() {
  const [params, setParams] = useState({
    category: "",
    id: "",
  })
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");
      const category = searchParams.get("category");
      setParams({
        id: id || "",
        category: category || "",
      })
    }
  }, [])

  const { id, category } = params

  console.log("ID:", id) // Log the ID to see if it's correct
  console.log("Category:", category) // Log the category to see if it's correct
  if (!id || !category) {
    return (<Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl"></div>}>

      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl">
        <p className="bg-slate-700/50 rounded-lg border border-zinc-500 px-20 py-10 text-slate-200  font-sans font-light">Project not found</p>
      </div>
    </Suspense>)
  }

  console.log("All Projects:", category) // Log all projects to see the structure
  const getProjectData = projects[category as keyof typeof projects] ?? []
  console.log("getProjectData:", getProjectData)
  const project = getProjectData.find((project) => String(project.id) === id) // Find the project by ID


  console.log("Project: ", project)
  if (!project) {
    return (<Suspense fallback={
      //When there's no project show not found page
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl"></div>}>

      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl">
        <p className="bg-slate-700/50 rounded-lg border border-zinc-500 px-20 py-10 text-slate-200  font-sans font-light">Project not found</p>
      </div>
    </Suspense>)
  }
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl"></div>}>
      <main className="min-h-screen bg-zinc-900 text-white grid grid-cols-1 lg:grid-cols-3 ">
        {/* Left column: sticky info */}
        <div id="FixedInfo" className="bg-black/50 col-span-1 container shadow-[2px_2px_10px_black] ">
          <div className="sticky top-0 py-10">
            <Link
              href="/#projects"
              className="  inline-flex items-center text-[#0099ff] hover:text-[#007acc] mb-10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
            <br />

            <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-bold ">{project.title}</h1>

              {project.platform && (
                <div className="my-2 space-x-2">
                  {(Array.isArray(project.platform) ? project.platform : [project.platform]).map((platform, idx) => (
                    <span key={idx} className="">
                      {platform === "PC" && <Monitor className="inline w-5 h-5" />}
                      {platform === "Mobile" && <Smartphone className="inline w-5 h-5" />}
                      {platform === "VR" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="inline w-6 h-5"
                          viewBox="4 0 18 30 "
                          fill="none"
                        >
                          {/* Mask to subtract the lump from the main rectangle */}
                          <mask id="vr-mask">
                            {/* Main rectangle (white = visible) */}
                            <rect x="4" y="4" width="24" height="18" rx="6" fill="white" />
                            {/* Lump shape (black = cut out) */}
                            <ellipse cx="16" cy="24" rx="4" ry="6" fill="black" />
                          </mask>
                          {/* Main rectangle with lump cut out */}
                          <rect x="4" y="4" width="24" height="18" rx="6" fill="white" mask="url(#vr-mask)" />
                          {/* Left small rectangle */}
                          <rect x="0.5" y="10" width="5" height="7" rx="2.5" fill="white" />
                          {/* Right small rectangle */}
                          <rect x="26.5" y="10" width="5" height="7" rx="2.5" fill="white" />
                        </svg>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-6">
              <p className="text-zinc-300 text- font-sans">{project.role}</p>
            </div>
            <div className="mb-6">
              {/*<h2 className="text-xl font-semibold mb-2">Description</h2>*/}
              <p className="text-zinc-300 font-extralight font-sans text-justify">{project.description}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Tools Used</h2>
              <p className="text-zinc-300 font-extralight font-sans">{project.tools}</p>
            </div>
            {project.designurl && project.designButtonLabel && (
              <Button className="bg-[#0099ff] hover:bg-[#007acc] border-0 px-10">
                <a href={project.designurl}>{project.designButtonLabel}</a>
              </Button>
            )}
          </div>
        </div>

        {/* Right column: video, sections, images, etc. */}
        <div className="col-span-2 container py-10">


          {/* Video URL*/}
          {project.videoUrl && (
            <div className="mb-8 w-full aspect-video rounded-lg overflow-hidden shadow-[2px_2px_10px_black] ">
              <iframe
                width="500"
                height="500"
                src={project.videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full rounded-lg "
              ></iframe>
            </div>
          )}

          {/* Sections*/}
          {project.sections?.map((section, index) => (
            <div key={index} className="flex flex-col mb-8 ">
              <h1 className="bg-stone-950  px-10 py-5  rounded-sm text-2xl font-bold ">{section.title}</h1>

              <div className={`grid ${section.image ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                <div className={section.image ? "" : "col-span-1"}>
                  {section.description.map((item, idx) => {
                    if (item.type === "heading") {
                      return <h3 key={idx} className="text-lg font-bold mt-5 mx-10 text-white text-justify">{item.text}</h3>
                    }
                    if (item.type === "paragraph") {
                      return <p key={idx} className="text-zinc-300 font-light font-sans mx-10 text-justify">{item.text}</p>
                    }
                    if (item.type === "list" && Array.isArray(item.items)) {
                      return (
                        <ul key={idx} className="list-disc pl-8 mb-4 text-zinc-300 font-extralight font-sans mx-10 text-justify">
                          {item.items.map((point: string, i: number) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      )
                    }
                    return null
                  })}

                </div>

                {section.image && (
                  <div className="col-span-1 items-center justify-center flex  ">

                    <Image
                      src={section.image || "/placeholder.svg"}
                      alt={`${project.title} - Section ${index + 1}`}
                      width={400}
                      height={400}
                      className="w-full max-w-3xl h-auto mx-auto my-6 rounded-lg "
                    />
                  </div>
                )}


              </div>


            </div>
          ))}
          {/* Images*/}
          <div
            className={`grid gap-4 mb-8 ${project.images.length === 1
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2"
              }`}
          >
            {project.images.map((image, index) => (
              <div key={index} className="overflow-hidden shadow-[2px_2px_10px_black] rounded-lg">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${project.title} - Image ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto  "
                />
              </div>
            ))}
          </div>
        </div>




      </main>
    </Suspense>
  )
}
