'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Category = { id: number; name: string }

export default function AddBrandPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    website: '',
    location_type: 'online',
    stock_type: 'both',
    selectedCategories: [] as number[],
  })

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setUser(session.user)
    })
  }, [router])

  // Fetch categories
  useEffect(() => {
    supabase.from('category').select('id, name').order('name').then(({ data }) => {
      setCategories(data ?? [])
    })
  }, [])

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
    if (!user) return
    if (form.selectedCategories.length === 0) {
      setError('Please select at least one category.')
      return
    }
    setLoading(true)
    setError('')

    try {
      // 1. Upload logo to Supabase Storage
      let logoPath = ''
      if (logoFile) {
        const ext = logoFile.name.split('.').pop()
        const fileName = `logo_${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, logoFile, { upsert: false })
        if (uploadError) throw new Error('Logo upload failed.')
        logoPath = fileName
      }

      // 2. Insert brand
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .insert({
          name: form.name,
          description: form.description,
          website: form.website,
          logo: logoPath,
          user_id: user.id,
          location_type: form.location_type,
          stock_type: form.stock_type,
        })
        .select()
        .single()

      if (brandError) throw new Error(brandError.message)

      // 3. Insert brand_category rows
      const catRows = form.selectedCategories.map(cat_id => ({
        brand_id: brand.id,
        category_id: cat_id,
      }))
      await supabase.from('brand_category').insert(catRows)

      setSubmitted(true)
window.scrollTo({ top: 0, behavior: 'smooth' })
setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '0 1.5rem 5rem', animation: 'fadeUp 0.6s ease both' }}>
{submitted && (
  <div style={{ maxWidth: '640px', margin: '6rem auto', padding: '0 1.5rem', textAlign: 'center' as const, animation: 'fadeUp 0.6s ease both' }}>
    <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '1rem' }}>
      Brand Submitted!
    </h1>
    <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
      Your brand has been received and is awaiting approval. We'll review it shortly and it will appear in the directory once approved.
    </p>
    <Link href="/brands" style={{ display: 'inline-block', padding: '0.85rem 2rem', background: 'var(--burgundy)', color: 'white', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>
      Browse Brands
    </Link>
  </div>
)}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--burgundy)' }}>Directory</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
          Add Your Brand
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Get your brand in front of Kenya's fashion community.
        </p>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2.5rem', boxShadow: '0 4px 30px rgba(128,7,7,0.07)' }}>

        {error && (
          <div style={{ background: 'rgba(128,7,7,0.07)', borderLeft: '3px solid var(--burgundy)', padding: '12px 16px', borderRadius: 4, fontSize: '0.85rem', color: 'var(--burgundy)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Brand Name */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Brand Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Zawadi Studio"
              required
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Tell us about your brand — what you sell, your story, your vibe…"
              required
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* Website */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Website or Instagram *</label>
            <input
              type="text"
              value={form.website}
              onChange={e => setForm({ ...form, website: e.target.value })}
              placeholder="https://instagram.com/yourbrand"
              required
              style={inputStyle}
            />
          </div>

          {/* Logo upload */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Logo / Brand Image *</label>
            <div style={{
              border: '2px dashed rgba(128,7,7,0.25)',
              borderRadius: 10,
              padding: '1.5rem',
              textAlign: 'center',
              background: 'var(--cream)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'border-color 0.25s',
            }}>
              {logoPreview ? (
                <div>
                  <img src={logoPreview} alt="preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 8, marginBottom: '0.8rem' }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Click below to change</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📸</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>Upload your logo or brand image</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(122,106,106,0.6)' }}>JPG, PNG, GIF — max 5MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* Location type */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Location</label>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {[
                { value: 'physical', label: '📍 Physical' },
                { value: 'hybrid',   label: '🔀 Hybrid' },
                { value: 'online',   label: '🌐 Online Only' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, location_type: value })}
                  style={{
                    ...pillBtn,
                    ...(form.location_type === value ? pillBtnActive : {}),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stock type */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Stock Type</label>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {[
                { value: 'new',    label: 'New' },
                { value: 'thrift', label: 'Thrift' },
                { value: 'both',   label: 'New & Thrift' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, stock_type: value })}
                  style={{
                    ...pillBtn,
                    ...(form.stock_type === value ? pillBtnActive : {}),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div style={fieldWrap}>
            <label style={labelStyle}>Categories * <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(select all that apply)</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map(cat => {
                const active = form.selectedCategories.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      ...pillBtn,
                      ...(active ? pillBtnActive : {}),
                    }}
                  >
                    {active ? '✓ ' : ''}{cat.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? 'var(--muted)' : 'var(--burgundy)',
              color: 'white',
              border: 'none',
              borderRadius: 50,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'background 0.25s',
            }}
          >
            {loading ? 'Submitting…' : 'Submit Brand'}
          </button>
        </form>
      </div>

      <style>{`
        input:focus, textarea:focus { border-color: var(--burgundy) !important; outline: none; background: rgba(128,7,7,0.02) !important; }
      `}</style>
    </div>
  )
}

const fieldWrap: React.CSSProperties = { marginBottom: '1.5rem' }

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 500,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  marginBottom: '0.6rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.85rem 1rem',
  border: '1.5px solid rgba(128,7,7,0.18)',
  borderRadius: 8,
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '0.92rem',
  color: 'var(--charcoal)',
  background: 'var(--cream)',
  boxSizing: 'border-box',
  transition: 'border-color 0.25s',
}

const pillBtn: React.CSSProperties = {
  padding: '0.4rem 1rem',
  border: '1.5px solid rgba(128,7,7,0.22)',
  borderRadius: 50,
  fontSize: '0.82rem',
  fontWeight: 500,
  color: 'var(--muted)',
  cursor: 'pointer',
  background: 'var(--cream)',
  transition: 'all 0.2s',
  fontFamily: 'DM Sans, sans-serif',
}

const pillBtnActive: React.CSSProperties = {
  background: 'var(--burgundy)',
  color: 'white',
  borderColor: 'var(--burgundy)',
}