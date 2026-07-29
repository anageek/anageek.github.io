import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts any YouTube URL format to a proper embed URL.
 * Handles watch?v=, youtu.be/, and already-embed URLs.
 * Returns the original URL unchanged if it's not a YouTube URL.
 */
export function toYouTubeEmbedUrl(url: string): string {
  if (!url) return url
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')

    // Already an embed URL — return as-is
    if (host === 'youtube.com' && parsed.pathname.startsWith('/embed/')) return url
    if (host === 'youtube-nocookie.com' && parsed.pathname.startsWith('/embed/')) return url

    let videoId: string | null = null

    if (host === 'youtube.com' && parsed.pathname === '/watch') {
      videoId = parsed.searchParams.get('v')
    } else if (host === 'youtu.be') {
      videoId = parsed.pathname.slice(1) // remove leading /
    }

    if (videoId) return `https://www.youtube.com/embed/${videoId}`
  } catch {
    // not a valid URL, return as-is
  }
  return url
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
