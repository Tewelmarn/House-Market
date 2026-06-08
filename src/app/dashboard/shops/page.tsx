'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, MapPin } from 'lucide-react'

export default function ShopsPage() {
  const [shops, setShops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shops').then(r => r.json()).then(data => { setShops(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '32px', fontWeight: 800, color: '#1b1c1a', margin: 0 }}>My House Markets</h1>
          <p style={{ color: '#5b403d', fontSize: '14px', marginTop: '6px' }}>Manage your trading spaces on House Market PNG</p>
        </div>
        <Link href='/dashboard/shops/new' style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#af101a', color: '#fff', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
          <Plus size={16} /> Open New House Market
        </Link>
      </div>

      {loading && <p style={{ color: '#5b403d' }}>Loading your House Markets...</p>}

      {!loading && shops.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 32px', background: '#fff', borderRadius: '16px', border: '2px dashed #e4beba' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>??</div>
          <h3 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, color: '#1b1c1a', marginBottom: '8px', fontSize: '20px' }}>Yu no gat House Market yet!</h3>
          <p style={{ color: '#5b403d', marginBottom: '24px', fontSize: '15px' }}>Openim nau na stat skelim ol samting bilong yu long PNG.</p>
          <Link href='/dashboard/shops/new' style={{ background: '#af101a', color: '#fff', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>
            Openim Nau
          </Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {shops.map((shop: any) => (
          <Link key={shop.id} href={'/dashboard/shops/' + shop.id} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e4e2df', boxShadow: '0 2px 8px rgba(78,52,46,0.08)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #af101a, #d32f2f)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  ??
                </div>
                <div>
                  <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, color: '#1b1c1a', fontSize: '16px' }}>{shop.name}</div>
                  <div style={{ fontSize: '12px', color: '#875200', background: '#ffddba', padding: '2px 10px', borderRadius: '99px', display: 'inline-block', marginTop: '3px' }}>{shop.category}</div>
                </div>
              </div>
              {shop.description && <p style={{ color: '#5b403d', fontSize: '14px', marginBottom: '14px', lineHeight: '1.6' }}>{shop.description}</p>}
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#8f6f6c', flexWrap: 'wrap' }}>
                {shop.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} />{shop.location}</span>}
                <span>{'?? ' + (shop._count && shop._count.products ? shop._count.products : 0) + ' products'}</span>
                {shop.whatsapp && <span>{'?? ' + shop.whatsapp}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
