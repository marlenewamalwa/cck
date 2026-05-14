export default function AboutPage() {
  return (
    <>
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem 6rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Our Story</span>
          </div>
          <p style={{ fontSize: '1.15rem', color: 'var(--muted)', lineHeight: 1.8, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
            A space built for Kenya's fashion community — by someone who's part of it.
          </p>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeUp 0.6s 0.1s ease both' }}>

          {[
            {
              title: 'Why We Exist',
              body: `Kenya has some of the most talented, creative fashion brands on the continent — but too many of them go undiscovered. Closet Culture was built to change that. We created a curated directory where legit Kenyan fashion brands can get the visibility they deserve, and where fashion lovers can find exactly what they're looking for.`
            },
            {
              title: 'What We Do',
              body: `We connect people with Kenyan fashion brands — whether you're looking for something new, a great thrift find, a physical store to walk into, or an online brand to support. Every brand on Closet Culture is listed because someone believes in it enough to put it here.`
            },
            {
              title: 'Who We are For',
              body: `For the shopper who's tired of the same international brands and wants to wear something local. For the brand owner who's been building something real and deserves to be found. For anyone who believes that Kenyan fashion has a seat at the global table.`
            },
            {
              title: 'Our Values',
              body: `Authenticity over hype. Community over competition. We're not a marketplace — we don't take commissions or push ads. We're a directory, plain and simple. We want brands to be discovered, not sold to.`
            },
          ].map(({ title, body }) => (
            <div key={title} style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2rem 2.5rem', boxShadow: '0 2px 14px rgba(128,7,7,0.05)', borderLeft: '3px solid var(--burgundy)' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.8rem' }}>
                {title}
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.85 }}>
                {body}
              </p>
            </div>
          ))}

          {/* CTA */}
          <div style={{ background: 'var(--burgundy)', borderRadius: 'var(--card-radius)', padding: '2.5rem', textAlign: 'center' as const, marginTop: '1rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.8rem' }}>
              Have a brand to share?
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Closet Culture is free to list on. If you're building something real, we want to help people find you.
            </p>
            <a href="/add-brand" style={{ display: 'inline-block', padding: '0.85rem 2.2rem', background: 'white', color: 'var(--burgundy)', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em' }}>
              Add Your Brand
            </a>
          </div>
        </div>
      </div>
    </>
  )
}