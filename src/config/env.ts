import 'server-only'
import { z } from 'zod'

const envSchema = z.object({
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
  ADMIN_PASSWORD_HASH: z.string().min(1, 'ADMIN_PASSWORD_HASH is required'),
  POSTGRES_URL: z.string().url('POSTGRES_URL must be a valid URL'),
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'BLOB_READ_WRITE_TOKEN is required'),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>
