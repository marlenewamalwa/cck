import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' as const }}>
      <div style={{ animation: 'fadeUp 0.6s ease both' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(6rem, 15vw, 10rem)', fontWeight: 700, color: 'var(--cream-dark)', lineHeight: 1, marginBottom: '0' }}>
          404
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '1rem', marginTop: '-1rem' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '380px', margin: '0 auto 2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <Link href="/" style={{ padding: '0.85rem 2rem', background: 'var(--burgundy)', color: 'white', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', letterSpacing: '0.05em' }}>
            Go Home
          </Link>
          <Link href="/brands" style={{ padding: '0.85rem 2rem', background: 'transparent', color: 'var(--burgundy)', border: '1.5px solid rgba(128,7,7,0.3)', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', letterSpacing: '0.05em' }}>
            Browse Brands
          </Link>
        </div>
      </div>
    </div>
  )
}