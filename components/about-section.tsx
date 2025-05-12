import Image from "next/image"
import { Download, Instagram, Youtube, Twitch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Category = "about" | "skillset" | "hobbies" 

export default function AboutSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("about");
  const backgroundImage =
  activeCategory === "about"
    ? "url('/images/profile/bg05.png')"
    : activeCategory === "skillset"
    ? "url('/images/profile/bg05.png')"
    : "url('/images/profile/bg05.png')"; // Optional default background



  return (
    <section
      id="about"
      className="relative w-full h-screen py-20 bg-cover bg-center transition-all duration-200 ease-in-out"
      style={{ backgroundImage,backgroundColor: "#00254a" }}


      
    >
      <div className="container mx-auto px-4">
        {/* Vertical Box */}
        <div className="w-full md:w-1/2 flex flex-col items-center space-y-8">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-5 text-center text-white">About Me</h2>

          {/* Navigation Buttons */}
          <nav className="flex space-x-8 border-b border-cyan-100/25 w-full justify-center">
            {[
              { id: "about", label: "About" },
              { id: "skillset", label: "Skillset" },
              { id: "hobbies", label: "Hobbies" },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as Category)}
                className={cn(
                  "px-4 py-2 transition-colors relative text-sm uppercase tracking-wider text-left",
                  activeCategory === category.id
                    ? "text-[#4db8ff] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#4db8ff]"
                    : "text-white hover:text-blue-500",
                )}
              >
                {category.label}
              </button>
            ))}
          </nav>


          {/* Content */}
          <div className="text-left">
            {activeCategory === "about" && (
              <p className="font-extralight font-sans text-white px-20">
                I'm a passionate game UI designer and developer with over 5 years of experience creating immersive
                interfaces for games across multiple platforms. My expertise spans UI/UX design, 3D modeling, and graphic
                design, allowing me to bring a holistic approach to game development.
              </p>
            )}

            {activeCategory === "skillset" && (
              <div className="text-lg text-white font-extralight font-sans px-20">
                
                <ul className="space-y-2">
                  <li>Unreal Engine 4 and 5</li>
                  <li>Adobe Photoshop</li>
                  <li>Figma</li>
                  <li>Blender</li>
                  <li>Maya</li>
                </ul>
              </div>
            )}

            {activeCategory === "hobbies" && (
              <div className="text-lg text-white font-extralight font-sans px-20">
                
                <p>
                  In my free time, I enjoy exploring new game mechanics, creating 3D models, and experimenting with graphic
                  design. I also love playing video games and staying updated with the latest trends in the gaming industry.
                </p>
              </div>
            )}
          </div>


        </div>
      </div>
    </section>
  );
}