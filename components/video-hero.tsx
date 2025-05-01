export default function VideoHero() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <video autoPlay muted loop playsInline className="w-full h-full object-cover">
        <source src="/videos/placetableGIF.gif" type="gif" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
