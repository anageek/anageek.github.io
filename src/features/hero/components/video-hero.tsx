function ensureCleanEmbed(src: string): string {
  try {
    const url = new URL(src)
    // Force YouTube params to hide all UI chrome
    url.searchParams.set('autoplay', '1')
    url.searchParams.set('mute', '1')
    url.searchParams.set('controls', '0')
    url.searchParams.set('showinfo', '0')
    url.searchParams.set('modestbranding', '1')
    url.searchParams.set('rel', '0')
    url.searchParams.set('iv_load_policy', '3') // hide annotations
    url.searchParams.set('disablekb', '1')
    url.searchParams.set('fs', '0') // hide fullscreen button
    url.searchParams.set('playsinline', '1')
    // Ensure loop works
    if (!url.searchParams.has('loop')) {
      url.searchParams.set('loop', '1')
    }
    if (!url.searchParams.has('playlist')) {
      // YouTube loop requires playlist param with same video ID
      const videoId = url.pathname.split('/').pop()
      if (videoId) url.searchParams.set('playlist', videoId)
    }
    return url.toString()
  } catch {
    return src
  }
}

export function VideoHero({ src }: { src?: string }) {
  if (!src) return <div className="w-screen h-screen bg-black" />

  const cleanSrc = ensureCleanEmbed(src)

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Scale up the iframe to crop YouTube's bottom bar */}
      <iframe
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[110vh] pointer-events-none"
        src={cleanSrc}
        title="Demo Reel"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
        suppressHydrationWarning
      />
      {/* Overlay blocks any mouse interaction with the iframe */}
      <div className="absolute inset-0 z-10" />
    </div>
  )
}
