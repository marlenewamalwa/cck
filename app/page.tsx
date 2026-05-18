import Link from 'next/link'
import FeaturedBrands from '@/components/FeaturedBrands'
import FeaturedStories from '@/components/FeaturedStories'
import PinterestBoard from '@/components/PinterestBoard'

export default function HomePage() {
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
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/closet-hero.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 100%)',
          zIndex: 1,
        }} />
        <div style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', padding: '0 1.5rem',
          animation: 'fadeUp 0.8s ease both',
        }}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 300, color: '#fff',
            lineHeight: 1.1, marginBottom: '2rem',
          }}>
            Connect Through<br />
            <em style={{ fontStyle: 'italic', fontWeight: 400 }}>Style</em>
          </h1>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/brands" style={{
              display: 'inline-block', padding: '1rem 2rem',
              background: 'rgba(255,255,255,0.95)', color: 'var(--burgundy)',
              border: '2px solid rgba(255,255,255,0.95)', borderRadius: '2px',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
              fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'var(--transition)',
            }}>
              Discover Kenyan Brands
            </Link>
            <Link href="/add-brand" style={{
              display: 'inline-block', padding: '1rem 2rem',
              background: 'transparent', color: '#fff',
              border: '2px solid rgba(255,255,255,0.7)', borderRadius: '2px',
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem',
              fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'var(--transition)',
            }}>
              Add Your Brand
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED BRANDS ── */}
      <section style={{ maxWidth: '1200px', margin: '5rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Featured Brands</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--burgundy)', opacity: 0.2 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap' as const, gap: '1rem' }}>
          <Link href="/brands" style={{ fontSize: '0.82rem', color: 'var(--burgundy)', fontWeight: 500, borderBottom: '1px solid var(--burgundy)', textDecoration: 'none', paddingBottom: 2 }}>
            View all brands →
          </Link>
        </div>
        <FeaturedBrands />
      </section>

      {/* ── LATEST STORIES ── */}
      <FeaturedStories />

      {/* ── PINTEREST LOOKBOOK ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 5rem', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Lookbook</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--burgundy)', opacity: 0.2 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PinterestBoard />
        </div>
      </section>
    </>
  )
}