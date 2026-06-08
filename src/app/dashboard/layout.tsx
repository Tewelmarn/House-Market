import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fbf9f6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <DashboardSidebar user={session.user} />
      <main style={{ flex: 1, padding: '32px', maxWidth: '1280px' }}>
        {children}
      </main>
    </div>
  )
}
