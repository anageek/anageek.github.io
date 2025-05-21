"use client"

import Link from "next/link"
import VideoHero from "@/components/video-hero"
import ProjectsSection from "@/components/projects-section"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import Header from "@/components/header"
import { Suspense } from "react"

export default function HomePage() {
  return (

    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white text-2xl"></div>}> 
    <main className="min-h-screen bg-white text-white">
      <Header />

      <section id="hero" className="h-screen relative">
        <div className="absolute justify-center text-center gradient-bg w-screen h-screen">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Tech UI Designer</h1> 
          <p className="text-xl md:text-2xl mb-8">Creative Designer & Developer</p>
          <div className="relative inline-block">
            <Link
              href="#projects"
              className="cursor-pointer z-50 px-6 py-3 border border-[#0099ff] text-[#0099ff] rounded-md hover:bg-[#0099ff] hover:bg-opacity-10 transition-colors inline-flex items-center justify-center"
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
        {/* <div className="absolute inset-0 flex items-center justify-center">
        </div> */}
        
      </section>
    
      <ProjectsSection />
      <AboutSection />
      <ContactSection />


    </main>
    </Suspense>
  )
}
