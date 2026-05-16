import { sanityClient, urlFor } from '@/lib/sanity'
import Link from 'next/link'

export const revalidate = 60

async function getPost(slug: string) {
  return await sanityClient.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      excerpt,
      category,
      publishedAt,
      coverImage,
      body
    }
  `, { slug })
}

async function getRelated(slug: string, category: string) {
  return await sanityClient.fetch(`
    *[_type == "post" && slug.current != $slug && category == $category] | order(publishedAt desc)[0...3] {
      _id,
      title,
      category,
      publishedAt,
      slug,
      coverImage
    }
  `, { slug, category })
}

function renderBody(body: any[]) {
  if (!body) return null
  return body.map((block: any, i: number) => {
    if (block._type === 'image') {
      return (
        <img
          key={i}
          src={urlFor(block)}
          alt=""
          style={{ width: '100%', borderRadius: 10, margin: '1.5rem 0' }}
        />
      )
    }
    if (block._type !== 'block') return null

    const text = block.children?.map((child: any) => {
      let content = child.text
      if (child.marks?.includes('strong')) content = <strong key={child._key}>{content}</strong>
      if (child.marks?.includes('em')) content = <em key={child._key}>{content}</em>
      return content
    })

    const style = block.style || 'normal'
    if (style === 'h2') return <h2 key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 700, color: 'var(--charcoal)', margin: '2rem 0 1rem' }}>{text}</h2>
    if (style === 'h3') return <h3 key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--charcoal)', margin: '1.5rem 0 0.75rem' }}>{text}</h3>
    if (style === 'blockquote') return <blockquote key={i} style={{ borderLeft: '3px solid var(--burgundy)', paddingLeft: '1.2rem', fontStyle: 'italic', color: 'var(--muted)', margin: '1.5rem 0' }}>{text}</blockquote>
    return <p key={i} style={{ marginBottom: '1.4rem', lineHeight: 1.85 }}>{text}</p>
  })
}

export default async function StoryPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  if (!post) return (
    <div style={{ textAlign: 'center' as const, padding: '6rem 2rem' }}>
      <p style={{ color: 'var(--muted)' }}>Post not found.</p>
      <Link href="/stories" style={{ color: 'var(--burgundy)', marginTop: '1rem', display: 'inline-block' }}>← Back to Stories</Link>
    </div>
  )

  const related = await getRelated(params.id, post.category)

  return (
    <>
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '2.5rem 2rem 6rem', animation: 'fadeUp 0.6s ease both' }}>

        <Link href="/stories" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: '2rem' }}>
          ← Back to Stories
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
          <span style={{ background: 'var(--burgundy)', color: 'white', padding: '0.25rem 0.85rem', borderRadius: 50, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em' }}>
            {post.category}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          </span>
        </div>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1.15, marginBottom: '1.2rem' }}>
          {post.title}
        </h1>

        {post.excerpt && (
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem', borderLeft: '3px solid var(--burgundy)', paddingLeft: '1.2rem' }}>
            {post.excerpt}
          </p>
        )}

        {post.coverImage && (
          <div style={{ borderRadius: 'var(--card-radius)', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: '0 4px 30px rgba(128,7,7,0.1)' }}>
            <img
              src={urlFor(post.coverImage)}
              alt={post.title}
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', lineHeight: 1.85, color: 'var(--charcoal)' }}>
          {renderBody(post.body)}
        </div>
      </article>

      {related && related.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 5rem', borderTop: '1px solid rgba(128,7,7,0.08)', paddingTop: '3rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '1.5rem' }}>
            More Stories
          </h2>
          <div className="related-grid">
            {related.map((p: any) => (
              <Link key={p._id} href={`/stories/${p.slug?.current}`} style={{ textDecoration: 'none' }}>
                <div className="related-card">
                  <div style={{ height: 160, overflow: 'hidden', background: 'var(--cream-dark)' }}>
                    {p.coverImage ? (
                      <img src={urlFor(p.coverImage)} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="related-img" />
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