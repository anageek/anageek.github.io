import { z } from 'zod'
import type { siteConfig } from '@/lib/db/schema'

export type SiteConfigEntry = typeof siteConfig.$inferSelect

export const siteConfigFormSchema = z.object({
  heroVideoUrl: z.string().url('Must be a valid URL').or(z.literal('')),
})

export type SiteConfigFormValues = z.infer<typeof siteConfigFormSchema>
