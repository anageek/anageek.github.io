import { Loader2 } from 'lucide-react'

export function LoadingSkeleton({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      {message && <p className="text-zinc-500 text-sm font-medium">{message}</p>}
    </div>
  )
}
