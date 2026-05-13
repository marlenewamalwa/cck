'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ReviewForm({ brandId }: { brandId: number }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError('Please select a star rating.'); return }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('reviews').insert({
      brand_id: brandId,
      rating,
      review: review.trim() || null,
    })

    if (err) {
      setError('Something went wrong. Please try again.')
    } else {
      setSuccess(true)
      setRating(0)
      setReview('')
      router.refresh()
    }
    setLoading(false)
  }

  if (success) return (
    <div style={{ background: 'rgba(34,107,34,0.07)', border: '1px solid rgba(34,107,34,0.2)', borderRadius: 8, padding: '1rem 1.2rem', fontSize: '0.9rem', color: '#226b22' }}>
      ✓ Thanks for your review!
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ height: '1px', background: 'rgba(128,7,7,0.08)', marginBottom: '1.5rem' }} />
      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '1rem' }}>
        Leave a Review
      </h3>

      {error && (
        <p style={{ fontSize: '0.82rem', color: 'var(--burgundy)', marginBottom: '0.8rem' }}>{error}</p>
      )}

      {/* Star picker */}
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem' }}>
        {[1,2,3,4,5].map(star => (
          <span
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
            style={{
              fontSize: '1.8rem',
              cursor: 'pointer',
              color: star <= (hovered || rating) ? '#f5a623' : '#ddd',
              transition: 'color 0.15s',
              userSelect: 'none',
            }}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        value={review}
        onChange={e => setReview(e.target.value)}
        placeholder="Share your experience with this brand… (optional)"
        rows={3}
        style={{
          width: '100%', padding: '0.9rem 1rem',
          border: '1.5px solid rgba(128,7,7,0.15)',
          borderRadius: 8, fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.88rem', color: 'var(--charcoal)',
          background: 'var(--cream)', resize: 'vertical',
          marginBottom: '1rem', boxSizing: 'border-box',
          outline: 'none',
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.7rem 2rem',
          background: 'var(--burgundy)', color: 'white',
          border: 'none', borderRadius: 50,
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.82rem', fontWeight: 500,
          letterSpacing: '0.05em', cursor: 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}