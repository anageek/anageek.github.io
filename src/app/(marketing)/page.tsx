import { getFeaturedProjects, getPublicProjects } from '@/features/projects'
import { getPublicCategories } from '@/features/categories'
import { getSiteConfigValue } from '@/features/site-config'
import { ScrollScaleVideo } from '@/features/hero/components/scroll-scale-video'
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
      {/* ── Hero — Clean, minimal ─────────────────────────────────── */}
      <section id="hero" className="h-screen relative flex items-center justify-center overflow-hidden bg-black">
        {/* Subtle animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,153,255,0.06)_0%,_transparent_70%)]" />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] text-zinc-500 mb-6">
            Portfolio
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
            {siteConfig.name}
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12">
            {siteConfig.title}
          </p>
          <Link
            href="#showreel"
            className="group cursor-pointer px-8 py-3 border border-zinc-700 text-white rounded-lg hover:border-primary hover:bg-primary/10 transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            Watch Demo Reel
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-y-0.5 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <span className="animate-bounce block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </section>

      {/* ── Demo Reel — Video scales up on scroll ────────────────── */}
      <section id="showreel" className="relative bg-black py-20">
        <ScrollScaleVideo src={heroVideoUrl || defaultVideo} />
      </section>

      {/* ── Featured Projects ─────────────────────────────────────── */}
      {featured.length > 0 && <FeaturedProjectsSection projects={featured} />}

      <ProjectGrid projects={projects} categories={categories} />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
