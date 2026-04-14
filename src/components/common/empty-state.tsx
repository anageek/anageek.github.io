import { XCircle } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-24">
      {icon ?? <XCircle className="w-10 h-10 text-zinc-800" />}
      <p className="text-zinc-600 font-medium">{title}</p>
      {description && <p className="text-zinc-700 text-sm">{description}</p>}
    </div>
  )
}
