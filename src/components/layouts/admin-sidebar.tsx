'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Layers, Grid, Settings, LogOut, PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminNav } from '@/config/navigation'
import { logoutAction } from '@/features/auth'

const iconMap: Record<string, ReactNode> = {
  Layers: <Layers className="w-4 h-4" />,
  Grid: <Grid className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
}

const STORAGE_KEY = 'admin-sidebar-collapsed'

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'true') setCollapsed(true)
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem(STORAGE_KEY, String(!prev))
      return !prev
    })
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col shrink-0 min-h-screen bg-zinc-950 border-r border-zinc-800 py-6 transition-[width] duration-200 ease-in-out overflow-hidden',
          // Only apply the final width after mount to avoid flicker
          mounted ? (collapsed ? 'w-16' : 'w-60') : 'w-60',
        )}
      >
        {/* Logo + toggle */}
        <div className={cn('mb-8 flex items-center', collapsed ? 'px-4 justify-center' : 'px-5 justify-between')}>
          <Link href="/admin" className="flex items-center shrink-0">
            <div className="relative h-9 w-9">
              <Image
                src="/images/logo/logo-small-white.png?height=36&width=36"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={toggle}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn('flex-1 space-y-1', collapsed ? 'px-2' : 'px-3')}>
          {adminNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center rounded-xl text-sm font-medium transition-all border',
                  collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                  isActive
                    ? 'bg-primary/20 text-primary border-primary/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border-transparent',
                )}
              >
                {iconMap[item.icon]}
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Expand button (only shown when collapsed) */}
        {collapsed && (
          <div className="px-2 mb-2">
            <button
              type="button"
              onClick={toggle}
              className="w-full flex items-center justify-center p-2.5 rounded-xl text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors border border-transparent"
              title="Expand sidebar"
            >
              <PanelLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* Logout */}
        <div className={cn(collapsed ? 'px-2' : 'px-3')}>
          <form action={logoutAction}>
            <button
              type="submit"
              title={collapsed ? 'Logout' : undefined}
              className={cn(
                'flex items-center w-full rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all',
                collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
              )}
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && 'Logout'}
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
          <span className="text-sm font-bold text-white">
            Ana Neiva <span className="text-zinc-500 font-normal">Admin</span>
          </span>
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
                  isActive ? 'bg-primary/20 text-primary' : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800',
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
