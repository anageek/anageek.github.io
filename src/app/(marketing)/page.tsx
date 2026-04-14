import { getFeaturedProjects, getPublicProjects } from '@/features/projects'
import { getPublicCategories } from '@/features/categories'
import { getSiteConfigValue } from '@/features/site-config'
import { ScrollScaleVideo } from '@/features/hero/components/scroll-scale-video'
import { ProjectGrid, FeaturedProjectsSection } from '@/features/projects'
import { AboutSection } from '@/features/about'
import { ContactSection } from '@/features/contact'
import { ScrollReveal } from '@/components/common/scroll-reveal'
import { siteConfig } from '@/config/site'

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

        {/* Hero content — entrance animations */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <ScrollReveal animation="fade-down" duration={800} threshold={0}>
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-3">Portfolio</h2>
              <div className="h-1 w-16 bg-primary rounded-full" />
            </div>
          </ScrollReveal>
          <ScrollReveal animation="blur-in" duration={1000} delay={200} threshold={0}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
              {siteConfig.name}
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={800} delay={400} threshold={0}>
            <p className="text-lg md:text-xl text-zinc-400">
              {siteConfig.title}
            </p>
          </ScrollReveal>
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
      {featured.length > 0 && (
        <ScrollReveal animation="fade-up" duration={800}>
          <FeaturedProjectsSection projects={featured} />
        </ScrollReveal>
      )}

      <ScrollReveal animation="fade-up" duration={800}>
        <ProjectGrid projects={projects} categories={categories} />
      </ScrollReveal>

      <ScrollReveal animation="fade-up" duration={800}>
        <AboutSection />
      </ScrollReveal>

      <ScrollReveal animation="fade-up" duration={800}>
        <ContactSection />
      </ScrollReveal>
    </main>
  )
}
