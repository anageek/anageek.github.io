"use client"

import Link from "next/link"
import VideoHero from "@/components/video-hero"
import ProjectsSection from "@/components/projects-section"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import Header from "@/components/header"
import { Suspense } from "react"
import { projects } from "@/public/Projects-Content"
import Image from "next/image"
import { useEffect, useState } from "react";

export default function HomePage() {
  // Define highlighted projects by category and id
  const highlighted = [
    { category: "games", id: "1" },
    { category: "uiux", id: "1" },
    { category: "uiux", id: "2" },
  ]
  // Filter the highlighted projects
  const highlightedProjects = highlighted
    .map(({ category, id }) => {
      const getProjectData = projects[category as keyof typeof projects] ?? []
      const project = getProjectData.find((project) => String(project.id) === id)
      return project ? { project, category } : null
    })
    .filter(Boolean) as { project: any; category: string }[]

  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
    }
  }, []);
  return (

    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl"></div>}>
      <main className="min-h-screen bg-black text-white">
        <Header />

        <section id="hero" className="min-h-screen relative flex flex-col items-center justify-between">
          <div className="text-center gradient-bg w-full flex-1 flex items-end justify-center">
            {/* <h1 className="text-4xl md:text-6xl font-bold mb-4">Tech UI Designer</h1>
            <p className="text-xl md:text-2xl mb-8">Creative Designer & Developer</p> */}
            <div className="w-full flex flex-col items-center mb-5">
              <Link
                href="#projects"
                className="cursor-pointer z-50 px-6 py-3 border border-[#0099ff] bg-[#0099ff] text-white rounded-md hover:bg-[#0099ff] hover:bg-opacity-10 transition-colors inline-flex items-center justify-center"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("projects")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }}
              >
                View Projects
              </Link>
              <div className="items-center justify-center flex flex-col mt-4">
                <span className="animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#0099ff]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>

            </div>

          </div>

          <VideoHero />
        </section>


        {/* Highlighted Projects Section */}
        <div className="relative z-10 mt-12 max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0099ff] mb-8 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {highlightedProjects.map(({ project, category }) => {
              const { coverImage, coverAnimated, title, role } = project;
              return (
                <Link
                  key={project.id}
                  href={`/project?id=${project.id}&category=${category}`}
                  className="block w-full h-full"
                >
                  <div
                    className={
                      "rounded-sm group relative overflow-hidden shadow-[2px_2px_5px_black] transition-all duration-300 transform " +
                      "w-full h-[15vw] max-h-[320px] min-h-[500px] col-span-1 rounded-sm hover:-translate-y-2 hover:shadow-[2px_2px_5px_#0099ff]"
                    }
                  >
                    {/* Static cover as background */}
                    <Image
                      src={coverAnimated || "/placeholder.svg"}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-100"
                      style={{ zIndex: 10 }}
                    />
                    {/* Animated cover fades in on hover */}
                    <Image
                      src={coverAnimated || "/placeholder.svg"}
                      alt={title}
                      fill
                      className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ zIndex: 20 }}
                    />

                    {/* Blue highlight effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-30 transition-opacity duration-500 opacity-100 group-hover:opacity-0" />

                    {/* Card content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-40 transition-opacity duration-100 opacity-100 group-hover:opacity-0">
                      <h3 className="text-xl font-bold text-white">{title}</h3>
                      <p className="text-sm text-blue">{role}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>




        <ProjectsSection />
        <AboutSection />
        <ContactSection />


      </main>
    </Suspense>
  )
}
