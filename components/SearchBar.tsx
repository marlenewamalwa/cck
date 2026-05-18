'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { sanityClient, urlFor } from '@/lib/sanity'
import Link from 'next/link'

type Result = {
  id: string
  title: string
  subtitle?: string
  image?: string
  url: string
  type: 'brand' | 'story'
}

export default function SearchBar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Open on cmd+k
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timeout = setTimeout(async () => {
      setLoading(true)
      const [{ data: brands }, posts] = await Promise.all([
        supabase
          .from('brands')
          .select('id, name, logo, location_type')
          .ilike('name', `%${query}%`)
          .eq('is_approved', true)
          .limit(4),
        sanityClient.fetch(`
          *[_type == "post" && title match $q] | order(publishedAt desc)[0...4] {
            _id, title, category, slug, coverImage
          }
        `, { q: `${query}*` }),
      ])

      const brandResults: Result[] = (brands ?? []).map((b: any) => ({
        id: `brand-${b.id}`,
        title: b.name,
        subtitle: b.location_type,
        image: b.logo ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${b.logo}` : undefined,
        url: `/brands/${b.id}`,
        type: 'brand',
      }))

      const storyResults: Result[] = (posts ?? []).map((p: any) => ({
        id: `story-${p._id}`,
        title: p.title,
        subtitle: p.category,
        image: p.coverImage ? urlFor(p.coverImage) : undefined,
        url: `/stories/${p.slug?.current}`,
        type: 'story',
      }))

      setResults([...brandResults, ...storyResults])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  function handleOpen() {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <>
      {/* Search trigger button in nav */}
      <button
        onClick={handleOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.45rem 0.9rem',
          background: 'rgba(128,7,7,0.06)',
          border: '1px solid rgba(128,7,7,0.15)',
          borderRadius: 50, cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.82rem', color: 'var(--muted)',
          transition: 'all 0.2s',
        }}
        className="search-trigger"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <span>Search</span>
        <span style={{ fontSize: '0.7rem', color: 'rgba(122,106,106,0.5)', letterSpacing: '0.02em' }} className="search-kbd">⌘K</span>
      </button>

      {/* Modal */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,16,9,0.55)',
          zIndex: 2000,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '8vh 1.5rem 1.5rem',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.15s ease',
        }}>
          <div
            ref={containerRef}
            style={{
              background: 'var(--white)',
              borderRadius: 16,
              width: '100%', maxWidth: '560px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              animation: 'fadeUp 0.2s ease',
            }}
          >
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(128,7,7,0.08)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search brands and stories…"
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '1rem', color: 'var(--charcoal)',
                  background: 'transparent',
                }}
              />
              {loading && (
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Searching…</span>
              )}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '1.1rem', padding: '0.2rem 0.4rem',position: 'relative',
zIndex: 101 }}>
                ✕
              </button>
            </div>

            {/* Results */}
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {query && results.length === 0 && !loading && (
                <div style={{ padding: '2.5rem', textAlign: 'center' as const, color: 'var(--muted)', fontSize: '0.9rem' }}>
                  No results for "<strong>{query}</strong>"
                </div>
              )}

              {!query && (
                <div style={{ padding: '1.5rem', textAlign: 'center' as const, color: 'var(--muted)', fontSize: '0.85rem' }}>
                  Search for brands or stories…
                </div>
              )}

              {results.length > 0 && (
                <>
                  {/* Brands */}
                  {results.filter(r => r.type === 'brand').length > 0 && (
                    <div>
                      <p style={{ padding: '0.6rem 1.2rem 0.3rem', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--muted)' }}>Brands</p>
                      {results.filter(r => r.type === 'brand').map(result => (
                        <Link
                          key={result.id}
                          href={result.url}
                          onClick={() => setOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.75rem 1.2rem', textDecoration: 'none', transition: 'background 0.15s' }}
                          className="search-result"
                        >
                          <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', background: 'var(--cream)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {result.image ? (
                              <img src={result.image} alt={result.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 700, color: 'rgba(128,7,7,0.3)' }}>
                                {result.title.substring(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '0.1rem' }}>{result.title}</p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'capitalize' as const }}>{result.subtitle}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Stories */}
                  {results.filter(r => r.type === 'story').length > 0 && (
                    <div>
                      <p style={{ padding: '0.6rem 1.2rem 0.3rem', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--muted)' }}>Stories</p>
                      {results.filter(r => r.type === 'story').map(result => (
                        <Link
                          key={result.id}
                          href={result.url}
                          onClick={() => setOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.75rem 1.2rem', textDecoration: 'none', transition: 'background 0.15s' }}
                          className="search-result"
                        >
                          <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', background: 'var(--cream)', flexShrink: 0 }}>
                            {result.image ? (
                              <img src={result.image} alt={result.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--cream-dark), rgba(128,7,7,0.1))' }} />
                            )}
                          </div>
                          <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '0.1rem' }}>{result.title}</p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{result.subtitle}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '0.6rem 1.2rem', borderTop: '1px solid rgba(128,7,7,0.06)', display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(122,106,106,0.5)' }}>↵ to select</span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(122,106,106,0.5)' }}>esc to close</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .search-result:hover { background: var(--cream) !important; }
        .search-trigger:hover { background: rgba(128,7,7,0.1) !important; border-color: rgba(128,7,7,0.3) !important; }
        @media (max-width: 768px) { .search-kbd { display: none; } }
      `}</style>
    </>
  )
}