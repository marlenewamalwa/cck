'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function FeaturedBrands() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('brands')
        .select('id, name, logo, brand_category(category(name))')
        .eq('is_approved', true)
        .order('id', { ascending: false })
        .limit(6)
      setBrands(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center' as const, padding: '3rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
      Loading brands…
    </div>
  )

  if (brands.length === 0) return (
    <div style={{ textAlign: 'center' as const, padding: '4rem 2rem', background: 'var(--white)', borderRadius: 'var(--card-radius)', border: '1px dashed rgba(128,7,7,0.15)' }}>
      <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>No brands yet — be the first!</p>
      <Link href="/add-brand" style={{ display: 'inline-block', padding: '0.7rem 1.8rem', background: 'var(--burgundy)', color: 'white', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>
        Add Your Brand
      </Link>
    </div>
  )

  return (
    <>
      <div className="brands-home-grid">
        {brands.map((brand: any, i: number) => {
          const cats = brand.brand_category?.map((bc: any) => bc.category?.name).filter(Boolean) ?? []
          return (
            <div key={brand.id} className="brand-home-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <div style={{ height: 180, overflow: 'hidden', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {brand.logo ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${brand.logo}`}
                    alt={brand.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="brand-card-img"
                  />
                ) : (
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 700, color: 'rgba(128,7,7,0.18)' }}>
                    {brand.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div style={{ padding: '1.2rem 1.3rem 1.4rem' }}>
                <h3 className="brand-card-name" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.4rem', transition: 'color 0.25s' }}>
                  {brand.name}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.35rem', marginBottom: '1rem' }}>
                  {cats.slice(0, 3).map((cat: string) => (
                    <span key={cat} style={{ background: 'var(--burgundy-mist)', color: 'var(--burgundy)', padding: '0.18rem 0.65rem', borderRadius: 50, fontSize: '0.68rem', fontWeight: 500 }}>
                      {cat}
                    </span>
                  ))}
                </div>
                <Link href={`/brands/${brand.id}`} className="brand-view-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.65rem', background: 'transparent', color: 'var(--burgundy)', border: '1.5px solid rgba(128,7,7,0.25)', borderRadius: 50, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', transition: 'var(--transition)' }}>
                  View Brand →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .brands-home-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .brand-home-card { background: var(--white); border-radius: var(--card-radius); overflow: hidden; border: 1px solid rgba(128,7,7,0.07); box-shadow: 0 2px 14px rgba(128,7,7,0.05); transition: var(--transition); animation: fadeUp 0.55s ease both; }
        .brand-home-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(128,7,7,0.13); }
        .brand-home-card:hover .brand-card-img { transform: scale(1.05); }
        .brand-home-card:hover .brand-card-name { color: var(--burgundy); }
        .brand-view-btn:hover { background: var(--burgundy) !important; color: white !important; border-color: var(--burgundy) !important; }
        @media (max-width: 1024px) { .brands-home-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .brands-home-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}