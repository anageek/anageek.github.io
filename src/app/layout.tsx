import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Toaster } from 'sonner'
import { siteConfig } from '@/config/site'
import { getSiteConfigValue } from '@/features/site-config'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/logo/logo-small-white.png',
    apple: '/images/logo/logo-small-white.png',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteFont = await getSiteConfigValue('siteFont')
  const googleFontsUrl = siteFont
    ? `https://fonts.googleapis.com/css2?family=${encodeURIComponent(siteFont)}:wght@300;400;500;600;700;800&display=swap`
    : null

  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning style={{ backgroundColor: '#09090b' }}>
      <head>
        {googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontsUrl} />
          </>
        )}
        {siteFont && (
          <style
            dangerouslySetInnerHTML={{
              __html: `:root { --system-font: '${siteFont}', system-ui, sans-serif; }`,
            }}
          />
        )}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
