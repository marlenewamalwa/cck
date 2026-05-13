import { supabase } from '@/lib/supabase'
import ReviewForm from '@/components/ReviewForm'
import Link from 'next/link'

const LOCATION_MAP: Record<string, { label: string }> = {
  physical: { label: 'Physical Store' },
  hybrid:   { label: 'Physical + Online' },
  online:   { label: 'Online Only' },
}

const STOCK_MAP: Record<string, { label: string; color: string }> = {
  new:    { label: 'New Stock',    color: '#226b22' },
  thrift: { label: 'Thrift',       color: '#8b5a00' },
  both:   { label: 'New & Thrift', color: '#800707' },
}

export default async function BrandPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)

  const { data: brand, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !brand) return <div style={{ padding: '4rem 2rem', textAlign: 'center' as const }}>Brand not found</div>

  const { data: brandCategories } = await supabase
    .from('brand_category')
    .select('category(id, name)')
    .eq('brand_id', id)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('brand_id', id)
    .order('created_at', { ascending: false })

  const cats = brandCategories?.map((bc: any) => bc.category?.name).filter(Boolean) ?? []
  const loc = LOCATION_MAP[brand.location_type]
  const stock = STOCK_MAP[brand.stock_type]
  const allReviews = reviews ?? []
  const avgRating = allReviews.length
    ? (allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : null

  return (
    <>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem 5rem' }}>

        <Link href="/brands" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Directory
        </Link>

        {/* HERO CARD */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', overflow: 'hidden', boxShadow: '0 4px 30px rgba(128,7,7,0.08)', marginBottom: '2rem' }}>

          {/* Banner */}
          <div style={{ height: '180px', background: 'var(--cream-dark)', position: 'relative', overflow: 'hidden' }}>
            {brand.logo && (
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${brand.logo}`}
                alt={brand.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }}
              />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--cream-dark) 0%, rgba(128,7,7,0.08) 100%)' }} />
          </div>

          <div style={{ padding: '0 2.5rem 2.5rem' }}>
            {/* Logo */}
            <div style={{ width: 110, height: 110, borderRadius: 12, border: '3px solid white', background: 'var(--cream)', overflow: 'hidden', marginTop: -55, marginBottom: '1.2rem', boxShadow: '0 4px 20px rgba(128,7,7,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {brand.logo ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${brand.logo}`}
                  alt={brand.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 700, color: 'rgba(128,7,7,0.2)' }}>
                  {brand.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="brand-header">
              <div>
                <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '0.6rem' }}>
                  {brand.name}
                </h1>

                {/* Category pills */}
                {cats.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {cats.map((cat: string) => (
                      <span key={cat} style={{ background: 'var(--burgundy-mist)', color: 'var(--burgundy)', padding: '0.22rem 0.75rem', borderRadius: 50, fontSize: '0.72rem', fontWeight: 500 }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  {loc && <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{loc.label}</span>}
                  {stock && <span style={{ fontSize: '0.85rem', fontWeight: 500, color: stock.color }}>● {stock.label}</span>}
                  {avgRating && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      ★ {avgRating} ({allReviews.length} review{allReviews.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>

              {brand.website && (
                <a
                  href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', background: 'var(--burgundy)', color: 'white', borderRadius: 50, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  Visit Brand ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ABOUT */}
        {brand.description && (
          <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2rem 2.5rem', marginBottom: '2rem', boxShadow: '0 2px 14px rgba(128,7,7,0.05)' }}>
            <h2 style={sectionHeading}>About</h2>
            <p style={{ fontSize: '0.97rem', color: 'var(--muted)', lineHeight: 1.8 }}>{brand.description}</p>
          </div>
        )}

        {/* REVIEWS */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2rem 2.5rem', boxShadow: '0 2px 14px rgba(128,7,7,0.05)' }}>
          <h2 style={sectionHeading}>Reviews {allReviews.length > 0 ? `(${allReviews.length})` : ''}</h2>

          {allReviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
              {allReviews.map((review: any) => (
                <div key={review.id} style={{ borderBottom: '1px solid rgba(128,7,7,0.07)', paddingBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#f5a623', letterSpacing: '-1px' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {new Date(review.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {review.review && (
                    <p style={{ fontSize: '0.92rem', color: 'var(--charcoal)', lineHeight: 1.7 }}>{review.review}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>No reviews yet — be the first!</p>
          )}

          <ReviewForm brandId={brand.id} />
        </div>
      </div>

      <style>{`
        .brand-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
        @media (max-width: 600px) { .brand-header { flex-direction: column; } }
      `}</style>
    </>
  )
}

const sectionHeading: React.CSSProperties = {
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'var(--charcoal)',
  marginBottom: '1rem',
}