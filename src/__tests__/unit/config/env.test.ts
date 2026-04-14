import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('env validation', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws if SESSION_SECRET is missing', async () => {
    vi.stubEnv('SESSION_SECRET', '')
    vi.stubEnv('ADMIN_EMAIL', 'test@test.com')
    vi.stubEnv('ADMIN_PASSWORD_HASH', 'abc123')
    vi.stubEnv('POSTGRES_URL', 'postgresql://localhost/test')
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_token')

    await expect(async () => {
      vi.resetModules()
      await import('@/config/env')
    }).rejects.toThrow()
  })

  it('parses valid env vars without error', async () => {
    vi.stubEnv('SESSION_SECRET', 'a-very-long-secret-key-that-is-at-least-32-chars')
    vi.stubEnv('ADMIN_EMAIL', 'admin@anageek.me')
    vi.stubEnv('ADMIN_PASSWORD_HASH', 'abc123hash')
    vi.stubEnv('POSTGRES_URL', 'postgresql://localhost/test')
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'vercel_blob_rw_xxxx')

    vi.resetModules()
    const { env } = await import('@/config/env')

    expect(env.SESSION_SECRET).toBe('a-very-long-secret-key-that-is-at-least-32-chars')
    expect(env.ADMIN_EMAIL).toBe('admin@anageek.me')
  })
})
