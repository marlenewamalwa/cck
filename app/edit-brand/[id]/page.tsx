'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Category = { id: number; name: string }

export default function EditBrandPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const brandId = Number(params.id)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [currentLogo, setCurrentLogo] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    location_type: 'online',
    stock_type: 'both',
    selectedCategories: [] as number[],
  })

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const [{ data: brand }, { data: cats }, { data: brandCats }] = await Promise.all([
        supabase.from('brands').select('*').eq('id', brandId).eq('user_id', session.user.id).single(),
        supabase.from('category').select('id, name').order('name'),
        supabase.from('brand_category').select('category_id').eq('brand_id', brandId),
      ])

      if (!brand) { router.push('/profile'); return }

      setForm({
        name: brand.name,
        description: brand.description ?? '',
        website: brand.website ?? '',
        location_type: brand.location_type,
        stock_type: brand.stock_type,
        selectedCategories: brandCats?.map((bc: any) => bc.category_id) ?? [],
      })
      setCurrentLogo(brand.logo ?? '')
      if (brand.logo) setLogoPreview(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${brand.logo}`)
      setCategories(cats ?? [])
      setLoading(false)
    }
    load()
  }, [brandId, router])

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    setError('Logo must be under 2MB. Please compress your image and try again.')
    return
  }

  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowed.includes(file.type)) {
    setError('Only JPG, PNG, GIF or WebP images are allowed.')
    return
  }

  setLogoFile(file)
  setLogoPreview(URL.createObjectURL(file))
}

  function toggleCategory(id: number) {
    setForm(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter(c => c !== id)
        : [...prev.selectedCategories, id],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.selectedCategories.length === 0) { setError('Please select at least one category.'); return }
    setSaving(true)
    setError('')

    try {
      let logoPath = currentLogo
      if (logoFile) {
        const ext = logoFile.name.split('.').pop()
        const fileName = `logo_${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, logoFile)
        if (uploadError) throw new Error('Logo upload failed.')
        logoPath = fileName
      }

      await supabase.from('brands').update({
        name: form.name,
        description: form.description,
        website: form.website,
        location_type: form.location_type,
        stock_type: form.stock_type,
        logo: logoPath,
        is_approved: false, // reset approval on edit
      }).eq('id', brandId)

      await supabase.from('brand_category').delete().eq('brand_id', brandId)
      const catRows = form.selectedCategories.map(cat_id => ({ brand_id: brandId, category_id: cat_id }))
      await supabase.from('brand_category').insert(catRows)

      router.push('/profile')
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: 'var(--muted)' }}>Loading…</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1.5rem 5rem', animation: 'fadeUp 0.6s ease both' }}>
      <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: '2rem' }}>
        ← Back to Profile
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Edit</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1 }}>
          Edit Brand
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
          Note: editing your brand will reset its approval status.
        </p>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2.5rem', boxShadow: '0 4px 30px rgba(128,7,7,0.07)' }}>
        {error && (
          <div style={{ background: 'rgba(128,7,7,0.07)', borderLeft: '3px solid var(--burgundy)', padding: '12px 16px', borderRadius: 4, fontSize: '0.85rem', color: 'var(--burgundy)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Brand Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Website or Instagram *</label>
            <input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} required style={inputStyle} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Logo / Brand Image</label>
            <div style={{ border: '2px dashed rgba(128,7,7,0.25)', borderRadius: 10, padding: '1.5rem', textAlign: 'center' as const, background: 'var(--cream)', cursor: 'pointer', position: 'relative' }}>
              {logoPreview ? (
                <div>
                  <img src={logoPreview} alt="preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: '0.8rem' }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Click to change</p>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Click to upload a new logo</p>
              )}
              <input type="file" accept="image/*" onChange={handleLogoChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Location</label>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' as const }}>
              {[{ value: 'physical', label: 'Physical' }, { value: 'hybrid', label: 'Hybrid' }, { value: 'online', label: 'Online Only' }].map(({ value, label }) => (
                <button key={value} type="button" onClick={() => setForm({ ...form, location_type: value })} style={{ ...pillBtn, ...(form.location_type === value ? pillBtnActive : {}) }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Stock Type</label>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' as const }}>
              {[{ value: 'new', label: 'New' }, { value: 'thrift', label: 'Thrift' }, { value: 'both', label: 'New & Thrift' }].map(({ value, label }) => (
                <button key={value} type="button" onClick={() => setForm({ ...form, stock_type: value })} style={{ ...pillBtn, ...(form.stock_type === value ? pillBtnActive : {}) }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Categories *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
              {categories.map(cat => {
                const active = form.selectedCategories.includes(cat.id)
                return (
                  <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)} style={{ ...pillBtn, ...(active ? pillBtnActive : {}) }}>
                    {active ? '✓ ' : ''}{cat.name}
                  </button>
                )
              })}
            </div>
          </div>

          <button type="submit" disabled={saving} style={{ width: '100%', padding: '1rem', background: saving ? 'var(--muted)' : 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      <style>{`
        input:focus, textarea:focus { border-color: var(--burgundy) !important; outline: none; }
      `}</style>
    </div>
  )
}

const fieldWrap: React.CSSProperties = { marginBottom: '1.5rem' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.6rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.85rem 1rem', border: '1.5px solid rgba(128,7,7,0.18)', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', color: 'var(--charcoal)', background: 'var(--cream)', boxSizing: 'border-box', transition: 'border-color 0.25s' }
const pillBtn: React.CSSProperties = { padding: '0.4rem 1rem', border: '1.5px solid rgba(128,7,7,0.22)', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, color: 'var(--muted)', cursor: 'pointer', background: 'var(--cream)', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif' }
const pillBtnActive: React.CSSProperties = { background: 'var(--burgundy)', color: 'white', borderColor: 'var(--burgundy)' }