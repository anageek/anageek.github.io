import { Instagram, Youtube, Twitch, Linkedin, Mail } from 'lucide-react'
import { siteConfig } from '@/config/site'

const socialLinks = [
  { href: siteConfig.social.linkedin, icon: Linkedin, label: 'LinkedIn' },
  { href: siteConfig.social.instagram, icon: Instagram, label: 'Instagram' },
  { href: siteConfig.social.youtube, icon: Youtube, label: 'YouTube' },
  { href: siteConfig.social.twitch, icon: Twitch, label: 'Twitch' },
]

export function ContactSection() {
  return (
    <section id="contact" className="relative bg-black w-full">
      {/* Contact content */}
      <div className="py-24 border-t border-zinc-900">
        <div className="container mx-auto px-4">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 text-center mb-12">
            Contact
          </p>

          {/* Email */}
          <div className="flex justify-center mb-10">
            <a
              href={`mailto:${siteConfig.email}`}
              className="group inline-flex items-center gap-4 px-6 py-3 rounded-xl border border-zinc-800 hover:border-primary/50 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300"
            >
              <div className="p-2.5 rounded-lg bg-zinc-800 group-hover:bg-primary/20 transition-colors">
                <Mail className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">
                {siteConfig.email}
              </span>
            </a>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <p className="text-xs text-zinc-600 tracking-wider">
            Thank you for viewing my portfolio
          </p>
          <p className="text-xs text-zinc-700">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  )
}
