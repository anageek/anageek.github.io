'use client'

import { Label } from '@/components/ui/label'
import type { ReactNode } from 'react'

interface FieldProps {
  label?: string
  error?: string
  children: ReactNode
}

export function Field({ label, children, error }: FieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {label}
        </Label>
      )}
      {children}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  )
}
