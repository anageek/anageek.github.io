// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
}
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

describe('auth/jwt', () => {
  beforeEach(() => {
    vi.stubEnv('SESSION_SECRET', 'a-very-long-secret-key-that-is-at-least-32-characters-long')
    vi.resetModules()
    mockCookieStore.get.mockReset()
    mockCookieStore.set.mockReset()
  })

  it('encrypt produces a valid JWT string', async () => {
    const { encrypt } = await import('@/lib/auth/jwt')
    const token = await encrypt({ email: 'admin@test.com' })
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  it('decrypt recovers the payload', async () => {
    const { encrypt, decrypt } = await import('@/lib/auth/jwt')
    const token = await encrypt({ email: 'admin@test.com' })
    const payload = await decrypt(token)
    expect(payload.email).toBe('admin@test.com')
  })

  it('decrypt throws on invalid token', async () => {
    const { decrypt } = await import('@/lib/auth/jwt')
    await expect(decrypt('invalid.token.here')).rejects.toThrow()
  })

  it('hashPassword produces consistent SHA-256 hex', async () => {
    const { hashPassword } = await import('@/lib/auth/jwt')
    const hash1 = await hashPassword('test123')
    const hash2 = await hashPassword('test123')
    expect(hash1).toBe(hash2)
    expect(hash1).toHaveLength(64)
  })
})
