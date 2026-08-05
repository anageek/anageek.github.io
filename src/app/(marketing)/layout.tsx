import { PublicHeader } from '@/components/layouts/public-header'
import { ScrollToTop } from '@/components/common/scroll-to-top'
import { getSiteConfigValue } from '@/features/site-config'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const logoUrl = await getSiteConfigValue('logoUrl')
  return (
    <>
      <PublicHeader logoUrl={logoUrl ?? undefined} />
      {children}
      <ScrollToTop />
    </>
  )
}
