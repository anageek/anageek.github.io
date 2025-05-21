"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "@/public/Projects-Content"

import { Suspense, useEffect, useState } from "react"




const allProjects = Object.values(projects).flat();

export default function ProjectPage() {
  const [params,setParams] = useState({
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
  },[])
   
const { id, category } = params
  
  console.log("ID:", id) // Log the ID to see if it's correct
  console.log("Category:", category) // Log the category to see if it's correct
  if (!id || !category) {
    return (<Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl"></div>}>

      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl">
        <p className="bg-slate-700/50 rounded-lg border border-zinc-500 px-20 py-10 text-slate-200 bg-black/20 font-sans font-light">Project not found</p>
      </div>
    </Suspense>)
  }

  console.log("All Projects:", category) // Log all projects to see the structure
  const getProjectData = projects[category as keyof typeof projects] ?? []
  console.log("getProjectData:", getProjectData)
  const project = getProjectData.find((project) => String(project.id) === id) // Find the project by ID


  console.log("Project: ", project)
  if (!project) {
    return (<Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl"></div>}>

      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl">
        <p className="bg-slate-700/50 rounded-lg border border-zinc-500 px-20 py-10 text-slate-200 bg-black/20 font-sans font-light">Project not found</p>
      </div>
    </Suspense>)
  }
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl"></div>}>
      <main className="min-h-screen bg-black text-white pt-4">
        {/* <h2 className="text-3xl md:text-4xl font-bold mb-5 text-center">
        {project.category}
      </h2> */}
        <div className="container mx-auto px-4 ">
          <Link
            href="/#projects"
            className="inline-flex items-center text-[#0099ff] hover:text-[#007acc] mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {project.videoUrl && (
                <iframe
                  width="900"
                  height="500"
                  src={project.videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="mb-8"
                ></iframe>
              )}

              <div
                className={`grid gap-4 mb-8 ${project.images.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2"
                  }`}
              >
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
              <div className="sticky top-36 ">
                <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                <div className="mb-6">
                  {project.platform && (
                    <span className="inline-block border border-zinc-700 text-white text-sm px-3 py-1">
                      {project.platform}
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-zinc-300 font-extralight font-sans">{project.description}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Tools Used</h2>
                  <p className="text-zinc-300 font-extralight font-sans">{project.tools}</p>
                </div>

                {/* Conditionally render the button */}
                {project.designurl && project.designButtonLabel && (
                  <Button className="bg-[#0099ff] hover:bg-[#007acc] border-0 px-10">
                    <a href={project.designurl}>{project.designButtonLabel}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  )
}
