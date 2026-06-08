'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2, Trash2, Package } from 'lucide-react'

const input: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e4e2df', background: '#fbf9f6', fontSize: '15px', color: '#1b1c1a', outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#1b1c1a', marginBottom: '6px' }

export default function ShopDetailPage() {
  const { shopId } = useParams()
  const router = useRouter()
  const [shop, setShop] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    fetch(/api/shops/).then(r => r.json()).then(d => { setShop(d); setForm(d); setLoading(false) })
  }, [shopId])

  const handleSave = async () => {
    const res = await fetch(/api/shops/, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, description: form.description, location: form.location, whatsapp: form.whatsapp }) })
    if (res.ok) { const d = await res.json(); setShop(d); setEditing(false) }
  }

  const handleDelete = async () => {
    await fetch(/api/shops/, { method: 'DELETE' })
    router.push('/dashboard/shops')
  }

  if (loading) return <p style={{ color: '#5b403d', padding: '32px' }}>Luk i go...</p>
  if (!shop || shop.error) return <p style={{ color: '#af101a', padding: '32px' }}>House Market i no stap.</p>

  return (
    <div style={{ maxWidth: '720px' }}>
      <Link href='/dashboard/shops' style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5b403d', textDecoration: 'none', marginBottom: '24px', fontSize: '14px' }}>
        <ArrowLeft size={16} /> Bek long ol House Markets
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #af101a, #d32f2f)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
            ??
          </div>
          <div>
            <h1 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '26px', fontWeight: 800, color: '#1b1c1a', margin: '0 0 4px' }}>{shop.name}</h1>
            <span style={{ fontSize: '12px', color: '#875200', background: '#ffddba', padding: '3px 10px', borderRadius: '99px' }}>{shop.category}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setEditing(!editing); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: '#f89c00', color: '#1b1c1a', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
            <Edit2 size={14} /> Senisim
          </button>
          <button onClick={() => setDeleteConfirm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: '#ffdad6', color: '#af101a', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
            <Trash2 size={14} /> Rausim
          </button>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '36px', maxWidth: '420px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>??</div>
            <h2 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, color: '#1b1c1a', marginBottom: '8px' }}>Rausim House Market?</h2>
            <p style={{ color: '#5b403d', marginBottom: '8px' }}>Yu laik rausim <strong>{shop.name}</strong> olgeta?</p>
            <p style={{ color: '#af101a', fontSize: '13px', marginBottom: '28px' }}>Dispela wok bai no inap bek gen. Ol products tu bai rausim.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={handleDelete} style={{ padding: '12px 28px', background: '#af101a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>Yes, Rausim Nau</button>
              <button onClick={() => setDeleteConfirm(false)} style={{ padding: '12px 28px', background: '#efeeeb', color: '#1b1c1a', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Nogat, Bek</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editing && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e4e2df', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, marginBottom: '20px', color: '#1b1c1a' }}>Senisim House Market</h2>
          <div style={{ marginBottom: '16px' }}><label style={labelStyle}>Nem</label><input style={input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div style={{ marginBottom: '16px' }}><label style={labelStyle}>Tokim ol baiya</label><textarea style={{...input, height: '80px', resize: 'vertical'}} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} /></div>
          <div style={{ marginBottom: '16px' }}><label style={labelStyle}>Ples</label><input style={input} value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} /></div>
          <div style={{ marginBottom: '20px' }}><label style={labelStyle}>WhatsApp</label><input style={input} value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})} /></div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} style={{ padding: '12px 24px', background: '#af101a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Seivim Senisim</button>
            <button onClick={() => setEditing(false)} style={{ padding: '12px 24px', background: '#efeeeb', color: '#1b1c1a', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Bagarapim</button>
          </div>
        </div>
      )}

      {/* Info Card */}
      {!editing && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e4e2df', marginBottom: '24px' }}>
          <p style={{ color: '#5b403d', lineHeight: '1.7', marginBottom: '16px', fontSize: '15px' }}>{shop.description || 'Nogat toktok yet. Senisim na raitim stori bilong House Market bilong yu.'}</p>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#8f6f6c', flexWrap: 'wrap' }}>
            {shop.location && <span>?? {shop.location}</span>}
            {shop.whatsapp && <span>?? {shop.whatsapp}</span>}
          </div>
        </div>
      )}

      {/* Products */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e4e2df' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, color: '#1b1c1a', margin: 0 }}>Ol Samting (Products)</h2>
          <Link href={/dashboard/products/new?shopId=} style={{ background: '#af101a', color: '#fff', padding: '9px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>+ Putim Samting</Link>
        </div>
        {shop.products?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8f6f6c', border: '2px dashed #e4beba', borderRadius: '12px' }}>
            <Package size={36} color='#e4beba' style={{ marginBottom: '10px' }} />
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Nogat samting yet long dispela House Market.</p>
            <p style={{ fontSize: '13px' }}>Klikim "Putim Samting" na stat!</p>
          </div>
        ) : (
          shop.products?.map((p: any) => (
            <div key={p.id} style={{ padding: '14px 16px', borderRadius: '10px', background: '#fbf9f6', marginBottom: '8px', fontSize: '14px', color: '#1b1c1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eae8e5' }}>
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              <span style={{ color: '#875200', fontWeight: 700 }}>K {p.price}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
