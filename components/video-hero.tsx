export default function VideoHero() {
  return (
    <iframe 
    className="w-screen h-screen"  
    src="https://www.youtube.com/embed/EwmypPEZRCk?autoplay=1&mute=1" 
    title="YouTube video player" 
    frameBorder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerPolicy="strict-origin-when-cross-origin" 
    allowFullScreen>

    </iframe>


    // <div className="absolute inset-0 w-full h-full overflow-hidden">
    //   <div className="absolute inset-0 bg-black/50 z-10" />

    //   {/*<img autoPlay muted loop playsInline className="w-full h-full object-cover">
    //     <source src="/videos/placetableGIF.gif" type="gif" />
    //     Your browser does not support the video tag.
    //   </img> */}

    // </div>
  )
}
