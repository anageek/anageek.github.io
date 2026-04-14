import { getSiteConfig } from '@/features/site-config'
import { SettingsForm } from '@/features/site-config'

export default async function AdminSettingsPage() {
  const config = await getSiteConfig()
  return <SettingsForm initialConfig={config} />
}
