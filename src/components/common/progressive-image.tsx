'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAFklEQVQoU2NkYGD4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg=='

function isGif(src: ImageProps['src']): boolean {
  if (typeof src !== 'string') return false
  return src.toLowerCase().split('?')[0].endsWith('.gif')
}

const Spinner = () => (
  <svg className="w-4 h-4 text-zinc-700 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)

type ProgressiveImageProps = Omit<ImageProps, 'placeholder' | 'blurDataURL'> & {
  wrapperClassName?: string
}

export function ProgressiveImage({ className, wrapperClassName, fill, ...props }: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false)
  const gif = isGif(props.src)

  // ── GIF: serve as-is, no optimization (preserves animation)
  if (gif) {
    if (fill) {
      return <Image {...props} fill unoptimized className={className} />
    }
    return (
      <div className={cn('relative', wrapperClassName)}>
        <Image {...props} unoptimized className={className} />
      </div>
    )
  }

  // ── fill image: DON'T add a wrapper — let the outer container handle positioning.
  // The shimmer and Image are rendered as siblings inside the parent.
  if (fill) {
    return (
      <>
        {!loaded && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center z-[1]">
            <Spinner />
          </div>
        )}
        <Image
          {...props}
          fill
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onLoad={() => setLoaded(true)}
          className={cn(
            'transition-opacity duration-500 z-[2]',
            loaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
        />
      </>
    )
  }

  // ── regular image: wrapper provides relative context for the shimmer
  return (
    <div className={cn('relative', wrapperClassName)}>
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <Image
        {...props}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        onLoad={() => setLoaded(true)}
        className={cn(
          'transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </div>
  )
}
