import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Category = "hello" | "workstuff" | "sidequests" | "dream"

const tabOptions = [
  { id: "hello", label: "Hello!", color: "#602bfc" },
  { id: "workstuff", label: "Work Stuff", color: "#fde047" },
  { id: "sidequests", label: "Side Quests", color: "#147eff" },
  { id: "dream", label: "Dream Collab", color: "#08ff62" },
];

const workTools = [
  { name: "Unreal Engine 4 and 5", level: 95 },
  { name: "Adobe Photoshop", level: 90 },
  { name: "Figma", level: 85 },
  { name: "Blender", level: 70 },
];

export default function AboutSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("hello");
  const [animateBars, setAnimateBars] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, color: "#602bfc" });
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(timeout);
  }, [activeCategory]);

  useLayoutEffect(() => {
    const idx = tabOptions.findIndex(tab => tab.id === activeCategory);
    const node = tabRefs.current[idx];
    if (node) {
      const rect = node.getBoundingClientRect();
      const parentRect = node.parentElement!.getBoundingClientRect();
      setSliderStyle({
        left: rect.left - parentRect.left,
        width: rect.width,
        color: tabOptions[idx].color,
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    tabRefs.current = Array(tabOptions.length).fill(null);
  }, []);

  useEffect(() => {
    if (activeCategory !== "workstuff") {
      setAnimateBars(false);
    }
  }, [activeCategory]);

  return (
    <section
      id="about"
      className="relative w-full pt-20 bg-cover bg-center transition-all duration-200 ease-in-out"
      style={{ backgroundColor: "#00254a" }}
    >
      <div className="container mx-auto px-4">
        <div className="w-full items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5 text-center text-white">About Me</h2>

          {/* Responsive: stack vertically on mobile, side-by-side on desktop */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 pt-10">
            <div className="w-full">
              {/* Navigation Menu */}
              <div className="relative flex justify-center pb-5">
                <nav
                  className={cn(
                    "relative w-full justify-center overflow-hidden border-b border-cyan-100/25",
                    "flex flex-col gap-2 md:flex-row md:gap-0"
                  )}
                >
                  {/* Sliding background - only show on desktop */}
                  <div
                    className="absolute top-0 left-0 h-full z-0 transition-all duration-300 hidden md:block"
                    style={{
                      left: sliderStyle.left,
                      width: sliderStyle.width,
                      borderBottom: `4px solid ${sliderStyle.color}`,
                      transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                    }}
                  />
                  {tabOptions.map((category, idx) => (
                    <button
                      key={category.id}
                      ref={el => { tabRefs.current[idx] = el; }}
                      onClick={() => {
                        setActiveCategory(category.id as Category);
                        if (category.id === "workstuff") {
                          setAnimateBars(false);
                          setTimeout(() => setAnimateBars(true), 100);
                        }
                      }}
                      className={cn(
                        "relative z-10 px-8 py-2 transition-colors text-sm uppercase tracking-wider text-center font-regular text-md font-sans text-white",
                        "w-full md:w-auto",
                        activeCategory === category.id
                          ? "font-semibold"
                          : "opacity-80 hover:opacity-100"
                      )}
                      style={{
                        color: activeCategory === category.id ? "#fff" : "#e0e7ef",
                        transition: "color 0.3s",
                        // Mobile: left border and background color for active tab
                        borderLeft: activeCategory === category.id && window.innerWidth < 768 ? `4px solid ${tabOptions[idx].color}` : "4px solid transparent",
                        background: activeCategory === category.id && window.innerWidth < 768 ? `${tabOptions[idx].color}22` : "transparent", // subtle bg
                        // Desktop: bottom border for active tab
                        borderBottom: activeCategory === category.id && window.innerWidth >= 768 ? `4px solid ${tabOptions[idx].color}` : "4px solid transparent",
                      }}
                    >
                      {category.label}
                    </button>
                  ))}
                </nav>
              </div>
              {/* Content */}
              <div className="w-full text-lg text-justify">
                {activeCategory === "hello" && (
                  <div className={`font-light font-sans text-blue-100 px-10 ${fadeIn ? "fade-in" : ""}`}>
                    <div>
                      <p className="pb-5">
                        Hi! I'm Ana, a Brazilian UI/UX designer with a background in Unreal development and over five years of experience creating engaging, user-centered experiences for PC, mobile, and VR.
                        <br /><br />
                        I began my career as a graphic designer and later moved into Unreal development, which helped me develop a strong foundation in logic and technical thinking. But it was UI/UX that truly brought together my passion for problem-solving and visual design. Since then, I've worked on a range of interactive projects, focusing on interfaces that are both functional and visually appealing.
                      </p>
                    </div>
                  </div>
                )}

                {activeCategory === "workstuff" && (
                  <div className={`font-light font-sans text-blue-100 px-10 ${fadeIn ? "fade-in" : ""}`}>
                    <div className="w-full font-sans text-blue-100">
                      <div className="bg-slate-900/40 px-10 py-2 grid grid-cols-2 gap-5 mb-2 font-semibold text-base text-blue-100 w-full rounded-sm uppercase">
                        <div>Tool</div>
                        <div>Level</div>
                      </div>
                      {workTools.map((tool, idx) => {
                        let levelLabel = "";
                        if (tool.level >= 90) levelLabel = "Advanced";
                        else if (tool.level >= 75) levelLabel = "Proficient";
                        else levelLabel = "Intermediate";

                        return (
                          <div key={tool.name} className="px-10 grid grid-cols-2 items-center gap-5 mb-4 w-full">
                            <div>{tool.name}</div>
                            <div className="w-full flex items-center">
                              <div className="w-full bg-blue-900/40 rounded h-3 overflow-hidden">
                                <div
                                  className="bg-blue-400 h-3 rounded transition-all duration-1000"
                                  style={{
                                    width: animateBars ? `${tool.level}%` : "0%",
                                  }}
                                ></div>
                              </div>
                              <span className="ml-4 text-sm text-blue-200 font-semibold whitespace-nowrap">
                                {levelLabel}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-l-2 border-blue-100/25 pl-5 ml-10 mt-10">
                      <p className="font-sans font-semibold pb-4 uppercase">Leveling Up </p>
                      <ul className="list-disc list-inside">
                        <li>UI Materials - Learning to create stylized and reusable UI elements using materials</li>
                        <li>UX Research - Improving to make more informed design decisions.</li>
                        <li>Rive Animation - Exploring with this new tool</li>
                      </ul>
                    </div>

                    <div className="flex justify-center mt-5">
                      <Link href="https://docs.google.com/document/d/1pfsjhUDq0WJ0484mZKJoVkk8qn7vb_0lwefoMUKdkIU/edit?usp=sharing" target="_blank" download>
                        <Button variant="outline" className="bg-blue-400 text-slate-900 hover:bg-blue-500">
                          <Download className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {activeCategory === "sidequests" && (
                  <div className={`font-light font-sans text-blue-100 px-10 ${fadeIn ? "fade-in" : ""}`}>
                    <p className="pb-4">When I'm not designing, I'm probably:</p>
                    <ul className="space-y-2 pb-4">
                      <li>🕵️‍♀️ Binge-watching <b className="font-semibold">crime shows</b>, especially detective stories and investigation dramas. I've probably seen every one available, seriously.</li>
                      <li>🐾 Taking care of stray <b className="font-semibold">dogs</b> and <b className="font-semibold">cats</b>. I've adopted a few, and they're a big part of my life.</li>
                      <li>🧠 Trying to learn new languages like: <b className="font-semibold">Japanese</b>, <b className="font-semibold">Swedish</b>, <b className="font-semibold">Polish</b>, <b className="font-semibold">Finnish</b>. I've been dabbling in all of them for a few years.</li>
                      <li>🎮 Playing <b className="font-semibold">co-op games</b>. I wish there were more out there.</li>
                      <li>📺 …and yes, watching <b className="font-semibold">reality TV</b>. Not proud. Not ashamed either.</li>
                    </ul>
                    <p>I'm a very competitive player and I've sunk thousands of hours into <b className="font-semibold">League of Legends</b> since 2015, <b className="font-semibold">PUBG</b> since 2016, and <b className="font-semibold">Clash Royale</b> since 2017.</p>
                  </div>
                )}

                {activeCategory === "dream" && (
                  <div className={`font-light font-sans text-blue-100 px-10 ${fadeIn ? "fade-in" : ""}`}>
                    <p>
                      I'd love to work on stylized or cartoon-inspired games that put creativity and charm at the heart of the experience. I'm especially drawn to technically challenging projects where the UI is not just functional but also fun and meaningful.
                      <br /><br />
                      I'm looking to join a team that values UI and UX design as a collaborative effort. I enjoy being in environments where people are open to giving and receiving feedback, and where there's a real desire to teach, learn, and grow together.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full md:col-span-1 flex justify-start items-start">
              <Image
                src="/images/profile/AboutMe2.png"
                alt="Ana's Profile Picture"
                width={500}
                height={500}
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}