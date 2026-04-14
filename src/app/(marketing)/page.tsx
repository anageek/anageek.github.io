import { getFeaturedProjects, getPublicProjects } from '@/features/projects'
import { getPublicCategories } from '@/features/categories'
import { getSiteConfigValue } from '@/features/site-config'
import { VideoHero } from '@/features/hero'
import { ProjectGrid, FeaturedProjectsSection } from '@/features/projects'
import { AboutSection } from '@/features/about'
import { ContactSection } from '@/features/contact'
import { siteConfig } from '@/config/site'
import Link from 'next/link'

export default async function HomePage() {
  const [featured, projects, categories, heroVideoUrl] = await Promise.all([
    getFeaturedProjects(),
    getPublicProjects(),
    getPublicCategories(),
    getSiteConfigValue('heroVideoUrl'),
  ])

  const defaultVideo = 'https://www.youtube.com/embed/mzg3fhwPQQc?si=014MDzNOCnpXGT15&autoplay=1&mute=1&loop=1&playlist=mzg3fhwPQQc'

  return (
    <main className="min-h-screen bg-black text-white">
      <section id="hero" className="h-screen relative flex items-center justify-center overflow-hidden">
        {/* Background video */}
        <VideoHero src={heroVideoUrl || defaultVideo} />

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/70 via-black/30 to-black/80 pointer-events-none" />

        {/* Hero content — centered on screen */}
        <div className="relative z-30 flex flex-col items-center text-center px-4">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] text-zinc-400 mb-4">
            Portfolio
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-3">
            {siteConfig.name}
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-10">
            {siteConfig.title}
          </p>
          <Link
            href="#projects"
            className="group cursor-pointer z-50 px-8 py-3 border border-primary bg-primary/10 text-white rounded-lg hover:bg-primary transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            View Projects
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-y-0.5 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <span className="animate-bounce block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </section>

      {featured.length > 0 && <FeaturedProjectsSection projects={featured} />}

      <ProjectGrid projects={projects} categories={categories} />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
