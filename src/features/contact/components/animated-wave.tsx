'use client'

import { useRef, useEffect } from 'react'

interface AnimatedWaveProps {
  fill?: string
  height?: number
}

export function AnimatedWave({ fill = 'white', height = 100 }: AnimatedWaveProps) {
  const path1Ref = useRef<SVGPathElement>(null)
  const path2Ref = useRef<SVGPathElement>(null)
  const phaseRef = useRef(0)
  const rafRef = useRef<number | undefined>(undefined)

  function buildPath(phase: number, amp: number, yMid: number): string {
    const W = 1440
    const H = height
    const N = 160
    let d = `M 0 ${H} L 0 ${yMid}`
    for (let i = 0; i <= N; i++) {
      const xNorm = i / N
      const x = xNorm * W
      const y = yMid - amp * Math.sin(xNorm * Math.PI * 1.6 + phase)
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
    }
    d += ` L ${W} ${H} Z`
    return d
  }

  useEffect(() => {
    let alive = true
    const tick = () => {
      if (!alive) return
      phaseRef.current += 0.012
      const phase = phaseRef.current
      if (path1Ref.current)
        path1Ref.current.setAttribute('d', buildPath(phase, 22, height * 0.58))
      if (path2Ref.current)
        path2Ref.current.setAttribute('d', buildPath(phase + 1.8, 12, height * 0.72))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      alive = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [height])

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <svg
        viewBox={`0 0 1440 ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path ref={path2Ref} fill={fill} opacity="0.28" d="" />
        <path
          ref={path1Ref}
          fill={fill}
          style={{ filter: 'drop-shadow(0 -3px 5px rgba(0,0,0,0.14))' }}
          d=""
        />
      </svg>
    </div>
  )
}
