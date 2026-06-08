'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Store, Package, MessageSquare, ShoppingCart, BarChart2, Settings, LogOut, Home } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Home, roles: ['BUYER','SELLER','ADMIN','ADMIN_SUPPORT'] },
  { href: '/dashboard/shops', label: 'My House Markets', icon: Store, roles: ['SELLER','ADMIN'] },
  { href: '/dashboard/products', label: 'Products', icon: Package, roles: ['SELLER','ADMIN'] },
  { href: '/dashboard/chat', label: 'Messages', icon: MessageSquare, roles: ['BUYER','SELLER','ADMIN','ADMIN_SUPPORT'] },
  { href: '/dashboard/orders', label: 'Cart & Orders', icon: ShoppingCart, roles: ['BUYER','SELLER'] },
  { href: '/dashboard/admin', label: 'Admin Panel', icon: BarChart2, roles: ['ADMIN','ADMIN_SUPPORT'] },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['BUYER','SELLER','ADMIN','ADMIN_SUPPORT'] },
]

export default function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const role = user?.role || 'BUYER'

  return (
    <aside style={{ width: '240px', background: '#1b1c1a', minHeight: '100vh', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0 20px 32px', borderBottom: '1px solid #333' }}>
        <img src='/logo.png' alt='House Market' style={{ width: '120px' }} />
      </div>
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {navItems.filter(i => i.roles.includes(role)).map(item => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 20px', textDecoration: 'none',
              color: active ? '#f89c00' : '#e4e2df',
              background: active ? 'rgba(248,156,0,0.1)' : 'transparent',
              borderLeft: active ? '3px solid #f89c00' : '3px solid transparent',
              fontSize: '14px', fontWeight: active ? 600 : 400,
              transition: 'all 0.2s'
            }}>
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #333' }}>
        <div style={{ color: '#e4e2df', fontSize: '13px', marginBottom: '4px', fontWeight: 600 }}>{user?.name}</div>
        <div style={{ color: '#8f6f6c', fontSize: '12px', marginBottom: '12px' }}>{role}</div>
        <Link href='/api/auth/signout' style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          color: '#af101a', fontSize: '13px', textDecoration: 'none'
        }}>
          <LogOut size={15} /> Sign Out
        </Link>
      </div>
    </aside>
  )
}
