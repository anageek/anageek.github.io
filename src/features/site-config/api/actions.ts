'use server'
import 'server-only'
import { db } from '@/lib/db'
import { siteConfig } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { withAuth } from '@/lib/auth/guards'

export const updateSiteConfig = withAuth(async (key: string, value: string) => {
  const existing = await db.query.siteConfig.findFirst({
    where: eq(siteConfig.key, key),
  })

  if (existing) {
    await db.update(siteConfig).set({ value, updatedAt: new Date().toISOString() }).where(eq(siteConfig.key, key))
  } else {
    await db.insert(siteConfig).values({ key, value })
  }

  revalidateTag('site-config')
  return { success: true as const }
})
