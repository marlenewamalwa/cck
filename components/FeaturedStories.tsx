'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sanityClient, urlFor } from '@/lib/sanity'

export default function FeaturedStories() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient.fetch(`
      *[_type == "post"] | order(publishedAt desc)[0...3] {
        _id,
        title,
        excerpt,
        category,
        publishedAt,
        slug,
        coverImage
      }
    `).then(data => {
      setPosts(data ?? [])
      setLoading(false)
    })
  }, [])

  if (loading || posts.length === 0) return null

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto 5rem', padding: '0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
        <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Latest Stories</span>
        <div style={{ flex: 1, height: 1, background: 'var(--burgundy)', opacity: 0.2 }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap' as const, gap: '1rem' }}>
        
        <Link href="/stories" style={{ fontSize: '0.82rem', color: 'var(--burgundy)', fontWeight: 500, borderBottom: '1px solid var(--burgundy)', textDecoration: 'none', paddingBottom: 2 }}>
          View all stories →
        </Link>
      </div>

      <div className="stories-home-grid">
        {posts.map((post: any, i: number) => (
          <Link key={post._id} href={`/stories/${post.slug?.current}`} style={{ textDecoration: 'none' }} className={i === 0 ? 'story-featured' : 'story-card'}>
            <div style={{ height: 220, overflow: 'hidden', background: 'var(--cream-dark)', position: 'relative' }}>
              {post.coverImage ? (
                <img
                  src={urlFor(post.coverImage)}
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
            <div style={{ padding: '1.2rem 1.3rem 1.4rem', background: 'var(--white)', flex: 1 }}>
              <h3 className="story-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: i === 0 ? '1.4rem' : '1.15rem', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.3, marginBottom: '0.5rem', transition: 'color 0.25s',display: '-webkit-box',
WebkitLineClamp: 2,
WebkitBoxOrient: 'vertical',
overflow: 'hidden' }}>
                {post.title}
              </h3>
              {post.excerpt && (
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '0.6rem' ,display: '-webkit-box',
WebkitLineClamp: 3,
WebkitBoxOrient: 'vertical',
overflow: 'hidden' }}>
                  {post.excerpt.substring(0, i === 0 ? 120 : 80)}{post.excerpt.length > (i === 0 ? 120 : 80) ? '…' : ''}
                </p>
              )}
              <p style={{ fontSize: '0.72rem', color: 'rgba(122,106,106,0.6)' }}>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .stories-home-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; align-items: start; }
        .story-featured, .story-card { 
  display: flex; 
  flex-direction: column; 
  border-radius: 12px; overflow: hidden; box-shadow: 0 2px 14px rgba(128,7,7,0.05); border: 1px solid rgba(128,7,7,0.07); transition: var(--transition);height: 420px; /* add this */}
        .story-featured:hover, .story-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(128,7,7,0.12); }
        .story-featured:hover .story-img, .story-card:hover .story-img { transform: scale(1.05); }
        .story-featured:hover .story-title, .story-card:hover .story-title { color: var(--burgundy); }
        @media (max-width: 1024px) { .stories-home-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .stories-home-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  )
}