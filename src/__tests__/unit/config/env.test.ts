import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('env validation', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws if SESSION_SECRET is missing', async () => {
    vi.stubEnv('SESSION_SECRET', '')
    vi.stubEnv('ADMIN_EMAIL', 'test@test.com')
    vi.stubEnv('ADMIN_PASSWORD_HASH', 'abc123')
    vi.stubEnv('DATABASE_URL', 'postgresql://localhost/test')
    vi.stubEnv('GITHUB_TOKEN', 'ghp_token')
    vi.stubEnv('GITHUB_REPO', 'owner/repo')

    await expect(async () => {
      vi.resetModules()
      await import('@/config/env')
    }).rejects.toThrow()
  })

  it('parses valid env vars without error', async () => {
    vi.stubEnv('SESSION_SECRET', 'a-very-long-secret-key-that-is-at-least-32-chars')
    vi.stubEnv('ADMIN_EMAIL', 'admin@anageek.me')
    vi.stubEnv('ADMIN_PASSWORD_HASH', 'abc123hash')
    vi.stubEnv('DATABASE_URL', 'postgresql://localhost/test')
    vi.stubEnv('GITHUB_TOKEN', 'ghp_token')
    vi.stubEnv('GITHUB_REPO', 'owner/repo')

    vi.resetModules()
    const { env } = await import('@/config/env')

    expect(env.SESSION_SECRET).toBe('a-very-long-secret-key-that-is-at-least-32-chars')
    expect(env.ADMIN_EMAIL).toBe('admin@anageek.me')
  })
})
