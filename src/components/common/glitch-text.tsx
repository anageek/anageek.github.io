'use client'

import { useRef, useEffect } from 'react'

const GLITCH_CHARS = '.,·-─~+:;=*π┐┌┘╬║░▒▓█▄▀!?&#$@0123456789'
const WAVE_THRESH = 3
const WAVE_BUF = 5
const CHAR_MULT = 3
const ANIM_STEP = 50
const WAVE_DURATION = 1200

interface GlitchTextProps {
  children: string
  className?: string
  /** If false, renders plain text with no animation */
  enabled?: boolean
  /** ms between auto-spawned waves (default 4000) */
  interval?: number
}

export function GlitchText({
  children,
  className,
  enabled = true,
  interval = 4000,
}: GlitchTextProps) {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!enabled) return
    const text = children
    const maxDist = text.length

    const waves: { origin: number; startTime: number }[] = []
    let rafId: number
    let timerId: ReturnType<typeof setInterval>
    let alive = true

    const spawnWave = () => {
      waves.push({
        origin: Math.floor(Math.random() * text.length),
        startTime: performance.now(),
      })
    }

    const tick = () => {
      if (!alive || !spanRef.current) return
      const now = performance.now()

      for (let i = waves.length - 1; i >= 0; i--) {
        if (now - waves[i].startTime > WAVE_DURATION) waves.splice(i, 1)
      }

      if (waves.length > 0) {
        const chars = text.split('')
        for (const wave of waves) {
          const age = now - wave.startTime
          const rad = (age / WAVE_DURATION) * (maxDist + WAVE_BUF)
          for (let i = 0; i < chars.length; i++) {
            if (chars[i] === ' ') continue
            const dist = Math.abs(i - wave.origin)
            const intens = Math.abs(dist - rad)
            if (intens <= WAVE_THRESH && intens > 0) {
              const idx = (dist * CHAR_MULT + Math.floor(age / ANIM_STEP)) % GLITCH_CHARS.length
              chars[i] = GLITCH_CHARS[idx]
            }
          }
        }
        spanRef.current.textContent = chars.join('')
      } else {
        spanRef.current.textContent = text
      }

      rafId = requestAnimationFrame(tick)
    }

    spawnWave()
    rafId = requestAnimationFrame(tick)
    timerId = setInterval(spawnWave, interval)

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      clearInterval(timerId)
      if (spanRef.current) spanRef.current.textContent = text
    }
  }, [children, enabled, interval])

  return (
    <span ref={spanRef} className={className}>
      {children}
    </span>
  )
}
