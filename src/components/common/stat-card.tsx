import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  color: string
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-900/80 p-7 rounded-3xl flex items-center justify-between group hover:border-zinc-800 transition-all hover:translate-y-[-4px] shadow-lg shadow-black/20">
      <div>
        <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[2px]">{label}</p>
        <p className="text-4xl font-black text-white mt-2 group-hover:text-blue-500 transition-colors tracking-tighter">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl bg-zinc-950 border border-zinc-800/50 ${color} shadow-2xl shadow-black/40 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  )
}
