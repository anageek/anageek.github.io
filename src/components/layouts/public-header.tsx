'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { publicNav } from '@/config/navigation'
import { siteConfig } from '@/config/site'

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/70 backdrop-blur-md py-2'
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-3">
              <Image
                src="/images/logo/logo-small-white.png?height=40&width=40"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-xl">{siteConfig.name}</span>
              <p className="text-xs text-zinc-400 font-light">{siteConfig.title}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-12">
            {publicNav.map((item) => {
              const sectionId = item.href.replace('#', '')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-[#0099ff] transition-colors text-sm uppercase tracking-wider"
                  onClick={scrollToSection(sectionId)}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="md:hidden">
            <button
              aria-label="Open menu"
              className="text-white focus:outline-none"
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay OUTSIDE the header */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/60 transition-opacity"
            onClick={() => setShowMobileMenu(false)}
          />
          {/* Side menu */}
          <div
            className="fixed top-0 right-0 z-[110] h-full w-64 bg-zinc-900 shadow-lg flex flex-col p-8 space-y-8 transition-transform duration-300"
            style={{ transform: showMobileMenu ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <button
              aria-label="Close menu"
              className="absolute top-6 right-6 text-white"
              onClick={() => setShowMobileMenu(false)}
            >
              <X className="w-7 h-7" />
            </button>
            {publicNav.map((item) => {
              const sectionId = item.href.replace('#', '')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white text-xl uppercase tracking-wider"
                  onClick={(e) => {
                    scrollToSection(sectionId)(e)
                    setShowMobileMenu(false)
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}
