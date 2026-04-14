import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth/jwt'

export async function middleware(request: NextRequest) {
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/api/admin')

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get('session')?.value

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await decrypt(token)
    return NextResponse.next()
  } catch {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
