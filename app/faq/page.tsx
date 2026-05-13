'use client'

import { useState } from 'react'

const faqs = [
  {
    section: 'For Shoppers',
    items: [
      {
        q: 'Is Closet Culture free to use?',
        a: 'Completely free. Browse all brands, read stories, and discover Kenya\'s fashion scene at no cost — no account needed.',
      },
      {
        q: 'Can I buy directly from Closet Culture?',
        a: 'No — we\'re a directory, not a marketplace. We connect you to the brand\'s website or Instagram so you can shop directly with them. That means your money goes straight to the brand.',
      },
      {
        q: 'How do I find brands near me?',
        a: 'Use the Location filter on the Brands page. You can filter by Physical stores, Hybrid (physical + online), or Online Only brands.',
      },
      {
        q: 'What does "Thrift" mean on a brand listing?',
        a: 'It means the brand sells pre-owned or second-hand clothing. "New & Thrift" means they sell both. We display this clearly so you know what to expect before visiting.',
      },
    ],
  },
  {
    section: 'For Brands',
    items: [
      {
        q: 'How do I list my brand?',
        a: 'Create a free account, then go to Add Your Brand. Fill in your brand details, upload your logo, select your categories and you\'re done. It\'s free.',
      },
      {
        q: 'What kind of brands can be listed?',
        a: 'Kenyan fashion brands — clothing, accessories, footwear, thrift stores, streetwear, formal wear. If it\'s fashion and it\'s Kenyan, it belongs here.',
      },
      {
        q: 'Can I edit my brand listing after submitting?',
        a: 'Yes. Log into your profile and you\'ll see your listed brands with an option to edit them.',
      },
      {
        q: 'Is there a paid tier for more visibility?',
        a: 'We\'re working on featured listings for brands that want to appear at the top of the directory. Stay tuned.',
      },
    ],
  },
  {
    section: 'General',
    items: [
      {
        q: 'How do I report an incorrect listing?',
        a: 'Use the Contact page to flag anything that looks wrong. We review all reports and update or remove listings as needed.',
      },
      {
        q: 'Who runs Closet Culture?',
        a: 'Closet Culture is an independent Kenyan platform — not a corporation. It\'s built and maintained by someone who genuinely cares about the local fashion scene.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{ borderBottom: '1px solid rgba(128,7,7,0.08)', overflow: 'hidden' }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const, gap: '1rem' }}
      >
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.4 }}>
          {q}
        </span>
        <span style={{ color: 'var(--burgundy)', fontSize: '1.2rem', flexShrink: 0, transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>
          +
        </span>
      </button>
      {open && (
        <p style={{ fontSize: '0.93rem', color: 'var(--muted)', lineHeight: 1.8, paddingBottom: '1.2rem', marginTop: '-0.3rem' }}>
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '4rem auto', padding: '0 2rem 6rem' }}>

      <div style={{ marginBottom: '3rem', animation: 'fadeUp 0.6s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Help</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '1rem' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7 }}>
          Can't find what you're looking for? <a href="/contact" style={{ color: 'var(--burgundy)', borderBottom: '1px solid var(--burgundy)' }}>Contact us</a>.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {faqs.map(({ section, items }) => (
          <div key={section}>
            <h2 style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--burgundy)', marginBottom: '0.5rem' }}>
              {section}
            </h2>
            <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '0 1.8rem', boxShadow: '0 2px 14px rgba(128,7,7,0.05)' }}>
              {items.map(item => <FAQItem key={item.q} {...item} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}