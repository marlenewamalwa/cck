import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--burgundy-dark)',
      color: 'rgba(255,255,255,0.9)',
      padding: '3.5rem 2rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr',
        gap: '3rem',
        maxWidth: '1200px',
        margin: '0 auto 2.5rem',
      }} className="footer-grid">
        <div>
          <h2 style={{
            fontFamily: 'Agbalumo, cursive',
            fontSize: '1.8rem',
            color: 'white',
            marginBottom: '0.8rem',
          }}>
            Closet Culture
          </h2>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.6)' }}>
            Your ultimate destination for Kenyan fashion, styling, and brand discovery.
          </p>
        </div>

        <div>
          <h3 style={{
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: '1.2rem',
          }}>
            Quick Links
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { href: '/add-brand', label: 'Submit Your Brand' },
              { href: '/brands', label: 'Brands Directory' },
              { href: '/contact', label: 'Contact Us' },
              { href: '/about', label: 'About Us' },
              { href: '/terms', label: 'Terms & Conditions' },
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/faq', label: 'FAQs' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.88rem',
                  transition: 'color 0.25s',
                  textDecoration: 'none',
                }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 style={{
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: '1.2rem',
          }}>
            Follow Us
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { href: 'https://www.instagram.com/closetculturekenya/', label: 'Instagram' },
              { href: 'https://www.pinterest.com/ClosetCulture/', label: 'Pinterest' },
              { href: 'https://www.tiktok.com/@closetcultureke', label: 'TikTok' },
            ].map(({ href, label }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.88rem',
                  transition: 'color 0.25s',
                  textDecoration: 'none',
                }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 1.5rem',
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
      }} />

      <p style={{
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.05em',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        © {new Date().getFullYear()} Closet Culture. All rights reserved.
      </p>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
