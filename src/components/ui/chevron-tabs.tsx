'use client'

interface ChevronTabsProps {
  active: string
  tabs: string[]
  onChange: (tab: string) => void
}

export function ChevronTabs({ active, tabs, onChange }: ChevronTabsProps) {
  return (
    <div className="flex items-center">
      {tabs.map((tab, i) => {
        const isActive = active === tab.toLowerCase()
        const isFirst = i === 0
        const isLast = i === tabs.length - 1
        const clip = isFirst
          ? 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)'
          : isLast
          ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 14px 50%)'
          : 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)'

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab.toLowerCase())}
            style={{ clipPath: clip }}
            className={[
              'px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-all select-none',
              i > 0 ? '-ml-2' : '',
              isActive
                ? 'bg-white text-black z-10 relative'
                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 z-0 relative',
            ].join(' ')}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
