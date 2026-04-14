import { z } from 'zod'
import type { categories } from '@/lib/db/schema'

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

export const categoryFormSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with dashes'),
  label: z.string().min(1, 'Label is required'),
  icon: z.string().min(1, 'Icon is required'),
  visible: z.boolean().optional().default(true),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
