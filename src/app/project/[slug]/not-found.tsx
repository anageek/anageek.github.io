import Link from 'next/link'

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4">404</p>
      <h1 className="text-4xl font-bold tracking-tight mb-3">Projeto não encontrado</h1>
      <p className="text-zinc-400 mb-8 text-center max-w-md">
        O projeto que você está procurando não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all font-medium"
      >
        Voltar ao Portfólio
      </Link>
    </div>
  )
}
