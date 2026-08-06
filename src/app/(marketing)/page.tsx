import { getFeaturedProjects, getPublicProjects } from '@/features/projects'
import { getPublicCategories } from '@/features/categories'
import { getSiteConfigValue } from '@/features/site-config'
import { HeroSection } from '@/features/hero/components/hero-section'
import { ProjectGrid, FeaturedProjectsSection } from '@/features/projects'
import { AboutSection } from '@/features/about'
import { ContactSection } from '@/features/contact'
import { AnimatedWave } from '@/features/contact/components/animated-wave'
import { ScrollReveal } from '@/components/common/scroll-reveal'

export default async function HomePage() {
  const [featured, projects, categories, heroVideoUrl, titleGlitch] = await Promise.all([
    getFeaturedProjects(),
    getPublicProjects(),
    getPublicCategories(),
    getSiteConfigValue('heroVideoUrl'),
    getSiteConfigValue('titleGlitch'),
  ])
  const glitchEnabled = titleGlitch === 'true'

  const defaultVideo = 'https://www.youtube.com/embed/mzg3fhwPQQc?si=014MDzNOCnpXGT15&autoplay=1&mute=1&loop=1&playlist=mzg3fhwPQQc'

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ── Hero — vídeo de fundo + texto minimizável ────────────────── */}
      <HeroSection videoUrl={heroVideoUrl || defaultVideo} glitchEnabled={glitchEnabled} />

      {/* ── Featured Projects — logo abaixo do hero ───────────────────── */}
      {featured.length > 0 && (
        <ScrollReveal animation="fade-up" duration={800}>
          <FeaturedProjectsSection projects={featured} />
        </ScrollReveal>
      )}

      {/* ── Projects + About — gradiente de preto para azul escuro ─────── */}
      <div className="bg-gradient-to-b from-black to-[#0c2446]">
        <ScrollReveal animation="fade-up" duration={800}>
          <ProjectGrid projects={projects} categories={categories} />
        </ScrollReveal>

        <ScrollReveal animation="fade-up" duration={800}>
          <AboutSection />
        </ScrollReveal>

        {/* White wave: transparent above (shows gradient), white fill below */}
        <AnimatedWave fill="white" height={100} startPhase={-300} />
      </div>

      {/* ── Contact + Footer — white bg for contact, blue for footer ────── */}
      <div className="bg-white">
        <ContactSection glitchEnabled={glitchEnabled} />
      </div>
    </main>
  )
}
