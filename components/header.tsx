"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-black/40 py-4",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-10 mr-3">
            <Image src="/images/logo/logo-small-white.png?height=40&width=40" alt="Logo" fill className="object-contain" />
          </div>
          <div >
            <span className="font-bold text-xl">Ana Neiva</span>
            <p className="text-xs text-zinc-400 font-light">Tech UI Designer</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-12">
          <Link
            href="#projects"
            className="text-white hover:text-[#0099ff] transition-colors text-sm uppercase tracking-wider"
            onClick={scrollToSection("projects")}
          >
            Projects
          </Link>
          <Link
            href="#about"
            className="text-white hover:text-[#0099ff] transition-colors text-sm uppercase tracking-wider"
            onClick={scrollToSection("about")}
          >
            About
          </Link>
          <Link
            href="#contact"
            className="text-white hover:text-[#0099ff] transition-colors text-sm uppercase tracking-wider"
            onClick={scrollToSection("contact")}
          >
            Contact
          </Link>
        </nav>

        <div className="md:hidden">{/* Mobile menu button would go here */}</div>
      </div>
    </header>
  )
}
