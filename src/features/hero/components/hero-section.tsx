'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ScrollReveal } from '@/components/common/scroll-reveal'
import { GlitchText } from '@/components/common/glitch-text'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady?: () => void
  }
}

function extractVideoId(url: string): string {
  return url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([\w-]+)/)?.[1] ?? ''
}

interface HeroSectionProps {
  videoUrl: string
  glitchEnabled?: boolean
}

export function HeroSection({ videoUrl, glitchEnabled = false }: HeroSectionProps) {
  const [minimized, setMinimized] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const firstLoopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const canAutoMinimizeRef = useRef(true)
  const destroyedRef = useRef(false)

  const maximize = () => {
    setMinimized(false)
    setBlinking(false)
    canAutoMinimizeRef.current = false
  }

  const toggleMinimize = () => {
    setMinimized((v) => {
      if (v) canAutoMinimizeRef.current = false // manual maximize → lock
      return !v
    })
    setBlinking(false)
  }

  // Auto-minimize after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      if (canAutoMinimizeRef.current && !destroyedRef.current) {
        setMinimized(true)
        setBlinking(true)
        const blink = setTimeout(() => setBlinking(false), 1500)
        return () => clearTimeout(blink)
      }
    }, 2000)
    return () => clearTimeout(t)
  }, [])

  // YouTube iframe API — visible background + first-loop detection
  useEffect(() => {
    const videoId = extractVideoId(videoUrl)
    if (!videoId || !wrapperRef.current) return
    destroyedRef.current = false

    // Container created imperatively so React never reconciles it
    const container = document.createElement('div')
    wrapperRef.current.appendChild(container)

    const initPlayer = () => {
      if (destroyedRef.current || !window.YT?.Player) return
      playerRef.current = new window.YT.Player(container, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          rel: 0,
          loop: 1,
          playlist: videoId,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady(e: any) {
            // Cover-the-viewport CSS for the iframe
            const iframe = e.target.getIframe() as HTMLIFrameElement
            iframe.style.cssText =
              'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);' +
              'width:max(100vw,177.78vh);height:max(100vh,56.25vw);' +
              'pointer-events:none;border:none;'

            // Detect first loop via duration
            const tryDuration = () => {
              const dur = e.target.getDuration()
              if (dur > 0) {
                firstLoopTimerRef.current = setTimeout(() => {
                  if (!destroyedRef.current) maximize()
                }, Math.max((dur - 1) * 1000, 5000))
              } else {
                setTimeout(tryDuration, 800)
              }
            }
            tryDuration()
          },
        },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        initPlayer()
      }
      if (!document.getElementById('yt-iframe-api')) {
        const s = document.createElement('script')
        s.id = 'yt-iframe-api'
        s.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(s)
      }
    }

    return () => {
      destroyedRef.current = true
      if (firstLoopTimerRef.current) clearTimeout(firstLoopTimerRef.current)
      try { playerRef.current?.destroy() } catch { /* */ }
      playerRef.current = null
      container.remove()
    }
  }, [videoUrl])

  return (
    <section id="hero" className="h-screen relative flex items-center justify-center overflow-hidden bg-black">
      {/* YouTube player fills this div (managed imperatively, outside React reconciliation) */}
      <div ref={wrapperRef} className="absolute inset-0 overflow-hidden bg-black" />

      {/* Readability overlay — fades out when minimized */}
      <div
        className={cn(
          'absolute inset-0 z-[2] transition-opacity duration-700 bg-black/55 pointer-events-none',
          minimized && 'opacity-0',
        )}
      />
      {/* Subtle vignette — stays faint even when minimized */}
      <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Hero content */}
      <div className="relative z-[20] flex flex-col items-center text-center px-4">
        <div
          className={cn(
            'transition-all duration-700',
            minimized ? 'opacity-0 pointer-events-none -translate-y-3' : 'opacity-100 translate-y-0',
          )}
        >
          <ScrollReveal animation="fade-down" duration={800} threshold={0}>
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-base font-semibold tracking-tight mb-2 text-zinc-300">Portfolio</h2>
              <div className="h-0.5 w-10 bg-primary rounded-full" />
            </div>
          </ScrollReveal>
          <ScrollReveal animation="blur-in" duration={1000} delay={200} threshold={0}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 text-white drop-shadow-lg">
              <GlitchText enabled={glitchEnabled} interval={5000}>{siteConfig.name}</GlitchText>
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={800} delay={400} threshold={0}>
            <p className="text-sm md:text-base text-zinc-300 mb-5 drop-shadow-md">
              {siteConfig.title}
            </p>
          </ScrollReveal>
        </div>

        {/* Minimize / maximize toggle */}
        <button
          onClick={toggleMinimize}
          className={cn(
            'flex items-center gap-1 text-[10px] transition-all',
            'bg-black/40 px-3 py-1.5 rounded-full border border-zinc-800/70 backdrop-blur-sm',
            blinking
              ? 'animate-bounce text-primary border-primary/50'
              : 'text-zinc-400 hover:text-zinc-200 hover:border-zinc-600',
          )}
        >
          {minimized ? (
            <><ChevronDown className="w-3 h-3" /> Show</>
          ) : (
            <><ChevronUp className="w-3 h-3" /> Minimize</>
          )}
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[20]">
        <span className="animate-bounce block">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </section>
  )
}
