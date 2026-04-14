'use server'
import 'server-only'
import { db } from '@/lib/db'
import { siteConfig } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { withAuth } from '@/lib/auth/guards'

export const updateSiteConfig = withAuth(async (key: string, value: string) => {
  const existing = db.select().from(siteConfig).where(eq(siteConfig.key, key)).get()

  if (existing) {
    db.update(siteConfig).set({ value, updatedAt: new Date().toISOString() }).where(eq(siteConfig.key, key)).run()
  } else {
    db.insert(siteConfig).values({ key, value }).run()
  }

  revalidateTag('site-config')
  return { success: true as const }
})
