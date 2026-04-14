import { PublicHeader } from '@/components/layouts/public-header'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      {children}
    </>
  )
}
