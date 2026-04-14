'use client'

import { useRef, useEffect, useState } from 'react'
import { VideoHero } from './video-hero'

interface ScrollScaleVideoProps {
  src: string
}

export function ScrollScaleVideo({ src }: ScrollScaleVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.45)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate how far the element is through the viewport
      // 0 = just entering from bottom, 1 = fully past top
      const progress = 1 - rect.top / windowHeight

      // Clamp between 0 and 1
      const clamped = Math.min(Math.max(progress, 0), 1)

      // Scale from 0.45 to 1.15 — very dramatic expansion
      const newScale = 0.45 + clamped * 0.7

      setScale(newScale)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4">
      <p className="text-sm uppercase tracking-[0.3em] text-primary text-center mb-8">
        Demo Reel
      </p>
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50 transition-transform duration-100 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <VideoHero src={src} />
      </div>
    </div>
  )
}
