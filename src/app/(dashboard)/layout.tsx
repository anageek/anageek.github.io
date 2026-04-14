import { AdminSidebar } from '@/components/layouts/admin-sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto">
        {children}
      </main>
    </div>
  )
}
