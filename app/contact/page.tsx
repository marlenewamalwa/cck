'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Music2, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('suggestions').insert({
      content: `FROM: ${form.name} (${form.email})\nSUBJECT: ${form.subject}\n\n${form.message}`,
    })

    if (err) {
      setError('Something went wrong. Please try again.')
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 2rem 6rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '3rem', animation: 'fadeUp 0.6s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Get in Touch</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1, marginBottom: '1rem' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '500px' }}>
          Have a question, spotted a wrong listing, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-grid">

        {/* Left — form */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2.5rem', boxShadow: '0 4px 30px rgba(128,7,7,0.07)' }}>

          {success ? (
            <div style={{ textAlign: 'center' as const, padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.75rem' }}>
                Message Sent
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                Thanks for reaching out. We'll get back to you as soon as we can.
              </p>
              <button
                onClick={() => { setSuccess(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                style={{ marginTop: '1.5rem', padding: '0.7rem 1.8rem', background: 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '1.8rem' }}>
                Send a Message
              </h2>

              {error && (
                <div style={{ background: 'rgba(128,7,7,0.07)', borderLeft: '3px solid var(--burgundy)', padding: '12px 16px', borderRadius: 4, fontSize: '0.85rem', color: 'var(--burgundy)', marginBottom: '1.5rem' }}>
                  {error}
                </div>
              )}

              <div className="form-row">
                <div style={fieldWrap}>
                  <label style={labelStyle}>Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Amina Ochieng"
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  required
                  style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23800707' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', WebkitAppearance: 'none', appearance: 'none' }}
                >
                  <option value="">Select a subject…</option>
                  <option value="Brand listing issue">Brand listing issue</option>
                  <option value="Submit a brand">Submit a brand</option>
                  <option value="Partnership enquiry">Partnership enquiry</option>
                  <option value="Report incorrect info">Report incorrect info</option>
                  <option value="General question">General question</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what's on your mind…"
                  required
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '1rem', background: loading ? 'var(--muted)' : 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.25s' }}
              >
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Right — info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            {
              icon: <MapPin size={22} color="var(--burgundy)" />,
              title: 'Instagram',
              detail: '@closetculturekenya',
              link: 'https://www.instagram.com/closetculturekenya/',
            },
            {
              
              icon: <MapPin size={22} color="var(--burgundy)" />,
              title: 'Pinterest',
              detail: 'ClosetCulture',
              link: 'https://www.pinterest.com/ClosetCulture/',
            },
            {
              icon: <Music2 size={22} color="var(--burgundy)" />,
              title: 'TikTok',
              detail: '@closetcultureke',
              link: 'https://www.tiktok.com/@closetcultureke',
            },
          ].map(({ icon, title, detail, link }) => (
            <a key={title} href={link} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '1.5rem 2rem', boxShadow: '0 2px 14px rgba(128,7,7,0.05)', display: 'flex', alignItems: 'center', gap: '1.2rem', textDecoration: 'none', transition: 'var(--transition)', border: '1px solid transparent' }} className="contact-card">
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--burgundy-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
  {icon}
</div>
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '0.2rem' }}>{title}</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--charcoal)' }}>{detail}</p>
              </div>
            </a>
          ))}

          <div style={{ background: 'var(--burgundy)', borderRadius: 'var(--card-radius)', padding: '1.8rem 2rem', color: 'white' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.6rem' }}>
              Want to list your brand?
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
              It's free and takes less than 5 minutes.
            </p>
            <a href="/add-brand" style={{ display: 'inline-block', padding: '0.7rem 1.6rem', background: 'white', color: 'var(--burgundy)', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
              Add Your Brand →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 2rem; }
        .contact-card:hover { border-color: rgba(128,7,7,0.15) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(128,7,7,0.1) !important; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        input:focus, textarea:focus, select:focus { border-color: var(--burgundy) !important; outline: none; background: rgba(128,7,7,0.02) !important; }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const fieldWrap: React.CSSProperties = { marginBottom: '1.4rem' }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.6rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.85rem 1rem', border: '1.5px solid rgba(128,7,7,0.18)', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', color: 'var(--charcoal)', background: 'var(--cream)', boxSizing: 'border-box', transition: 'border-color 0.25s' }