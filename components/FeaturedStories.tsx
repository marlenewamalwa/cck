'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function FeaturedStories() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('posts')
      .select('id, title, excerpt, image, category, created_at')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setPosts(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading || posts.length === 0) return null

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto 5rem', padding: '0 2rem' }}>
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Stories</span>
        <div style={{ flex: 1, height: 1, background: 'var(--burgundy)', opacity: 0.2 }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1 }}>
          Latest Stories
        </h2>
        <Link href="/stories" style={{ fontSize: '0.82rem', color: 'var(--burgundy)', fontWeight: 500, borderBottom: '1px solid var(--burgundy)', textDecoration: 'none', paddingBottom: 2 }}>
          View all stories →
        </Link>
      </div>

      <div className="stories-home-grid">
        {posts.map((post: any, i: number) => (
          <Link key={post.id} href={`/stories/${post.id}`} style={{ textDecoration: 'none' }} className={i === 0 ? 'story-featured' : 'story-card'}>
            <div style={{ height: i === 0 ? 280 : 180, overflow: 'hidden', background: 'var(--cream-dark)', position: 'relative', borderRadius: i === 0 ? '16px 16px 0 0' : '12px 12px 0 0' }}>
              {post.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${post.image}`}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  className="story-img"
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--cream-dark), rgba(128,7,7,0.1))' }} />
              )}
              <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'var(--burgundy)', color: 'white', padding: '0.2rem 0.75rem', borderRadius: 50, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                {post.category}
              </span>
            </div>
            <div style={{ padding: '1.2rem 1.3rem 1.4rem', background: 'var(--white)', borderRadius: '0 0 12px 12px', flex: 1 }}>
              <h3 className="story-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: i === 0 ? '1.4rem' : '1.15rem', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.3, marginBottom: '0.5rem', transition: 'color 0.25s' }}>
                {post.title}
              </h3>
              {post.excerpt && (
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '0.6rem' }}>
                  {post.excerpt.substring(0, i === 0 ? 120 : 80)}{post.excerpt.length > (i === 0 ? 120 : 80) ? '…' : ''}
                </p>
              )}
              <p style={{ fontSize: '0.72rem', color: 'rgba(122,106,106,0.6)' }}>
                {new Date(post.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .stories-home-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 1.5rem; align-items: start; }
        .story-featured, .story-card { display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 14px rgba(128,7,7,0.05); border: 1px solid rgba(128,7,7,0.07); transition: var(--transition); }
        .story-featured:hover, .story-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(128,7,7,0.12); }
        .story-featured:hover .story-img, .story-card:hover .story-img { transform: scale(1.05); }
        .story-featured:hover .story-title, .story-card:hover .story-title { color: var(--burgundy); }
        @media (max-width: 1024px) { .stories-home-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .stories-home-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  )
}