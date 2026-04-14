import { Instagram, Youtube, Twitch, Linkedin } from 'lucide-react'
import { Mail } from 'lucide-react'
import { siteConfig } from '@/config/site'

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative bg-cover bg-center  w-full pt-40"
      style={{
        background: "url('/images/profile/bg06.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: '#0a0a0a',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-3 text-zinc-800">Contact</h2>
          <div className="h-1 w-16 bg-primary rounded-full" />
        </div>

        <div className="max-w-2xl mx-auto ">
          <div className="flex justify-center">
            <div className="inline-flex items-center mb-8 bg-primary rounded-full">
              <div className="p-3 border rounded-full border-white/20 mr-4">
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
              className="text-zinc-700 hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">Linkedin</span>
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 hover:text-primary transition-colors"
            >
              <Youtube className="h-6 w-6" />
              <span className="sr-only">YouTube</span>
            </a>
            <a
              href={siteConfig.social.twitch}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 hover:text-primary transition-colors"
            >
              <Twitch className="h-6 w-6" />
              <span className="sr-only">Twitch</span>
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="inline-block rounded-full border mr-15 border-zinc-500 px-16 py-4 text-white bg-zinc-900/60">
          Thank you for viewing my portfolio!
        </p>
      </div>
      <footer className="py-6 text-center text-zinc-500 font-normal">
        <p>© {new Date().getFullYear()} by Ana Neiva. All rights reserved.</p>
      </footer>
    </section>
  )
}
