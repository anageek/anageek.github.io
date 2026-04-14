import { describe, it, expect } from 'vitest'
import { cn, slugify } from '@/lib/utils'

describe('cn', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })
})

describe('slugify', () => {
  it('converts title to URL-safe slug', () => {
    expect(slugify('Naufrago Game')).toBe('naufrago-game')
  })

  it('handles special characters', () => {
    expect(slugify('UI/UX Design Project')).toBe('ui-ux-design-project')
  })

  it('handles accented characters', () => {
    expect(slugify('Café Résumé')).toBe('cafe-resume')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('--hello--world--')).toBe('hello-world')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })
})
