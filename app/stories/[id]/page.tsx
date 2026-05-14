import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 0

export default async function StoryPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) return (
    <div style={{ textAlign: 'center' as const, padding: '6rem 2rem' }}>
      <p style={{ color: 'var(--muted)' }}>Post not found.</p>
      <Link href="/stories" style={{ color: 'var(--burgundy)', marginTop: '1rem', display: 'inline-block' }}>← Back to Stories</Link>
    </div>
  )

  const { data: related } = await supabase
    .from('posts')
    .select('id, title, image, category, created_at')
    .eq('category', post.category)
    .neq('id', id)
    .limit(3)

  return (
    <>
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '2.5rem 2rem 6rem', animation: 'fadeUp 0.6s ease both' }}>

        <Link href="/stories" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Stories
        </Link>

        {/* Category + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
          <span style={{ background: 'var(--burgundy)', color: 'white', padding: '0.25rem 0.85rem', borderRadius: 50, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em' }}>
            {post.category}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            {new Date(post.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.15, marginBottom: '1.2rem' }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem', borderLeft: '3px solid var(--burgundy)', paddingLeft: '1.2rem' }}>
            {post.excerpt}
          </p>
        )}

        {/* Cover image */}
        {post.image && (
          <div style={{ borderRadius: 'var(--card-radius)', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: '0 4px 30px rgba(128,7,7,0.1)' }}>
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${post.image}`}
              alt={post.title}
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Content */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Related posts */}
      {related && related.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 5rem', borderTop: '1px solid rgba(128,7,7,0.08)', paddingTop: '3rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '1.5rem' }}>
            More Stories
          </h2>
          <div className="related-grid">
            {related.map((p: any) => (
              <Link key={p.id} href={`/stories/${p.id}`} style={{ textDecoration: 'none' }}>
                <div className="related-card">
                  <div style={{ height: 160, overflow: 'hidden', background: 'var(--cream-dark)' }}>
                    {p.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${p.image}`}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="related-img"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--cream-dark), rgba(128,7,7,0.1))' }} />
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--burgundy)', textTransform: 'uppercase' as const }}>{p.category}</span>
                    <h3 className="related-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--charcoal)', marginTop: '0.3rem', lineHeight: 1.3, transition: 'color 0.25s' }}>
                      {p.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .post-content { font-family: 'DM Sans', sans-serif; font-size: 1rem; line-height: 1.85; color: var(--charcoal); }
        .post-content p { margin-bottom: 1.4rem; }
        .post-content h2 { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 700; color: var(--charcoal); margin: 2rem 0 1rem; }
        .post-content h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 700; color: var(--charcoal); margin: 1.5rem 0 0.75rem; }
        .post-content img { width: 100%; border-radius: 10px; margin: 1.5rem 0; }
        .post-content a { color: var(--burgundy); border-bottom: 1px solid var(--burgundy); }
        .post-content ul, .post-content ol { padding-left: 1.5rem; margin-bottom: 1.4rem; }
        .post-content li { margin-bottom: 0.4rem; }
        .post-content blockquote { border-left: 3px solid var(--burgundy); padding-left: 1.2rem; font-style: italic; color: var(--muted); margin: 1.5rem 0; }
        .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .related-card { background: var(--white); border-radius: var(--card-radius); overflow: hidden; border: 1px solid rgba(128,7,7,0.07); box-shadow: 0 2px 14px rgba(128,7,7,0.05); transition: var(--transition); }
        .related-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(128,7,7,0.12); }
        .related-card:hover .related-img { transform: scale(1.05); }
        .related-card:hover .related-title { color: var(--burgundy); }
        @media (max-width: 768px) { .related-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .related-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}