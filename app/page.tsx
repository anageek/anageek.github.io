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
        <VideoHero />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Game UI Portfolio</h1>
            <p className="text-xl md:text-2xl mb-8">Creative Designer & Developer</p>
            <Link
              href="#projects"
              className="px-6 py-3 border border-[#0099ff] text-[#0099ff] rounded-md hover:bg-[#0099ff] hover:bg-opacity-10 transition-colors"
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
        </div>
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
