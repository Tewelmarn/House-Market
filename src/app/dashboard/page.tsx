import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user as any

  const shopCount = user?.role === 'SELLER' || user?.role === 'ADMIN'
    ? await prisma.shop.count({ where: { ownerId: user.id } })
    : 0

  return (
    <div>
      <h1 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '32px', fontWeight: 800, color: '#1b1c1a', marginBottom: '8px' }}>
        Welcome back, {user?.name} ??
      </h1>
      <p style={{ color: '#5b403d', marginBottom: '32px' }}>Here's what's happening with your House Market.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {[
          { label: 'My House Markets', value: shopCount, color: '#af101a' },
          { label: 'Products', value: 0, color: '#875200' },
          { label: 'Messages', value: 0, color: '#6d5049' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: '12px', padding: '24px',
            border: '1px solid #e4e2df', boxShadow: '0 2px 8px rgba(78,52,46,0.08)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 800, color: card.color, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{card.value}</div>
            <div style={{ color: '#5b403d', fontSize: '14px', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
