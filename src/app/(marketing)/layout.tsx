import { PublicHeader } from '@/components/layouts/public-header'
import { ScrollToTop } from '@/components/common/scroll-to-top'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      {children}
      <ScrollToTop />
    </>
  )
}
