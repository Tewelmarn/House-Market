'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch('/api/products').then(r => r.json()).then(d => { setProducts(Array.isArray(d) ? d : []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm('Rausim ' + name + ' olgeta?')) return
    await fetch('/api/products/' + id, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '32px', fontWeight: 800, color: '#1b1c1a', margin: 0 }}>Ol Samting (Products)</h1>
          <p style={{ color: '#5b403d', fontSize: '14px', marginTop: '6px' }}>Ol samting yu skelim long ol House Markets bilong yu</p>
        </div>
        <Link href='/dashboard/products/new' style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#af101a', color: '#fff', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
          <Plus size={16} /> Putim Nupela Samting
        </Link>
      </div>

      {loading && <p style={{ color: '#5b403d' }}>Luk i go...</p>}

      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 32px', background: '#fff', borderRadius: '16px', border: '2px dashed #e4beba' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>??</div>
          <h3 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, color: '#1b1c1a', marginBottom: '8px', fontSize: '20px' }}>Nogat samting yet!</h3>
          <p style={{ color: '#5b403d', marginBottom: '24px' }}>Putim nupela samting na ol manmeri bai lukim.</p>
          <Link href='/dashboard/products/new' style={{ background: '#af101a', color: '#fff', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>
            Putim Nau
          </Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {products.map((p: any) => (
          <div key={p.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e4e2df', boxShadow: '0 2px 8px rgba(78,52,46,0.08)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #fbf9f6, #efeeeb)', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
              ??
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: '16px', color: '#1b1c1a', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontSize: '12px', color: '#875200', background: '#ffddba', padding: '2px 8px', borderRadius: '99px', display: 'inline-block', marginBottom: '10px' }}>
                {p.shop && p.shop.name}
              </div>
              {p.description && (
                <p style={{ fontSize: '13px', color: '#5b403d', lineHeight: '1.5', marginBottom: '12px' }}>
                  {p.description.length > 80 ? p.description.slice(0, 80) + '...' : p.description}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: '20px', color: '#af101a' }}>{'K ' + Number(p.price).toFixed(2)}</span>
                <span style={{ fontSize: '12px', color: '#8f6f6c' }}>{'Stok: ' + p.quantity}</span>
              </div>
              {p.bulkDiscountQty && (
                <div style={{ background: '#ffddba', color: '#623a00', fontSize: '12px', padding: '6px 10px', borderRadius: '8px', marginBottom: '12px' }}>
                  {'Baim ' + p.bulkDiscountQty + '+ -> K ' + Number(p.bulkDiscountPrice).toFixed(2) + ' wan wan'}
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href={'/dashboard/products/' + p.id + '/edit'} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', background: '#f89c00', color: '#1b1c1a', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                  <Pencil size={13} /> Senisim
                </Link>
                <button onClick={() => handleDelete(p.id, p.name)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', background: '#ffdad6', color: '#af101a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                  <Trash2 size={13} /> Rausim
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
