import Link from 'next/link'
import { supabase } from '@/lib/supabase'

async function getFeaturedBrands() {
  const { data } = await supabase
    .from('brands')
    .select(`
      id, name, logo,
      brand_category(category(name))
    `)
    .order('id', { ascending: false })
    .limit(6)
  return data ?? []
}

export default async function HomePage() {
  const brands = await getFeaturedBrands()

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        height: '90vh',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Background image — replace with your own in /public/hero.jpg */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/closet-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }} />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 100%)',
          zIndex: 1,
        }} />

        {/* Hero content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 1.5rem',
          animation: 'fadeUp 0.8s ease both',
        }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: '2rem',
          }}>
            Connect Through<br />
            <em style={{ fontStyle: 'italic', fontWeight: 400 }}>Style</em>
          </h1>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/brands" style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'rgba(255,255,255,0.95)',
              color: 'var(--burgundy)',
              border: '2px solid rgba(255,255,255,0.95)',
              borderRadius: '2px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'var(--transition)',
            }}>
              Discover Kenyan Brands
            </Link>

            <Link href="/add-brand" style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              background: 'transparent',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.7)',
              borderRadius: '2px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'var(--transition)',
            }}>
              Add Your Brand
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED BRANDS ── */}
      <section style={{
        maxWidth: '1200px',
        margin: '5rem auto',
        padding: '0 2rem',
      }}>
        {/* Section label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}>
          <span style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: 'var(--burgundy)',
            display: 'inline-block',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--burgundy)',
          }}>
            Featured
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--burgundy)', opacity: 0.2 }} />
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'var(--charcoal)',
            lineHeight: 1.1,
          }}>
            Brands to Know
          </h2>
          <Link href="/brands" style={{
            fontSize: '0.82rem',
            color: 'var(--burgundy)',
            textDecoration: 'none',
            fontWeight: 500,
            letterSpacing: '0.05em',
            borderBottom: '1px solid var(--burgundy)',
            paddingBottom: '2px',
            transition: 'var(--transition)',
          }}>
            View all brands →
          </Link>
        </div>

        {brands.length > 0 ? (
          <div className="brands-home-grid">
            {brands.map((brand: any, i: number) => {
              const cats = brand.brand_category
                ?.map((bc: any) => bc.category?.name)
                .filter(Boolean) ?? []

              return (
                <div key={brand.id} className="brand-home-card" style={{
                  animationDelay: `${i * 0.06}s`,
                }}>
                  <div style={{
                    height: '180px',
                    overflow: 'hidden',
                    background: 'var(--cream-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {brand.logo ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${brand.logo}`}
                        alt={brand.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="brand-card-img"
                      />
                    ) : (
                      <span style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: 'rgba(128,7,7,0.18)',
                      }}>
                        {brand.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '1.2rem 1.3rem 1.4rem' }}>
                    <h3 style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: 'var(--charcoal)',
                      marginBottom: '0.4rem',
                      transition: 'color 0.25s',
                    }} className="brand-card-name">
                      {brand.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {cats.slice(0, 3).map((cat: string) => (
                        <span key={cat} style={{
                          background: 'var(--burgundy-mist)',
                          color: 'var(--burgundy)',
                          padding: '0.18rem 0.65rem',
                          borderRadius: '50px',
                          fontSize: '0.68rem',
                          fontWeight: 500,
                          letterSpacing: '0.06em',
                        }}>
                          {cat}
                        </span>
                      ))}
                    </div>
                    <Link href={`/brands/${brand.id}`} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      width: '100%',
                      padding: '0.65rem',
                      background: 'transparent',
                      color: 'var(--burgundy)',
                      border: '1.5px solid rgba(128,7,7,0.25)',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'var(--transition)',
                      letterSpacing: '0.04em',
                    }} className="brand-view-btn">
                      View Brand →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--white)',
            borderRadius: 'var(--card-radius)',
            border: '1px dashed rgba(128,7,7,0.15)',
          }}>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>No brands yet — be the first!</p>
            <Link href="/add-brand" style={{
              display: 'inline-block',
              padding: '0.7rem 1.8rem',
              background: 'var(--burgundy)',
              color: 'white',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}>
              Add Your Brand
            </Link>
          </div>
        )}
      </section>

      {/* ── PINTEREST LOOKBOOK ── */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 5rem',
        padding: '0 2rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}>
          <span style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: 'var(--burgundy)',
            display: 'inline-block',
          }} />
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--burgundy)',
          }}>
            Lookbook
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--burgundy)', opacity: 0.2 }} />
        </div>

        <h2 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          color: 'var(--charcoal)',
          marginBottom: '2rem',
        }}>
          Style Inspiration
        </h2>

        {/* Pinterest widget — same as your original */}
        <a
          data-pin-do="embedBoard"
          data-pin-board-width="800"
          data-pin-scale-height="400"
          data-pin-scale-width="80"
          href="https://www.pinterest.com/ClosetCulture/kenyan-fashion/"
        />
        <script async defer src="//assets.pinterest.com/js/pinit.js" />
      </section>

      <style>{`
        .brands-home-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .brand-home-card {
          background: var(--white);
          border-radius: var(--card-radius);
          overflow: hidden;
          border: 1px solid rgba(128,7,7,0.07);
          box-shadow: 0 2px 14px rgba(128,7,7,0.05);
          transition: var(--transition);
          animation: fadeUp 0.55s ease both;
        }
        .brand-home-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 36px rgba(128,7,7,0.13);
        }
        .brand-home-card:hover .brand-card-img { transform: scale(1.05); }
        .brand-home-card:hover .brand-card-name { color: var(--burgundy); }
        .brand-view-btn:hover {
          background: var(--burgundy) !important;
          color: white !important;
          border-color: var(--burgundy) !important;
        }
        @media (max-width: 1024px) {
          .brands-home-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .brands-home-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
