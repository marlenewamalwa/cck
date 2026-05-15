'use client'

import { useState, useEffect } from 'react'

export default function FeaturedButton({ brandId, isFeatured }: { brandId: number; isFeatured: boolean }) {
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'form' | 'pending' | 'success' | 'error'>('form')
  const [error, setError] = useState('')

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  async function handleSubmit() {
    if (!phone || phone.length < 10) { setError('Enter a valid M-Pesa number'); return }
    setStep('pending')
    setError('')

    const res = await fetch('/api/mpesa/stk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, brand_id: brandId, amount: 500 }),
    })

    const data = await res.json()

    if (data.success) {
      setStep('success')
    } else {
      setError(data.error || 'Payment failed. Try again.')
      setStep('form')
    }
  }

  function close() {
    setOpen(false)
    setTimeout(() => {
      setStep('form')
      setPhone('')
      setError('')
    }, 300)
  }

  if (isFeatured) return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600, color: '#8b6914' }}>
      ★ Featured Listing Active
    </div>
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', background: 'transparent', color: '#8b6914', border: '1.5px solid rgba(201,168,76,0.5)', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
      >
        ★ Get Featured — KES 500/mo
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, background: 'rgba(26,16,9,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }}
        >
          {/* Modal */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', animation: 'fadeUp 0.25s ease', overflow: 'hidden' }}
          >
            {/* Modal header */}
            <div style={{ background: 'var(--cream-dark)', padding: '1.5rem 1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(128,7,7,0.08)' }}>
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.2rem' }}>
                  Featured Listing
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Appear at the top of the directory for 30 days</p>
              </div>
              <button onClick={close} style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: 'var(--muted)', cursor: 'pointer', lineHeight: 1, padding: '0.2rem 0.4rem' }}>
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '1.8rem' }}>
              {step === 'success' ? (
                <div style={{ textAlign: 'center' as const, padding: '1.5rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.75rem' }}>
                    STK Push Sent!
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    Check your phone and confirm the M-Pesa payment of <strong>KES 500</strong>. Your featured listing will activate automatically once confirmed.
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.7, padding: '0.8rem 1rem', background: 'var(--cream)', borderRadius: 8 }}>
                    Didn't receive a prompt? Manually send <strong>KES 500</strong> to Till No. <strong>3393634</strong> with your brand name as reference, then email <a href="mailto:hello@closetculture.co.ke" style={{ color: 'var(--burgundy)' }}>hello@closetculture.co.ke</a>
                  </p>
                  <button onClick={close} style={{ marginTop: '1.2rem', padding: '0.7rem 2rem', background: 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Pricing */}
                  <div style={{ background: 'var(--cream)', borderRadius: 10, padding: '1rem 1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '0.2rem' }}>Featured Listing</p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--charcoal)' }}>Top of directory · Featured badge · 30 days</p>
                    </div>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--burgundy)', whiteSpace: 'nowrap' as const }}>
                      KES 500
                    </p>
                  </div>

                  {error && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--burgundy)', marginBottom: '1rem', padding: '0.7rem 1rem', background: 'rgba(128,7,7,0.06)', borderRadius: 8 }}>
                      {error}
                    </p>
                  )}

                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '0.6rem' }}>
                    M-Pesa Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    disabled={step === 'pending'}
                    style={{ width: '100%', padding: '0.85rem 1rem', border: '1.5px solid rgba(128,7,7,0.2)', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem', background: 'var(--cream)', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '1rem' }}
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={step === 'pending'}
                    style={{ width: '100%', padding: '1rem', background: step === 'pending' ? 'var(--muted)' : 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', fontWeight: 500, letterSpacing: '0.08em', cursor: step === 'pending' ? 'not-allowed' : 'pointer', marginBottom: '1rem' }}
                  >
                    {step === 'pending' ? 'Sending prompt…' : 'Pay KES 500 via M-Pesa'}
                  </button>

                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.6, textAlign: 'center' as const }}>
                    Didn't receive a prompt? Send <strong>KES 500</strong> to Till <strong>3393634</strong> · reference: your brand name · then email <a href="mailto:hello@closetculture.co.ke" style={{ color: 'var(--burgundy)' }}>hello@closetculture.co.ke</a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}