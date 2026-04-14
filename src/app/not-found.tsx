import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-primary bg-primary text-white rounded-xl hover:bg-opacity-10 hover:bg-primary transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
