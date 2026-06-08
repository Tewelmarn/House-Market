'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const PNG_CATEGORIES = [
  'Kaikai na Gaden (Food & Agriculture)',
  'Laplap na Glas (Clothing & Fashion)',
  'Haus na Hardware (Building & Hardware)',
  'Elektronik (Electronics)',
  'Handicraft na Arts',
  'Sios na Wholesale (Retail & Wholesale)',
  'Wok na Sevis (Services)',
  'Transpo na Logistics',
  'Narapela (Other)',
]

const input: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e4e2df', background: '#fff', fontSize: '15px', color: '#1b1c1a', outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#1b1c1a', marginBottom: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }

export default function NewShopPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', description: '', category: '', location: '', whatsapp: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/shops', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.error?.formErrors?.[0] || 'Bagarap! House Market i no bin openim. Traim gen.'); setLoading(false); return }
    router.push('/dashboard/shops')
  }

  return (
    <div style={{ maxWidth: '620px' }}>
      <Link href='/dashboard/shops' style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5b403d', textDecoration: 'none', marginBottom: '24px', fontSize: '14px' }}>
        <ArrowLeft size={16} /> Bek long House Markets
      </Link>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>??</div>
        <h1 style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '32px', fontWeight: 800, color: '#1b1c1a', margin: '0 0 8px' }}>Openim Nupela House Market</h1>
        <p style={{ color: '#5b403d', fontSize: '15px' }}>Setim ap ples bilong yu long House Market PNG na stat skelim ol samting bilong yu.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #e4e2df', boxShadow: '0 2px 12px rgba(78,52,46,0.08)' }}>
        {error && <div style={{ background: '#ffdad6', color: '#93000a', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>?? {error}</div>}

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Nem bilong House Market *</label>
          <input style={input} placeholder='e.g. Wagi Fresh Market, Lae Bila Store' value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <p style={{ fontSize: '12px', color: '#8f6f6c', marginTop: '4px' }}>Givim strongpela nem bai ol manmeri i save gut long yu.</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Kategori *</label>
          <select style={input} value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
            <option value=''>Makim kategori bilong yu</option>
            {PNG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Tokim ol manmeri long House Market bilong yu</label>
          <textarea style={{...input, height: '100px', resize: 'vertical'}} placeholder='Wanem samting yu skelim? Husat bai baim? Wanem taim yu openap?' value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Ples (Location)</label>
          <input style={input} placeholder='e.g. Gordons Market NCD, Lae City Morobe' value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={labelStyle}>WhatsApp Namba</label>
          <input style={input} placeholder='+675 7XXX XXXX' value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} />
          <p style={{ fontSize: '12px', color: '#8f6f6c', marginTop: '4px' }}>Ol baiya bai ringin yu stret long WhatsApp.</p>
        </div>

        <button type='submit' disabled={loading} style={{
          width: '100%', padding: '15px', background: loading ? '#d32f2f99' : '#af101a',
          color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px',
          fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: '-0.01em'
        }}>
          {loading ? 'Openap i go...' : '?? Openim House Market Nau'}
        </button>
      </form>
    </div>
  )
}
