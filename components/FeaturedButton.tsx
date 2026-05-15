'use client'

import { useState } from 'react'

export default function FeaturedButton({ brandId, isFeatured }: { brandId: number; isFeatured: boolean }) {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'idle' | 'form' | 'pending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!phone || phone.length < 10) { setError('Enter a valid phone number'); return }
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

  if (isFeatured) return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 50, fontSize: '0.78rem', fontWeight: 600, color: '#8b6914' }}>
      ★ Featured Listing
    </div>
  )

  if (step === 'success') return (
    <div style={{ background: 'rgba(34,139,34,0.08)', border: '1px solid rgba(34,139,34,0.25)', borderRadius: 10, padding: '1rem 1.2rem', fontSize: '0.88rem', color: '#226b22', lineHeight: 1.6 }}>
      ✓ STK push sent to your phone. Confirm the payment on your M-Pesa to activate your featured listing.
    </div>
  )

  if (step === 'form' || step === 'pending') return (
    <div style={{ background: 'var(--cream)', border: '1.5px solid rgba(128,7,7,0.15)', borderRadius: 10, padding: '1.2rem 1.4rem' }}>
      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: '0.3rem' }}>
        Get Featured — KES 500 / month
      </p>
      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Your brand appears at the top of the directory with a Featured badge for 30 days.
      </p>
      {error && <p style={{ fontSize: '0.78rem', color: 'var(--burgundy)', marginBottom: '0.75rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' as const }}>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="07XX XXX XXX"
          disabled={step === 'pending'}
          style={{ flex: 1, minWidth: 140, padding: '0.6rem 0.9rem', border: '1.5px solid rgba(128,7,7,0.2)', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', background: 'white', outline: 'none' }}
        />
        <button
          onClick={handleSubmit}
          disabled={step === 'pending'}
          style={{ padding: '0.6rem 1.3rem', background: step === 'pending' ? 'var(--muted)' : 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.82rem', fontWeight: 500, cursor: step === 'pending' ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' as const }}
        >
          {step === 'pending' ? 'Sending…' : 'Pay via M-Pesa'}
        </button>
        <button onClick={() => setStep('idle')} style={{ padding: '0.6rem 0.9rem', background: 'none', color: 'var(--muted)', border: '1px solid rgba(128,7,7,0.15)', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <button
      onClick={() => setStep('form')}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', background: 'transparent', color: '#8b6914', border: '1.5px solid rgba(201,168,76,0.5)', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif' }}
    >
      ★ Get Featured — KES 500/mo
    </button>
  )
}