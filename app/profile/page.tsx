'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import FeaturedButton from '@/components/FeaturedButton'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      setProfile(profileData)
      setUsername(profileData?.username ?? '')

      const { data: brandsData } = await supabase
        .from('brands')
        .select('id, name, logo, location_type, stock_type, is_approved, is_featured')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      setBrands(brandsData ?? [])
      setLoading(false)
    })
  }, [router])

  async function saveUsername() {
    setSaving(true)
    await supabase.from('profiles').update({ username }).eq('id', user.id)
    setProfile({ ...profile, username })
    setEditing(false)
    setSaving(false)
  }

  async function deleteBrand(brandId: number) {
  await supabase.from('brand_category').delete().eq('brand_id', brandId)
  await supabase.from('brands').delete().eq('id', brandId)
  setBrands(brands.filter(b => b.id !== brandId))
  setDeleteConfirm(null)
  router.refresh()
}
async function deleteAccount() {
  setDeletingAccount(true)
  await supabase.from('brand_category').delete().eq('brand_id', brands.map((b: any) => b.id))
  await supabase.from('brands').delete().eq('user_id', user.id)
  await supabase.from('profiles').delete().eq('id', user.id)
  await supabase.auth.signOut()
  router.push('/')
}

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading…</p>
    </div>
  )

  const initials = (profile?.username || user?.email || 'U').substring(0, 2).toUpperCase()

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 2rem 6rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Account</span>
        </div>

      </div>

      {/* Profile card */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2rem 2.5rem', boxShadow: '0 4px 30px rgba(128,7,7,0.07)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' as const }}>
          {/* Avatar */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--burgundy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>
              {initials}
            </span>
          </div>
          

          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' as const }}>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ padding: '0.6rem 1rem', border: '1.5px solid rgba(128,7,7,0.3)', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', color: 'var(--charcoal)', background: 'var(--cream)', outline: 'none' }}
                />
                <button onClick={saveUsername} disabled={saving} style={{ padding: '0.6rem 1.2rem', background: 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} style={{ padding: '0.6rem 1rem', background: 'none', color: 'var(--muted)', border: '1px solid rgba(128,7,7,0.15)', borderRadius: 50, fontSize: '0.82rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' as const }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--charcoal)' }}>
                  {profile?.username || 'No username set'}
                </h2>
                <button onClick={() => setEditing(true)} style={{ padding: '0.3rem 0.9rem', background: 'none', color: 'var(--burgundy)', border: '1px solid rgba(128,7,7,0.3)', borderRadius: 50, fontSize: '0.75rem', cursor: 'pointer' }}>
                  Edit
                </button>
              </div>
            )}
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '0.3rem' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* My Brands */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2rem 2.5rem', boxShadow: '0 4px 30px rgba(128,7,7,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap' as const, gap: '1rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--charcoal)' }}>
            My Brands ({brands.length})
          </h2>
          <Link href="/add-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.3rem', background: 'var(--burgundy)', color: 'white', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none' }}>
            + Add Brand
          </Link>
        </div>

        {brands.length === 0 ? (
          <div style={{ textAlign: 'center' as const, padding: '3rem 1rem', border: '1px dashed rgba(128,7,7,0.15)', borderRadius: 12 }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>You haven't listed any brands yet.</p>
            <Link href="/add-brand" style={{ display: 'inline-block', padding: '0.7rem 1.8rem', background: 'var(--burgundy)', color: 'white', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>
              List Your First Brand
            </Link>
          </div>
          
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {brands.map((brand) => (
              <div key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1rem', border: '1px solid rgba(128,7,7,0.08)', borderRadius: 12, background: 'var(--cream)' }}>
                {/* Logo */}
                <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: 'var(--cream-dark)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {brand.logo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${brand.logo}`}
                      alt={brand.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(128,7,7,0.25)' }}>
                      {brand.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.2rem' }}>
                    {brand.name}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'capitalize' as const }}>
  {brand.location_type} · {brand.stock_type === 'both' ? 'New & Thrift' : brand.stock_type}
</p>
<span style={{
  display: 'inline-block',
  marginTop: '0.3rem',
  padding: '0.15rem 0.65rem',
  borderRadius: 50,
  fontSize: '0.65rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  ...(brand.is_approved
    ? { background: 'rgba(34,139,34,0.1)', color: '#226b22', border: '1px solid rgba(34,139,34,0.25)' }
    : { background: 'rgba(180,100,20,0.1)', color: '#8b5a00', border: '1px solid rgba(180,100,20,0.25)' }
  )
}}>
  {brand.is_approved ? 'Approved' : 'Pending Approval'}
</span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <FeaturedButton brandId={brand.id} isFeatured={brand.is_featured ?? false} />
                  <Link href={`/brands/${brand.id}`} style={{ padding: '0.5rem 1rem', border: '1px solid rgba(128,7,7,0.25)', borderRadius: 50, fontSize: '0.78rem', color: 'var(--burgundy)', textDecoration: 'none', fontWeight: 500 }}>
                    View
                  </Link>
                  <Link href={`/edit-brand/${brand.id}`} style={{ padding: '0.5rem 1rem', border: '1px solid rgba(128,7,7,0.25)', borderRadius: 50, fontSize: '0.78rem', color: 'var(--burgundy)', textDecoration: 'none', fontWeight: 500 }}>
                  Edit
                  </Link>
                  {deleteConfirm === brand.id ? (
                    <>
                      <button onClick={() => deleteBrand(brand.id)} style={{ padding: '0.5rem 1rem', background: '#b91c1c', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>
                        Confirm
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: '0.5rem 1rem', background: 'none', color: 'var(--muted)', border: '1px solid rgba(128,7,7,0.15)', borderRadius: 50, fontSize: '0.78rem', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setDeleteConfirm(brand.id)} style={{ padding: '0.5rem 1rem', background: 'none', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.25)', borderRadius: 50, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Danger Zone */}
<div style={{ marginTop: '2rem', background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2rem 2.5rem', boxShadow: '0 4px 30px rgba(128,7,7,0.07)', border: '1px solid rgba(185,28,28,0.15)' }}>
  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: '#b91c1c', marginBottom: '0.5rem' }}>
    Danger Zone
  </h2>
  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
    Deleting your account is permanent. All your brand listings will also be removed.
  </p>
  {deleteConfirm === -1 ? (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
      <button onClick={deleteAccount} disabled={deletingAccount} style={{ padding: '0.7rem 1.5rem', background: '#b91c1c', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
        {deletingAccount ? 'Deleting…' : 'Yes, delete my account'}
      </button>
      <button onClick={() => setDeleteConfirm(null)} style={{ padding: '0.7rem 1.2rem', background: 'none', color: 'var(--muted)', border: '1px solid rgba(128,7,7,0.15)', borderRadius: 50, fontSize: '0.85rem', cursor: 'pointer' }}>
        Cancel
      </button>
    </div>
  ) : (
    <button onClick={() => setDeleteConfirm(-1)} style={{ padding: '0.7rem 1.5rem', background: 'none', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.3)', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
      Delete My Account
    </button>
  )}
</div>
    </div>
  )
}