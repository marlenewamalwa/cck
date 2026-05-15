'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'closetcultureke@gmail.com' // replace with your actual email

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'new' | 'edit'>('list')
  const [editPost, setEditPost] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Post',
  })

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push('/')
        return
      }
      setUser(session.user)
      fetchPosts()
    })
  }, [router])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('id, title, category, created_at')
      .order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  function startNew() {
    setForm({ title: '', excerpt: '', content: '', category: 'Post' })
    setImageFile(null)
    setImagePreview(null)
    setEditPost(null)
    setView('new')
  }

  function startEdit(post: any) {
    setForm({ title: post.title, excerpt: post.excerpt ?? '', content: post.content ?? '', category: post.category })
    setImagePreview(post.image ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${post.image}` : null)
    setImageFile(null)
    setEditPost(post)
    setView('edit')
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
  if (!form.title.trim() || !form.content.trim()) {
    console.log('Title or content empty')
    return
  }
  setSaving(true)
  console.log('Saving post...')
  
    let imagePath = editPost?.image ?? ''
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const fileName = `post_${Date.now()}.${ext}`
      await supabase.storage.from('blog-images').upload(fileName, imageFile)
      imagePath = fileName
    }

    if (view === 'edit' && editPost) {
      await supabase.from('posts').update({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        ...(imagePath ? { image: imagePath } : {}),
      }).eq('id', editPost.id)
    } else {
      await supabase.from('posts').insert({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        image: imagePath,
      })
    }

    await fetchPosts()
    setView('list')
    setSaving(false)
  }

  async function deletePost(id: number) {
    await supabase.from('posts').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
    setDeleteConfirm(null)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: 'var(--muted)' }}>Loading…</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 2rem 6rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap' as const, gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'var(--burgundy)' }}>Admin</span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: 'var(--charcoal)' }}>
            {view === 'list' ? 'Stories' : view === 'new' ? 'New Post' : 'Edit Post'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {view !== 'list' && (
            <button onClick={() => setView('list')} style={{ padding: '0.65rem 1.3rem', background: 'none', color: 'var(--muted)', border: '1px solid rgba(128,7,7,0.2)', borderRadius: 50, fontSize: '0.82rem', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
          {view === 'list' && (
            <button onClick={startNew} style={{ padding: '0.65rem 1.5rem', background: 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
              + New Post
            </button>
          )}
          {view !== 'list' && (
            <button onClick={handleSave} disabled={saving} style={{ padding: '0.65rem 1.5rem', background: saving ? 'var(--muted)' : 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving…' : 'Save Post'}
            </button>
          )}
        </div>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', boxShadow: '0 4px 30px rgba(128,7,7,0.07)', overflow: 'hidden' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center' as const, padding: '4rem 2rem' }}>
              <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>No posts yet.</p>
              <button onClick={startNew} style={{ padding: '0.7rem 1.8rem', background: 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.85rem', cursor: 'pointer' }}>
                Write your first post
              </button>
            </div>
          ) : (
            posts.map((post, i) => (
              <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.8rem', borderBottom: i < posts.length - 1 ? '1px solid rgba(128,7,7,0.07)' : 'none', gap: '1rem', flexWrap: 'wrap' as const }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--charcoal)', marginBottom: '0.2rem' }}>
                    {post.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ background: 'var(--burgundy-mist)', color: 'var(--burgundy)', padding: '0.15rem 0.6rem', borderRadius: 50, fontSize: '0.65rem', fontWeight: 600 }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {new Date(post.created_at).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => startEdit(post)} style={{ padding: '0.45rem 1rem', border: '1px solid rgba(128,7,7,0.25)', borderRadius: 50, fontSize: '0.78rem', color: 'var(--burgundy)', background: 'none', cursor: 'pointer', fontWeight: 500 }}>
                    Edit
                  </button>
                  {deleteConfirm === post.id ? (
                    <>
                      <button onClick={() => deletePost(post.id)} style={{ padding: '0.45rem 1rem', background: '#b91c1c', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>
                        Confirm
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: '0.45rem 1rem', background: 'none', color: 'var(--muted)', border: '1px solid rgba(128,7,7,0.15)', borderRadius: 50, fontSize: '0.78rem', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setDeleteConfirm(post.id)} style={{ padding: '0.45rem 1rem', background: 'none', color: '#b91c1c', border: '1px solid rgba(185,28,28,0.25)', borderRadius: 50, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EDITOR VIEW */}
      {(view === 'new' || view === 'edit') && (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--card-radius)', padding: '2.5rem', boxShadow: '0 4px 30px rgba(128,7,7,0.07)', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {['Post', 'Interview'].map(cat => (
                <button key={cat} type="button" onClick={() => setForm({ ...form, category: cat })} style={{ padding: '0.4rem 1.1rem', border: '1.5px solid rgba(128,7,7,0.22)', borderRadius: 50, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', background: form.category === cat ? 'var(--burgundy)' : 'var(--cream)', color: form.category === cat ? 'white' : 'var(--muted)', borderColor: form.category === cat ? 'var(--burgundy)' : 'rgba(128,7,7,0.22)' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Post title…"
              style={inputStyle}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label style={labelStyle}>Excerpt <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(shown on listing page)</span></label>
            <textarea
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              placeholder="A short summary of the post…"
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Cover image */}
          <div>
            <label style={labelStyle}>Cover Image</label>
            <div style={{ border: '2px dashed rgba(128,7,7,0.25)', borderRadius: 10, padding: '1.5rem', textAlign: 'center' as const, background: 'var(--cream)', position: 'relative', cursor: 'pointer' }}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 8 }} />
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Click to upload cover image</p>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
            </div>
          </div>

          {/* Content */}
          <div>
            <label style={labelStyle}>Content <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(HTML supported)</span></label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Write your post here… You can use HTML tags like <p>, <h2>, <strong>, <em>, <ul>, <li>"
              rows={18}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.7 }}
            />
          </div>

          <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '1rem', background: saving ? 'var(--muted)' : 'var(--burgundy)', color: 'white', border: 'none', borderRadius: 50, fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving…' : view === 'edit' ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      )}

      <style>{`
        input:focus, textarea:focus { border-color: var(--burgundy) !important; outline: none; background: rgba(128,7,7,0.02) !important; }
      `}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem', fontWeight: 500,
  letterSpacing: '0.15em', textTransform: 'uppercase',
  color: 'var(--muted)', marginBottom: '0.6rem',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.85rem 1rem',
  border: '1.5px solid rgba(128,7,7,0.18)', borderRadius: 8,
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.92rem',
  color: 'var(--charcoal)', background: 'var(--cream)',
  boxSizing: 'border-box', transition: 'border-color 0.25s',
}