'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold text-primary">500</h1>
        <h2 className="text-2xl font-semibold text-white">Something went wrong</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 border border-primary bg-primary text-white rounded-xl hover:bg-opacity-10 hover:bg-primary transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-white text-white rounded-xl hover:bg-white hover:text-black transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
