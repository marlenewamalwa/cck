'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const ADMIN_EMAIL = 'closetcultureke@gmail.com' // replace with your actual email

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [brands, setBrands] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push('/')
        return
      }
      fetchBrands()
    })
  }, [router])

  async function fetchBrands() {
    const { data } = await supabase
      .from('brands')
      .select('id, name, logo, location_type, stock_type, is_approved, is_featured, created_at, website, description')
      .order('created_at', { ascending: false })
    setBrands(data ?? [])
    setLoading(false)
  }

  async function approveBrand(id: number) {
    await supabase.from('brands').update({ is_approved: true }).eq('id', id)
    setBrands(brands.map(b => b.id === id ? { ...b, is_approved: true } : b))
  }

  async function unapproveBrand(id: number) {
    await supabase.from('brands').update({ is_approved: false }).eq('id', id)
    setBrands(brands.map(b => b.id === id ? { ...b, is_approved: false } : b))
  }

  async function deleteBrand(id: number) {
    await supabase.from('brand_category').delete().eq('brand_id', id)
    await supabase.from('brands').delete().eq('id', id)
    setBrands(brands.filter(b => b.id !== id))
    setDeleteConfirm(null)
  }

  const filtered = brands
    .filter(b => {
      if (filter === 'pending') return !b.is_approved
      if (filter === 'approved') return b.is_approved
      return true
    })
    .filter(b => search ? b.name.toLowerCase().includes(search.toLowerCase()) : true)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: 'var(--muted)' }}>Loading…</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 2rem 6rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Admin</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: 'var(--charcoal)' }}>
          Brand Management
        </h1>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Total Brands', value: brands.length, color: 'var(--charcoal)' },
          { label: 'Pending Approval', value: brands.filter(b => !b.is_approved).length, color: '#8b5a00' },
          { label: 'Approved', value: brands.filter(b => b.is_approved).length, color: '#226b22' },
          { label: 'Featured', value: brands.filter(b => b.is_featured).length, color: '#8b6914' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--white)', borderRadius: 12, padding: '1.2rem 1.5rem', boxShadow: '0 2px 14px rgba(128,7,7,0.05)', textAlign: 'center' as const }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.3rem', letterSpacing: '0.05em' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '2rem 0 1.5rem', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['pending', 'approved', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.4rem 1rem', border: '1.5px solid rgba(128,7,7,0.22)', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', background: filter === f ? 'var(--burgundy)' : 'var(--cream)', color: filter === f ? 'white' : 'var(--muted)', borderColor: filter === f ? 'var(--burgundy)' : 'rgba(128,7,7,0.22)', textTransform: 'capitalize' as const }}>
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search brands…"
          style={{ flex: 1, minWidth: 180, padding: '0.5rem 1rem', border: '1.5px solid rgba(128,7,7,0.2)', borderRadius: 50, fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', background: 'var(--cream)', outline: 'none' }}
        />
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{filtered.length} brand{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Brands list */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', boxShadow: '0 4px 30px rgba(128,7,7,0.07)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center' as const, padding: '4rem 2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            No brands in this category.
          </div>
        ) : (
          filtered.map((brand, i) => (
            <div key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.8rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(128,7,7,0.07)' : 'none', flexWrap: 'wrap' as const }}>

              {/* Logo */}
              <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', background: 'var(--cream)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {brand.logo ? (
                  <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${brand.logo}`} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, color: 'rgba(128,7,7,0.25)' }}>
                    {brand.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '0.2rem' }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--charcoal)' }}>
                    {brand.name}
                  </h3>
                  {brand.is_featured && (
                    <span style={{ background: 'rgba(201,168,76,0.15)', color: '#8b6914', border: '1px solid rgba(201,168,76,0.4)', padding: '0.1rem 0.5rem', borderRadius: 50, fontSize: '0.62rem', fontWeight: 600 }}>
                      ★ Featured
                    </span>
                  )}
                  <span style={{ padding: '0.1rem 0.55rem', borderRadius: 50, fontSize: '0.62rem', fontWeight: 600, ...(brand.is_approved ? { background: 'rgba(34,139,34,0.1)', color: '#226b22', border: '1px solid rgba(34,139,34,0.25)' } : { background: 'rgba(180,100,20,0.1)', color: '#8b5a00', border: '1px solid rgba(180,100,20,0.25)' }) }}>
                    {brand.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'capitalize' as const }}>
                  {brand.location_type} · {brand.stock_type === 'both' ? 'New & Thrift' : brand.stock_type} · {new Date(brand.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' as const }}>
                <Link href={`/brands/${brand.id}`} target="_blank" style={{ padding: '0.45rem 0.9rem', border: '1px solid rgba(128,7,7,0.25)', borderRadius: 50, fontSize: '0.75rem', color: 'var(--burgundy)', textDecoration: 'none', fontWeight: 500 }}>
                  View
                </Link>

                {brand.is_approved ? (
                  <button onClick={() => unapproveBrand(brand.id)} style={{ padding: '0.45rem 0.9rem', background: 'none', color: '#8b5a00', border: '1px solid rgba(180,100,20,0.3)', borderRadius: 50, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
                    Unapprove
                  </button>
                ) : (
                  <button onClick={() => approveBrand(brand.id)} style={{ padding: '0.45rem 0.9rem', background: '#226b22', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
                    Approve
                  </button>
                )}

                {deleteConfirm === brand.id ? (
                  <>
                    <button onClick={() => deleteBrand(brand.id)} style={{ padding: '0.45rem 0.9rem', background: '#b91c1c', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
                      Confirm
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} style={{ padding: '0.45rem 0.9rem', background: 'none', color: 'var(--muted)', border: '1px solid rgba(128,7,7,0.15)', borderRadius: 50, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setDeleteConfirm(brand.id)} style={{ padding: '0.45rem 0.9rem', background: 'none', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.25)', borderRadius: 50, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        input:focus { border-color: var(--burgundy) !important; }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  )
}