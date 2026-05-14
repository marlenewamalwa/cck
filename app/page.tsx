import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import PinterestBoard from '@/components/PinterestBoard'
import FeaturedBrands from '@/components/FeaturedBrands'

async function getFeaturedBrands() {
  const { data } = await supabase
    .from('brands')
    .select(`
      id, name, logo,
      brand_category(category(name))`)
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
          backgroundImage: 'url(/closet-hero.webp)',
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
            Featured Brands
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--burgundy)', opacity: 0.2 }} />
        </div>

      <FeaturedBrands />
        
      </section>
       
        {/* Pinterest widget — same as your original */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
  <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>
    Lookbook
  </span>
  <div style={{ flex: 1, height: '1px', background: 'var(--burgundy)', opacity: 0.2 }} />
</div>

       <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        
       <PinterestBoard />
        </div>
    
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
