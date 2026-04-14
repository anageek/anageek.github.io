'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Layers, Grid, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminNav } from '@/config/navigation'
import { logoutAction } from '@/features/auth'

const iconMap: Record<string, ReactNode> = {
  Layers: <Layers className="w-4 h-4" />,
  Grid: <Grid className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
}

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-zinc-950 border-r border-zinc-800 py-6">
        {/* Logo */}
        <div className="px-5 mb-8">
          <Link href="/admin" className="flex items-center">
            <div className="relative h-9 w-9">
              <Image
                src="/images/logo/logo-small-white.png?height=36&width=36"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-transparent'
                )}
              >
                {iconMap[item.icon]}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 mt-4">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative h-7 w-7 shrink-0">
            <Image
              src="/images/logo/logo-small-white.png?height=28&width=28"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-bold text-white">Ana Neiva <span className="text-zinc-500 font-normal">Admin</span></span>
        </Link>

        <nav className="flex items-center gap-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800'
                )}
                aria-label={item.label}
              >
                {iconMap[item.icon]}
              </Link>
            )
          })}
          <form action={logoutAction}>
            <button
              type="submit"
              className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </nav>
      </header>
    </>
  )
}
