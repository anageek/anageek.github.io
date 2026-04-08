"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Gamepad2, 
  Palette, 
  Boxes, 
  LogOut,
  User,
  ExternalLink,
  ChevronRight,
  Settings as SettingsIcon
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const resp = await fetch("/api/admin/categories")
      const data = await resp.json()
      if (Array.isArray(data)) setCategories(data)
    } catch (err) {
      console.error("Failed to fetch categories")
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2': return <Gamepad2 />
      case 'Palette': return <Palette />
      case 'Boxes': return <Boxes />
      default: return <Palette />
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-300 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-900/20 backdrop-blur-3xl p-6 flex flex-col gap-8 flex-shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/20">
            A
          </div>
          <div>
            <h1 className="text-white font-bold leading-none">Admin Panel</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mt-1 font-bold">Anageek Portfolio</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" href="/admin" />
          <div className="pt-4 pb-2 px-3">
             <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">Categories</p>
          </div>
          {categories.map((cat) => (
            <NavItem 
              key={cat.slug} 
              icon={getIcon(cat.icon)} 
              label={cat.label} 
              href={`/admin?category=${cat.slug}`} 
            />
          ))}
          
          <div className="pt-8 pb-2 px-3 border-t border-zinc-900 mt-4">
             <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">Settings</p>
          </div>
          <NavItem icon={<Palette />} label="Categories" href="/admin/categories" />
          <NavItem icon={<SettingsIcon />} label="General Settings" href="/admin/settings" />
        </nav>

        <div className="space-y-4 pt-6 border-t border-zinc-900">
           <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 text-sm hover:text-white transition-colors group">
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-blue-400" />
              <span>View Public Site</span>
           </Link>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:text-red-400 transition-colors group"
           >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-zinc-900 px-8 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
           <h2 className="text-sm font-medium text-white flex items-center gap-2">
              <span className="text-zinc-600">Admin</span>
              <ChevronRight className="w-4 h-4 text-zinc-800" />
              <span>Content Management</span>
           </h2>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-medium text-emerald-500">Live Edition</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                 <User className="w-4 h-4" />
              </div>
           </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto animation-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, href, active = false }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
        active 
        ? "bg-blue-600/10 text-blue-500" 
        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
      }`}
    >
      <span className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? "text-blue-500" : "text-zinc-600 group-hover:text-zinc-400"}`}>
        {icon}
      </span>
      {label}
    </Link>
  )
}
