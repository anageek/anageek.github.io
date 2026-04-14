'use client'

import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, loading }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-950 border-zinc-900 text-zinc-300 p-8 shadow-2xl rounded-2xl">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Trash2 className="w-8 h-8" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold text-white tracking-tighter mb-2">{title}</DialogTitle>
            <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
        <DialogFooter className="flex items-center gap-3 mt-8">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 h-12 rounded-xl">Cancelar</Button>
          <Button onClick={onConfirm} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-12 rounded-xl">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
