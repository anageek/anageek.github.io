export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-10 w-48 bg-zinc-900 rounded-xl" />
        <div className="h-12 w-40 bg-zinc-900 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-900 rounded-2xl" />)}
      </div>
      <div className="h-96 bg-zinc-900 rounded-2xl" />
    </div>
  )
}
