import Link from 'next/link'
import { supabase } from '@/lib/supabase'

async function getBrands(
  search?: string,
  location_type?: string,
  stock_type?: string,
  category?: string
) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')

  console.log('DATA:', data)
  console.log('ERROR:', error)

  return data ?? []
}
async function getCategories() {
  const { data } = await supabase.from('category').select('id, name').order('name')
  return data ?? []
}

const LOCATION_LABELS: Record<string, string> = {
  physical: 'Physical',
  hybrid: 'Hybrid',
  online: 'Online Only',
}

const STOCK_STYLES: Record<string, React.CSSProperties> = {
  new:    { background: 'rgba(34,139,34,0.12)',  color: '#226b22', border: '1px solid rgba(34,139,34,0.25)' },
  thrift: { background: 'rgba(180,100,20,0.12)', color: '#8b5a00', border: '1px solid rgba(180,100,20,0.25)' },
  both:   { background: 'rgba(128,7,7,0.09)',    color: 'var(--burgundy)', border: '1px solid rgba(128,7,7,0.2)' },
}

const STOCK_LABELS: Record<string, string> = {
  new: 'New', thrift: 'Thrift', both: 'New & Thrift',
}

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; location_type?: string; stock_type?: string }
}) {
  const [brands, categories] = await Promise.all([
    getBrands(searchParams.search, searchParams.location_type, searchParams.stock_type, searchParams.category),
    getCategories(),
  ])

  return (
    <>
      {/* PAGE HEADER */}
      <div style={{ maxWidth: '1200px', margin: '2.5rem auto 0', padding: '0 2rem', animation: 'fadeUp 0.6s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Discover</span>
          <div style={{ flex: 1, height: 1, background: 'var(--burgundy)', opacity: 0.2 }} />
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
          Brand Directory
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--muted)' }}>
          Explore Kenya's finest fashion brands, curated for you.
        </p>
      </div>

      {/* FILTER BAR */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 2rem' }}>
        <form method="GET" action="/brands">
          <div style={{ background: 'var(--white)', border: '1px solid rgba(128,7,7,0.1)', borderRadius: 14, padding: '1.2rem 1.5rem', boxShadow: '0 2px 16px rgba(128,7,7,0.05)' }}>

            {/* Row 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <select name="category" defaultValue={searchParams.category ?? ''} style={selectStyle}>
                <option value="">All Categories</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>

              <input
                type="text"
                name="search"
                defaultValue={searchParams.search ?? ''}
                placeholder="Search brand name…"
                style={{ ...selectStyle, flex: 1, minWidth: 160, backgroundImage: 'none' }}
              />

              <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.4rem', background: 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                Search
              </button>

              {(searchParams.search || searchParams.category || searchParams.location_type || searchParams.stock_type) && (
                <a href="/brands" style={{ fontSize: '0.8rem', color: 'var(--muted)', padding: '0.5rem 0.8rem', borderRadius: 50, textDecoration: 'none' }}>
                  Clear ✕
                </a>
              )}
            </div>

            {/* Row 2 — pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={pillLabel}>Location:</span>
                {[['', 'All'], ['physical', '📍 Physical'], ['hybrid', '🔀 Hybrid'], ['online', '🌐 Online Only']].map(([val, lbl]) => (
                  <label key={val} style={{ ...pill, ...((searchParams.location_type ?? '') === val ? pillActive : {}) }}>
                    <input type="radio" name="location_type" value={val} defaultChecked={(searchParams.location_type ?? '') === val} style={{ display: 'none' }} />
                    {lbl}
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={pillLabel}>Stock:</span>
                {[['', 'All'], ['new', 'New'], ['thrift', 'Thrift'], ['both', 'New & Thrift']].map(([val, lbl]) => (
                  <label key={val} style={{ ...pill, ...((searchParams.stock_type ?? '') === val ? pillActive : {}) }}>
                    <input type="radio" name="stock_type" value={val} defaultChecked={(searchParams.stock_type ?? '') === val} style={{ display: 'none' }} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* RESULTS */}
      <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
          Showing <strong style={{ color: 'var(--burgundy)' }}>{brands.length}</strong> brand{brands.length !== 1 ? 's' : ''}
        </span>
        <Link href="/add-brand" style={{ fontSize: '0.82rem', color: 'var(--burgundy)', fontWeight: 500, borderBottom: '1px solid var(--burgundy)', textDecoration: 'none' }}>
          + Add your brand
        </Link>
      </div>

      {/* GRID */}
      <div style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 2rem 4rem' }}>
        {brands.length > 0 ? (
          <div className="brands-grid">
            {brands.map((brand: any, i: number) => {
              const cats = brand.brand_category?.map((bc: any) => bc.category?.name).filter(Boolean) ?? []
              return (
                <div key={brand.id} className="brand-card" style={{ animationDelay: `${Math.min(i, 7) * 0.04}s` }}>
                  <div style={{ height: 160, overflow: 'hidden', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {brand.logo ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${brand.logo}`}
                        alt={brand.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="brand-img"
                      />
                    ) : (
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', fontWeight: 700, color: 'rgba(128,7,7,0.18)' }}>
                        {brand.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}>
                      {LOCATION_LABELS[brand.location_type] && (
                        <span style={{ background: 'rgba(255,255,255,0.88)', color: 'var(--burgundy)', border: '1px solid rgba(128,7,7,0.18)', padding: '0.22rem 0.55rem', borderRadius: 50, fontSize: '0.63rem', fontWeight: 600 }}>
                          {LOCATION_LABELS[brand.location_type]}
                        </span>
                      )}
                      {STOCK_LABELS[brand.stock_type] && (
                        <span style={{ ...STOCK_STYLES[brand.stock_type], padding: '0.22rem 0.55rem', borderRadius: 50, fontSize: '0.63rem', fontWeight: 600 }}>
                          {STOCK_LABELS[brand.stock_type]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '1.2rem 1.3rem 1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 className="brand-name" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.4rem', transition: 'color 0.25s' }}>
                      {brand.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.1rem', flex: 1 }}>
                      {cats.map((cat: string) => (
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
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--burgundy)', fontSize: '2rem', marginBottom: '0.7rem' }}>No Brands Found</h2>
            <p style={{ color: 'var(--muted)' }}>Try adjusting your filters or search term.</p>
            <a href="/brands" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.7rem 1.8rem', background: 'var(--burgundy)', color: 'white', borderRadius: 50, textDecoration: 'none', fontSize: '0.85rem' }}>
              View All Brands
            </a>
          </div>
        )}
      </div>

      <style>{`
        .brands-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .brand-card { background: var(--white); border-radius: var(--card-radius); overflow: hidden; border: 1px solid rgba(128,7,7,0.07); box-shadow: 0 2px 14px rgba(128,7,7,0.05); transition: var(--transition); display: flex; flex-direction: column; animation: fadeUp 0.55s ease both; }
        .brand-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(128,7,7,0.13); }
        .brand-card:hover .brand-img { transform: scale(1.05); }
        .brand-card:hover .brand-name { color: var(--burgundy); }
        .brand-view-btn:hover { background: var(--burgundy) !important; color: white !important; border-color: var(--burgundy) !important; }
        @media (max-width: 1024px) { .brands-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .brands-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .brands-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}

const selectStyle: React.CSSProperties = {
  padding: '0.6rem 1rem', border: '1.5px solid rgba(128,7,7,0.2)',
  borderRadius: 50, fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem',
  color: 'var(--charcoal)', background: 'var(--cream)', outline: 'none',
}
const pillLabel: React.CSSProperties = {
  fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap',
}
const pill: React.CSSProperties = {
  display: 'inline-block', padding: '0.3rem 0.85rem',
  border: '1.5px solid rgba(128,7,7,0.22)', borderRadius: 50,
  fontSize: '0.78rem', fontWeight: 500, color: 'var(--muted)',
  cursor: 'pointer', background: 'var(--cream)', userSelect: 'none', whiteSpace: 'nowrap',
}
const pillActive: React.CSSProperties = {
  background: 'var(--burgundy)', color: 'white', borderColor: 'var(--burgundy)',
}