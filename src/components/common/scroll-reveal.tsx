'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Animation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade' | 'scale-up' | 'blur-in'

interface ScrollRevealProps {
  children: ReactNode
  animation?: Animation
  delay?: number        // ms
  duration?: number     // ms
  threshold?: number    // 0 to 1
  once?: boolean        // animate only once
  className?: string
}

const animations: Record<Animation, { hidden: string; visible: string }> = {
  'fade-up': {
    hidden: 'opacity-0 translate-y-12',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-down': {
    hidden: 'opacity-0 -translate-y-12',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-left': {
    hidden: 'opacity-0 translate-x-12',
    visible: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    hidden: 'opacity-0 -translate-x-12',
    visible: 'opacity-100 translate-x-0',
  },
  'fade': {
    hidden: 'opacity-0',
    visible: 'opacity-100',
  },
  'scale-up': {
    hidden: 'opacity-0 scale-95',
    visible: 'opacity-100 scale-100',
  },
  'blur-in': {
    hidden: 'opacity-0 blur-sm',
    visible: 'opacity-100 blur-0',
  },
}

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  once = true,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  const anim = animations[animation]

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all ease-out',
        isVisible ? anim.visible : anim.hidden,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Wrapper that staggers children animations.
 * Each direct child gets an incremental delay.
 */
interface StaggerRevealProps {
  children: ReactNode
  animation?: Animation
  staggerDelay?: number  // ms between each child
  duration?: number
  className?: string
}

export function StaggerReveal({
  children,
  animation = 'fade-up',
  staggerDelay = 100,
  duration = 600,
  className,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const anim = animations[animation]

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              className={cn(
                'transition-all ease-out',
                isVisible ? anim.visible : anim.hidden
              )}
              style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${i * staggerDelay}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  )
}
