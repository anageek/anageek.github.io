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

    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const progress = 1 - rect.top / windowHeight
        const clamped = Math.min(Math.max(progress, 0), 1)
        const newScale = 0.45 + clamped * 0.7
        setScale(newScale)
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-3">Demo Reel</h2>
        <div className="h-1 w-16 bg-primary rounded-full" />
      </div>
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50 transition-transform duration-100 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <VideoHero src={src} />
      </div>
    </div>
  )
}
