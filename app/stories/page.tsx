'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sanityClient, urlFor } from '@/lib/sanity'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'Post', label: 'Posts' },
  { value: 'Interview', label: 'Interviews' },
]

export default function StoriesPage() {
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sanityClient.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id, title, excerpt, category, publishedAt, slug, coverImage
      }
    `).then(data => {
      setAllPosts(data ?? [])
      setLoading(false)
    })
  }, [])

  const posts = filter === 'all' ? allPosts : allPosts.filter(p => p.category === filter)
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <div style={{ maxWidth: '1200px', margin: '2.5rem auto 0', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Stories</span>
          <div style={{ flex: 1, height: 1, background: 'var(--burgundy)', opacity: 0.2 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap' as const, gap: '1rem' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.1 }}>
            Fashion Stories
          </h1>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                style={{
                  padding: '0.4rem 1rem',
                  border: '1.5px solid rgba(128,7,7,0.22)',
                  borderRadius: 50,
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s',
                  background: filter === value ? 'var(--burgundy)' : 'var(--cream)',
                  color: filter === value ? 'white' : 'var(--muted)',
                  borderColor: filter === value ? 'var(--burgundy)' : 'rgba(128,7,7,0.22)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' as const, padding: '6rem 2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Loading stories…
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center' as const, padding: '6rem 2rem' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>No stories in this category yet.</p>
          <button onClick={() => setFilter('all')} style={{ marginTop: '1rem', padding: '0.7rem 1.8rem', background: 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.85rem', cursor: 'pointer' }}>
            View All
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 5rem' }}>

          {/* Featured post */}
          {featured && (
            <Link href={`/stories/${featured.slug?.current}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '3rem' }}>
              <div className="featured-card">
                <div className="featured-image">
                  {featured.coverImage ? (
                    <img
                      src={urlFor(featured.coverImage)}
                      alt={featured.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      className="featured-img"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--cream-dark), rgba(128,7,7,0.12))' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,16,9,0.85) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2.5rem' }}>
                    <span style={{ display: 'inline-block', background: 'var(--burgundy)', color: 'white', padding: '0.25rem 0.85rem', borderRadius: 50, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
                      {featured.category}
                    </span>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: '0.6rem' }}>
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '500px' }}>
                        {featured.excerpt.substring(0, 120)}{featured.excerpt.length > 120 ? '…' : ''}
                      </p>
                    )}
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.8rem' }}>
                      {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <div className="posts-grid">
              {rest.map((post: any, i: number) => (
                <Link key={post._id} href={`/stories/${post.slug?.current}`} style={{ textDecoration: 'none' }}>
                  <div className="post-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div style={{ height: 200, overflow: 'hidden', background: 'var(--cream-dark)', position: 'relative' }}>
                      {post.coverImage ? (
                        <img
                          src={urlFor(post.coverImage)}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          className="post-img"
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--cream-dark), rgba(128,7,7,0.1))' }} />
                      )}
                      <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'var(--burgundy)', color: 'white', padding: '0.2rem 0.7rem', borderRadius: 50, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                        {post.category}
                      </span>
                    </div>
                    <div style={{ padding: '1.3rem' }}>
                      <h3 className="post-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.3, marginBottom: '0.5rem', transition: 'color 0.25s' }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '0.8rem' }}>
                          {post.excerpt.substring(0, 90)}{post.excerpt.length > 90 ? '…' : ''}
                        </p>
                      )}
                      <p style={{ fontSize: '0.72rem', color: 'rgba(122,106,106,0.6)', letterSpacing: '0.04em' }}>
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .featured-card { border-radius: var(--card-radius); overflow: hidden; box-shadow: 0 4px 30px rgba(128,7,7,0.1); }
        .featured-image { position: relative; height: 480px; overflow: hidden; }
        .featured-card:hover .featured-img { transform: scale(1.03); }
        .posts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .post-card { background: var(--white); border-radius: var(--card-radius); overflow: hidden; border: 1px solid rgba(128,7,7,0.07); box-shadow: 0 2px 14px rgba(128,7,7,0.05); transition: var(--transition); animation: fadeUp 0.55s ease both; }
        .post-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(128,7,7,0.12); }
        .post-card:hover .post-img { transform: scale(1.05); }
        .post-card:hover .post-title { color: var(--burgundy); }
        @media (max-width: 1024px) { .posts-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .posts-grid { grid-template-columns: 1fr; } .featured-image { height: 300px !important; } }
      `}</style>
    </>
  )
}