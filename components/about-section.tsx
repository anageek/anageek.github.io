import Image from "next/image"
import { Download, Instagram, Youtube, Twitch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">About Me</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 overflow-hidden rounded-full border-2 border-[#0099ff]">
              <Image src="/placeholder.svg?height=256&width=256" alt="Profile" fill className="object-cover" />
            </div>
          </div>

          <div>
            <p className="text-lg mb-6">
              I'm a passionate game UI designer and developer with over 5 years of experience creating immersive
              interfaces for games across multiple platforms. My expertise spans UI/UX design, 3D modeling, and graphic
              design, allowing me to bring a holistic approach to game development.
            </p>

            <Button
              className="mb-8 bg-transparent border border-[#0099ff] text-[#0099ff] hover:bg-[#0099ff] hover:bg-opacity-10 hover:text-white transition-colors rounded-md"
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>

            <div className="flex space-x-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#0099ff] transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#0099ff] transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#0099ff] transition-colors"
              >
                <Twitch className="h-5 w-5" />
                <span className="sr-only">Twitch</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-[#0099ff]">Skills</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Design</h4>
                <ul className="space-y-2 text-zinc-300">
                  <li>UI/UX Design</li>
                  <li>Graphic Design</li>
                  <li>Motion Graphics</li>
                  <li>Illustration</li>
                  <li>Typography</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Technical</h4>
                <ul className="space-y-2 text-zinc-300">
                  <li>3D Modeling</li>
                  <li>Texturing</li>
                  <li>Animation</li>
                  <li>Unity/Unreal</li>
                  <li>HTML/CSS/JS</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-[#0099ff]">Experience</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold">Senior UI Designer</h4>
                <p className="text-[#0099ff]">Game Studio X • 2020 - Present</p>
                <p className="text-zinc-300">Lead UI/UX design for multiple AAA game titles</p>
              </div>
              <div>
                <h4 className="font-semibold">UI/UX Designer</h4>
                <p className="text-[#0099ff]">Mobile Games Inc • 2018 - 2020</p>
                <p className="text-zinc-300">Designed interfaces for top-grossing mobile games</p>
              </div>
              <div>
                <h4 className="font-semibold">Graphic Designer</h4>
                <p className="text-[#0099ff]">Creative Agency Y • 2016 - 2018</p>
                <p className="text-zinc-300">Created marketing materials for game launches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
