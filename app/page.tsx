"use client"

import Link from "next/link"
import VideoHero from "@/components/video-hero"
import ProjectsSection from "@/components/projects-section"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import Header from "@/components/header"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section id="hero" className="h-screen relative">
        <div className="absolute justify-center text-center gradient-bg w-screen h-screen">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Ana Neiva | Tech UI Designer</h1>
          <p className="text-xl md:text-2xl mb-8">Creative Designer & Developer</p>
          <Link
            href="#projects"
            className="cursor-pointer z-50 relative px-6 py-3 border border-[#0099ff] text-[#0099ff] rounded-md hover:bg-[#0099ff] hover:bg-opacity-10 transition-colors"
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
        </div>

        <VideoHero />
        {/* <div className="absolute inset-0 flex items-center justify-center">
        </div> */}
        
      </section>
    




   
      

      <ProjectsSection />
      <AboutSection />
      <ContactSection />

      <footer className="bg-zinc-900 py-6 text-center text-zinc-400">
        <p>© {new Date().getFullYear()} by Ana Neiva. All rights reserved.</p>
      </footer>
    </main>
  )
}
