'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const PNG_PRODUCT_CATEGORIES = ['Kaikai (Food)','Gaden Harvest','Laplap (Clothing)','Haus Samting (Household)','Elektronik','Handicraft & Arts','Bilding Matrials','Narapela (Other)']

const inp: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e4e2df', background: '#fff', fontSize: '15px', color: '#1b1c1a', outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }
const lbl: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#1b1c1a', marginBottom: '6px' }
const hint: React.CSSProperties = { fontSize: '12px', color: '#8f6f6c', marginTop: '4px' }
const section: React.CSSProperties = { background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e4e2df', marginBottom: '20px' }
const sectionTitle: React.CSSProperties = { fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: '16px', color: '#1b1c1a', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eae8e5' }

export default function NewProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedShopId = searchParams.get('shopId') || ''

  const [shops, setShops] = useState<any[]>([])
  const [form, setForm] = useState({
    name: '', description: '', price: '', quantity: '0',
    category: '', location: '', shippingInfo: '',
    bulkDiscountQty: '', bulkDiscountPrice: '', shopId: preselectedShopId
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/shops').then(r => r.json()).then(d => setShops(Array.isArray(d) ? d : []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = {
      ...form,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      bulkDiscountQty: form.bulkDiscountQty ? parseInt(form.bulkDiscountQty) : undefined,
      bulkDiscountPrice: form.bulkDiscountPrice ? parseFloat(form.bulkDiscountPrice) : undefined,
    }
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    if (!res.ok) { setError(data.error?.formErrors?.[0] || 'Bagarap! Traim gen.'); setLoading(false); return }
    router.push('/dashboard/products')
  }

  const f = (key: string, val: string) => setForm(prev => ({...prev, [key]: val}))

  return (
    <div style={{ maxWidth: '640px' }}>
      <Link href='/dashboard/products' style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5b403d', textDecoration: 'none', marginBottom: '24px', fontSize: '14px' }}>
        <ArrowLeft size={16} /> Bek long Ol Samting
      </Link>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>??</div>
        <h1 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '30px', fontWeight: 800, color: '#1b1c1a', margin: '0 0 6px' }}>Putim Nupela Samting</h1>
        <p style={{ color: '#5b403d', fontSize: '14px' }}>Filim ol hap na ol manmeri bai lukim samting bilong yu.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div style={{ background: '#ffdad6', color: '#93000a', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>?? {error}</div>}

        {/* Basic Info */}
        <div style={section}>
          <div style={sectionTitle}>?? Ol Namba Bilong Samting</div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Nem Bilong Samting *</label>
            <input style={inp} placeholder='e.g. Presh Kokonas, Handmade Bilum, Sekon Han Fon' value={form.name} onChange={e => f('name', e.target.value)} required />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>House Market *</label>
            <select style={inp} value={form.shopId} onChange={e => f('shopId', e.target.value)} required>
              <option value=''>Makim House Market</option>
              {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <p style={hint}>Samting bai stap insait long dispela House Market.</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Kategori</label>
            <select style={inp} value={form.category} onChange={e => f('category', e.target.value)}>
              <option value=''>Makim kategori</option>
              {PNG_PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '0' }}>
            <label style={lbl}>Tokim ol baiya long dispela samting</label>
            <textarea style={{...inp, height: '90px', resize: 'vertical'}} placeholder='Stori bilong samting, saiz, kala, kondisen...' value={form.description} onChange={e => f('description', e.target.value)} />
          </div>
        </div>

        {/* Price & Stock */}
        <div style={section}>
          <div style={sectionTitle}>?? Praisi na Stok</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '0' }}>
            <div>
              <label style={lbl}>Praisi (Kina) *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#875200' }}>K</span>
                <input style={{...inp, paddingLeft: '28px'}} type='number' min='0' step='0.01' placeholder='0.00' value={form.price} onChange={e => f('price', e.target.value)} required />
              </div>
            </div>
            <div>
              <label style={lbl}>Hamas Stok</label>
              <input style={inp} type='number' min='0' placeholder='0' value={form.quantity} onChange={e => f('quantity', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Bulk Discount */}
        <div style={section}>
          <div style={sectionTitle}>??? Baim Planti — Praisi i Go Daun</div>
          <p style={{ fontSize: '13px', color: '#5b403d', marginBottom: '16px' }}>Sapos yu laik givim cheap praisi long ol baiya husat baim planti, filim hia.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={lbl}>Baim Hamas Na Antap</label>
              <input style={inp} type='number' min='2' placeholder='e.g. 10' value={form.bulkDiscountQty} onChange={e => f('bulkDiscountQty', e.target.value)} />
              <p style={hint}>Minimum namba bilong baim.</p>
            </div>
            <div>
              <label style={lbl}>Bikpela Baim Praisi (K)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#875200' }}>K</span>
                <input style={{...inp, paddingLeft: '28px'}} type='number' min='0' step='0.01' placeholder='0.00' value={form.bulkDiscountPrice} onChange={e => f('bulkDiscountPrice', e.target.value)} />
              </div>
              <p style={hint}>Praisi wan wan taim baim planti.</p>
            </div>
          </div>
        </div>

        {/* Logistics */}
        <div style={section}>
          <div style={sectionTitle}>?? Salim i Go (Logistics)</div>

          <div style={{ marginBottom: '16px' }}>
            <label style={lbl}>Ples (Location)</label>
            <input style={inp} placeholder='e.g. Gordons Market NCD, Lae City' value={form.location} onChange={e => f('location', e.target.value)} />
          </div>
          <div style={{ marginBottom: '0' }}>
            <label style={lbl}>Salim i Go Info</label>
            <textarea style={{...inp, height: '75px', resize: 'vertical'}} placeholder='e.g. Baiya i ken kamap kisim, o yumi salim long PMV bus, K5 chanis...' value={form.shippingInfo} onChange={e => f('shippingInfo', e.target.value)} />
            <p style={hint}>Tokim ol baiya olsem yu ken salim i go o ol mas kamap kisim.</p>
          </div>
        </div>

        <button type='submit' disabled={loading} style={{
          width: '100%', padding: '16px', background: loading ? '#d32f2f99' : '#af101a',
          color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px',
          fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: "'Be Vietnam Pro', sans-serif"
        }}>
          {loading ? 'Putim i go...' : '?? Putim Samting Nau'}
        </button>
      </form>
    </div>
  )
}
