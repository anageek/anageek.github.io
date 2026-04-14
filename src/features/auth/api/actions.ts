'use server'
import 'server-only'
import { createSession, destroySession } from '@/lib/auth/session'
import { loginSchema } from '../types/auth'
import { redirect } from 'next/navigation'

export async function loginAction(data: unknown) {
  const parsed = loginSchema.parse(data)
  const success = await createSession(parsed.email, parsed.password)

  if (!success) {
    return { error: 'Invalid credentials' }
  }

  redirect('/admin')
}

export async function logoutAction() {
  await destroySession()
  redirect('/login')
}
