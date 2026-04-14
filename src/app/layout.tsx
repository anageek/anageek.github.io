import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { siteConfig } from '@/config/site'
import './globals.css'

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.title}`,
  description: siteConfig.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
