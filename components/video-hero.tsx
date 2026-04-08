export default function VideoHero({ src }: { src?: string }) {
  if (!src) return <div className="w-screen h-screen bg-black" />;

  return (
    <iframe 
    className="w-screen h-screen" 
    src={src} 
    title="YouTube video player" 
    frameBorder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerPolicy="strict-origin-when-cross-origin" 
    allowFullScreen
    suppressHydrationWarning>
    </iframe>
  )
}
