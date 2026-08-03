import { Instagram, Youtube, Twitch, Linkedin, Mail } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { GlitchText } from '@/components/common/glitch-text'
import { AnimatedWave } from './animated-wave'

interface ContactSectionProps {
  glitchEnabled?: boolean
}

export function ContactSection({ glitchEnabled = false }: ContactSectionProps) {
  return (
    <>
      {/* ── Contact — white background ──────────────────────────────────── */}
      <section id="contact" className="pt-8 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-2xl font-semibold tracking-tight mb-3 text-zinc-800">
              <GlitchText enabled={glitchEnabled}>Contact</GlitchText>
            </h2>
            <div className="h-1 w-16 bg-zinc-900 rounded-full" />
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center">
              <div className="inline-flex items-center mb-8 bg-zinc-900 rounded-full">
                <div className="p-3 border rounded-full border-white/10 mr-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl mr-4 font-semibold text-white">
                  {siteConfig.email}
                </h3>
              </div>
            </div>

            <div className="flex justify-center space-x-8">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">Linkedin</span>
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </a>
              <a
                href={siteConfig.social.twitch}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <Twitch className="h-6 w-6" />
                <span className="sr-only">Twitch</span>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="inline-block rounded-full border border-zinc-200 px-16 py-4 text-zinc-600 bg-zinc-50">
            Thank you for viewing my portfolio!
          </p>
        </div>
      </section>

      {/* ── Footer — blue wave → blue background ────────────────────────── */}
      <footer>
        <AnimatedWave fill="#0c2446" height={80} />
        <div className="bg-[#0c2446] -mt-px py-6 text-center">
          <p className="text-zinc-400 text-sm font-normal">
            © {new Date().getFullYear()} by Ana Neiva. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
