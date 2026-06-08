'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const inp: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e4e2df', background: '#fff', fontSize: '15px', color: '#1b1c1a', outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }
const lbl: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#1b1c1a', marginBottom: '6px' }
const section: React.CSSProperties = { background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e4e2df', marginBottom: '20px' }
const sectionTitle: React.CSSProperties = { fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: '16px', color: '#1b1c1a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eae8e5' }

export default function EditProductPage() {
  const { productId } = useParams()
  const router = useRouter()
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(/api/products/).then(r => r.json()).then(d => {
      setForm({ ...d, price: String(d.price), quantity: String(d.quantity), bulkDiscountQty: d.bulkDiscountQty ? String(d.bulkDiscountQty) : '', bulkDiscountPrice: d.bulkDiscountPrice ? String(d.bulkDiscountPrice) : '' })
      setLoading(false)
    })
  }, [productId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      name: form.name, description: form.description,
      price: parseFloat(form.price), quantity: parseInt(form.quantity),
      category: form.category, location: form.location, shippingInfo: form.shippingInfo,
      bulkDiscountQty: form.bulkDiscountQty ? parseInt(form.bulkDiscountQty) : null,
      bulkDiscountPrice: form.bulkDiscountPrice ? parseFloat(form.bulkDiscountPrice) : null,
    }
    const res = await fetch(/api/products/, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { router.push('/dashboard/products') }
    else { setError('Bagarap! Traim gen.'); setSaving(false) }
  }

  const f = (key: string, val: string) => setForm((prev: any) => ({...prev, [key]: val}))

  if (loading) return <p style={{ color: '#5b403d', padding: '32px' }}>Luk i go...</p>

  return (
    <div style={{ maxWidth: '640px' }}>
      <Link href='/dashboard/products' style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5b403d', textDecoration: 'none', marginBottom: '24px', fontSize: '14px' }}>
        <ArrowLeft size={16} /> Bek long Ol Samting
      </Link>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>??</div>
        <h1 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '28px', fontWeight: 800, color: '#1b1c1a', margin: '0 0 6px' }}>Senisim Samting</h1>
        <p style={{ color: '#5b403d', fontSize: '14px' }}>{form.name}</p>
      </div>

      <form onSubmit={handleSave}>
        {error && <div style={{ background: '#ffdad6', color: '#93000a', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>?? {error}</div>}

        <div style={section}>
          <div style={sectionTitle}>?? Ol Namba Bilong Samting</div>
          <div style={{ marginBottom: '16px' }}><label style={lbl}>Nem *</label><input style={inp} value={form.name} onChange={e => f('name', e.target.value)} required /></div>
          <div style={{ marginBottom: '0' }}><label style={lbl}>Tokim ol baiya</label><textarea style={{...inp, height: '90px', resize: 'vertical'}} value={form.description || ''} onChange={e => f('description', e.target.value)} /></div>
        </div>

        <div style={section}>
          <div style={sectionTitle}>?? Praisi na Stok</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={lbl}>Praisi (K) *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#875200' }}>K</span>
                <input style={{...inp, paddingLeft: '28px'}} type='number' min='0' step='0.01' value={form.price} onChange={e => f('price', e.target.value)} required />
              </div>
            </div>
            <div>
              <label style={lbl}>Stok</label>
              <input style={inp} type='number' min='0' value={form.quantity} onChange={e => f('quantity', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={section}>
          <div style={sectionTitle}>??? Baim Planti Praisi</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={lbl}>Min Namba</label><input style={inp} type='number' min='2' value={form.bulkDiscountQty} onChange={e => f('bulkDiscountQty', e.target.value)} /></div>
            <div>
              <label style={lbl}>Praisi (K)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#875200' }}>K</span>
                <input style={{...inp, paddingLeft: '28px'}} type='number' min='0' step='0.01' value={form.bulkDiscountPrice} onChange={e => f('bulkDiscountPrice', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div style={section}>
          <div style={sectionTitle}>?? Logistics</div>
          <div style={{ marginBottom: '16px' }}><label style={lbl}>Ples</label><input style={inp} value={form.location || ''} onChange={e => f('location', e.target.value)} /></div>
          <div><label style={lbl}>Salim i Go Info</label><textarea style={{...inp, height: '75px', resize: 'vertical'}} value={form.shippingInfo || ''} onChange={e => f('shippingInfo', e.target.value)} /></div>
        </div>

        <button type='submit' disabled={saving} style={{
          width: '100%', padding: '16px', background: saving ? '#d32f2f99' : '#af101a',
          color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px',
          fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif"
        }}>
          {saving ? 'Seivim i go...' : '? Seivim Senisim'}
        </button>
      </form>
    </div>
  )
}
