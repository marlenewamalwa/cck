import Link from 'next/link'
import { supabase } from '@/lib/supabase'

async function getBrands(filters: {
  category?: string
  search?: string
  location_type?: string
  stock_type?: string
}) {
  let query = supabase
    .from('brands')
    .select(`id, name, logo, location_type, stock_type, brand_category(category(id, name))`)
    .order('name')

  if (filters.search) query = query.ilike('name', `%${filters.search}%`)
  if (filters.location_type) query = query.eq('location_type', filters.location_type)
  if (filters.stock_type) query = query.eq('stock_type', filters.stock_type)

  const { data } = await query
  let brands = data ?? []

  // Filter by category (junction table — easier client-side)
  if (filters.category) {
    brands = brands.filter((b: any) =>
      b.brand_category?.some((bc: any) => String(bc.category?.id) === filters.category)
    )
  }

  return brands
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

const STOCK_LABELS: Record<string, { label: string; cls: string }> = {
  new:    { label: 'New',          cls: 'badge-new' },
  thrift: { label: 'Thrift',       cls: 'badge-thrift' },
  both:   { label: 'New & Thrift', cls: 'badge-both' },
}

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; location_type?: string; stock_type?: string }
}) {
  const [brands, categories] = await Promise.all([
    getBrands(searchParams),
    getCategories(),
  ])

  const activeFilterCount = [
    searchParams.category,
    searchParams.location_type,
    searchParams.stock_type,
  ].filter(Boolean).length

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div style={{ maxWidth: '1200px', margin: '2.5rem auto 0', padding: '0 2rem', animation: 'fadeUp 0.6s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--burgundy)' }}>Discover</span>
          <div style={{ flex: 1, height: 1, background: 'var(--burgundy)', opacity: 0.2 }} />
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
          Brand Directory
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Explore Kenya's finest fashion brands, curated for you.
        </p>
      </div>

      {/* ── FILTER BAR ── */}
      <div style={{ maxWidth: '100%', margin: '2.2rem auto 0', padding: '0 2rem', animation: 'fadeUp 0.6s 0.08s ease both' }}>
        <div style={{ background: 'var(--white)', border: '1px solid rgba(128,7,7,0.1)', borderRadius: 14, padding: '1.1rem 1.4rem', boxShadow: '0 2px 16px rgba(128,7,7,0.05)' }}>
          <form method="GET" action="/brands">

            {/* Row 1 — category + search + submit */}
            <div className="filter-row-1">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 160 }}>
                <label style={labelStyle}>Category</label>
                <select name="category" defaultValue={searchParams.category ?? ''} style={selectStyle}>
                  <option value="">All Categories</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ width: 1, height: 28, background: 'rgba(128,7,7,0.12)', flexShrink: 0 }} className="filter-divider" />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 160 }}>
                <label style={labelStyle}>Search</label>
                <input
                  type="text"
                  name="search"
                  defaultValue={searchParams.search ?? ''}
                  placeholder="Brand name…"
                  style={{ ...selectStyle, backgroundImage: 'none' }}
                />
              </div>

              <button type="submit" style={submitBtnStyle}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                Search
              </button>

              {activeFilterCount > 0 || searchParams.search ? (
                <a href="/brands" style={{ fontSize: '0.8rem', color: 'var(--muted)', padding: '0.5rem 0.8rem', borderRadius: 50, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Clear ✕
                </a>
              ) : null}
            </div>

            {/* Row 2 — location + stock pills */}
            <div className="filter-row-2">
              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={pillLabelStyle}>Location:</span>
                {[['', 'All'], ['physical', '📍 Physical'], ['hybrid', '🔀 Hybrid'], ['online', '🌐 Online Only']].map(([val, lbl]) => (
                  <label key={val} style={{
                    ...pillStyle,
                    ...(( searchParams.location_type ?? '') === val ? pillActiveStyle : {}),
                  }}>
                    <input type="radio" name="location_type" value={val} defaultChecked={(searchParams.location_type ?? '') === val} style={{ display: 'none' }} />
                    {lbl}
                  </label>
                ))}
              </div>

              <div style={{ width: 1, height: 28, background: 'rgba(128,7,7,0.12)', flexShrink: 0 }} className="filter-divider" />

              {/* Stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={pillLabelStyle}>Stock:</span>
                {[['', 'All'], ['new', 'New'], ['thrift', 'Thrift'], ['both', 'New & Thrift']].map(([val, lbl]) => (
                  <label key={val} style={{
                    ...pillStyle,
                    ...((searchParams.stock_type ?? '') === val ? pillActiveStyle : {}),
                  }}>
                    <input type="radio" name="stock_type" value={val} defaultChecked={(searchParams.stock_type ?? '') === val} style={{ display: 'none' }} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── RESULTS COUNT ── */}
      <div style={{ maxWidth: '1200px', margin: '1.8rem auto 0', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
          Showing <strong style={{ color: 'var(--burgundy)', fontWeight: 500 }}>{brands.length}</strong> brand{brands.length !== 1 ? 's' : ''}
          {searchParams.search ? <> matching "<strong>{searchParams.search}</strong>"</> : null}
        </span>
        <Link href="/add-brand" style={{ fontSize: '0.82rem', color: 'var(--burgundy)', fontWeight: 500, borderBottom: '1px solid var(--burgundy)', paddingBottom: 2, textDecoration: 'none' }}>
          + Add your brand
        </Link>
      </div>

      {/* ── BRANDS GRID ── */}
      <div style={{ maxWidth: '100%', padding: '1.5rem 2rem 4rem' }}>
        {brands.length > 0 ? (
          <div className="brands-grid">
            {brands.map((brand: any, i: number) => {
              const cats = brand.brand_category?.map((bc: any) => bc.category?.name).filter(Boolean) ?? []
              const loc = LOCATION_LABELS[brand.location_type]
              const stock = STOCK_LABELS[brand.stock_type]

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

                    {/* Badges */}
                    <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                      {loc && (
                        <span style={{ ...badgeBase, background: 'rgba(255,255,255,0.88)', color: 'var(--burgundy)', border: '1px solid rgba(128,7,7,0.18)' }}>
                          {loc}
                        </span>
                      )}
                      {stock && (
                        <span style={{ ...badgeBase, ...badgeStockStyles[brand.stock_type] }}>
                          {stock.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '1.2rem 1.3rem 1.4rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 className="brand-name" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.4rem', lineHeight: 1.2, transition: 'color 0.25s' }}>
                      {brand.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.1rem', flex: 1 }}>
                      {cats.map((cat: string) => (
                        <span key={cat} style={{ background: 'var(--burgundy-mist)', color: 'var(--burgundy)', padding: '0.18rem 0.65rem', borderRadius: 50, fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.06em' }}>
                          {cat}
                        </span>
                      ))}
                    </div>
                    <Link href={`/brands/${brand.id}`} className="brand-view-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%', padding: '0.65rem', background: 'transparent', color: 'var(--burgundy)', border: '1.5px solid rgba(128,7,7,0.25)', borderRadius: 50, fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', transition: 'var(--transition)', letterSpacing: '0.04em' }}>
                      View Brand →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', gridColumn: '1/-1' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--burgundy)', fontSize: '2rem', marginBottom: '0.7rem' }}>No Brands Found</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Try adjusting your filters or search term.</p>
            <a href="/brands" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '0.7rem 1.8rem', background: 'var(--burgundy)', color: 'white', borderRadius: 50, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
              View All Brands
            </a>
          </div>
        )}
      </div>

      <style>{`
        .brands-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .brand-card {
          background: var(--white);
          border-radius: var(--card-radius);
          overflow: hidden;
          border: 1px solid rgba(128,7,7,0.07);
          box-shadow: 0 2px 14px rgba(128,7,7,0.05);
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.55s ease both;
        }
        .brand-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(128,7,7,0.13); }
        .brand-card:hover .brand-img { transform: scale(1.05); }
        .brand-card:hover .brand-name { color: var(--burgundy); }
        .brand-view-btn:hover { background: var(--burgundy) !important; color: white !important; border-color: var(--burgundy) !important; }

        .filter-row-1 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 0.85rem;
        }
        .filter-row-2 {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          flex-wrap: wrap;
        }

        @media (max-width: 1024px) { .brands-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .brands-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .filter-divider { display: none; }
          .filter-row-1, .filter-row-2 { gap: 0.5rem; }
        }
        @media (max-width: 480px) { .brands-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}

// ── Styles ──
const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap',
}
const selectStyle: React.CSSProperties = {
  flex: 1, padding: '0.6rem 1rem', border: '1.5px solid rgba(128,7,7,0.2)',
  borderRadius: 50, fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem',
  color: 'var(--charcoal)', background: 'var(--cream)', outline: 'none',
  WebkitAppearance: 'none', appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23800707' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.9rem center', paddingRight: '2.2rem',
}
const submitBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.6rem 1.4rem', background: 'var(--burgundy)', color: 'white',
  border: 'none', borderRadius: 50, fontFamily: 'DM Sans, sans-serif',
  fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.05em',
  cursor: 'pointer', whiteSpace: 'nowrap',
}
const pillLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap',
}
const pillStyle: React.CSSProperties = {
  display: 'inline-block', padding: '0.3rem 0.85rem',
  border: '1.5px solid rgba(128,7,7,0.22)', borderRadius: 50,
  fontSize: '0.78rem', fontWeight: 500, color: 'var(--muted)',
  cursor: 'pointer', background: 'var(--cream)', userSelect: 'none', whiteSpace: 'nowrap',
}
const pillActiveStyle: React.CSSProperties = {
  background: 'var(--burgundy)', color: 'white', borderColor: 'var(--burgundy)',
}
const badgeBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
  padding: '0.22rem 0.55rem', borderRadius: 50,
  fontSize: '0.63rem', fontWeight: 600, letterSpacing: '0.04em',
  backdropFilter: 'blur(6px)', whiteSpace: 'nowrap',
}
const badgeStockStyles: Record<string, React.CSSProperties> = {
  new:    { background: 'rgba(34,139,34,0.12)',  color: '#226b22', border: '1px solid rgba(34,139,34,0.25)' },
  thrift: { background: 'rgba(180,100,20,0.12)', color: '#8b5a00', border: '1px solid rgba(180,100,20,0.25)' },
  both:   { background: 'rgba(128,7,7,0.09)',    color: 'var(--burgundy)', border: '1px solid rgba(128,7,7,0.2)' },
}