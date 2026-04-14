'use server'
import 'server-only'
import { db } from '@/lib/db'
import { siteConfig } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getSiteConfig() {
  const entries = await db.query.siteConfig.findMany()
  return Object.fromEntries(entries.map((e) => [e.key, e.value]))
}

export async function getSiteConfigValue(key: string): Promise<string | null> {
  const entry = await db.query.siteConfig.findFirst({
    where: eq(siteConfig.key, key),
  })
  return entry?.value ?? null
}
