import 'server-only'
import { cookies } from 'next/headers'
import { encrypt, decrypt, hashPassword } from './jwt'

export { encrypt, decrypt, hashPassword }

export async function createSession(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL
  const storedHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminEmail || !storedHash) return false

  const inputHash = await hashPassword(password)

  if (email !== adminEmail || inputHash !== storedHash) {
    return false
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const token = await encrypt({ email, expires: expires.toISOString() })

  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return true
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
}

export async function getSession(): Promise<Record<string, unknown> | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null

  try {
    return await decrypt(token)
  } catch {
    return null
  }
}
