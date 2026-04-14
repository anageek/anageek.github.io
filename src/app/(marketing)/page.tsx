import { getFeaturedProjects, getPublicProjects } from '@/features/projects'
import { getPublicCategories } from '@/features/categories'
import { getSiteConfigValue } from '@/features/site-config'
import { VideoHero } from '@/features/hero'
import { ProjectGrid, FeaturedProjectsSection } from '@/features/projects'
import { AboutSection } from '@/features/about'
import { ContactSection } from '@/features/contact'
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
      <section id="hero" className="min-h-screen relative flex flex-col items-center justify-between">
        <div className="text-center gradient-bg w-full flex-1 flex items-end justify-center">
          <div className="w-full flex flex-col items-center mb-5">
            <Link
              href="#projects"
              className="cursor-pointer z-50 px-6 py-3 border border-[#0099ff] bg-[#0099ff] text-white rounded-md hover:bg-[#0099ff] hover:bg-opacity-10 transition-colors inline-flex items-center justify-center"
            >
              View Projects
            </Link>
            <div className="items-center justify-center flex flex-col mt-4">
              <span className="animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#0099ff]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <VideoHero src={heroVideoUrl || defaultVideo} />
      </section>

      {featured.length > 0 && <FeaturedProjectsSection projects={featured} />}

      <ProjectGrid projects={projects} categories={categories} />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
