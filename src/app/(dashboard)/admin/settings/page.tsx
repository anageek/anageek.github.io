import type { Metadata } from 'next'
import { getSiteConfig } from '@/features/site-config'
import { SettingsForm } from '@/features/site-config'

export const metadata: Metadata = { title: 'Settings — Admin' }

export default async function AdminSettingsPage() {
  const config = await getSiteConfig()
  return <SettingsForm initialConfig={config} />
}
