'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: username } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Create profile row
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        email,
      })
    }

    router.push('/')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
  }

  return (
    <div style={{ display: 'grid', minHeight: 'calc(100vh - 70px)' }} className="auth-grid">

      {/* LEFT */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: '#1A1009', display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-end', padding: '60px',
      }} className="auth-left">
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/signup.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center top', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(107,26,26,0.55) 0%, transparent 50%), linear-gradient(to top, rgba(26,16,9,0.92) 0%, transparent 55%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>
            Join the community
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(36px, 4vw, 52px)', lineHeight: 1.1, color: '#fff', marginBottom: '20px' }}>
            Discover &<br /><em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Connect</em>
          </h2>
          <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '280px' }}>
            Join Kenya's growing fashion community. Add your brand or discover new ones.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 56px', background: 'var(--cream)', overflowY: 'auto',
      }} className="auth-right">
        <div style={{ width: '100%', maxWidth: '380px', animation: 'fadeUp 0.6s ease both' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 400, color: '#1A1009', marginBottom: '6px' }}>
            Create account
          </h1>
          <p style={{ fontSize: '12px', fontWeight: 300, letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '40px' }}>
            Free forever. No credit card needed.
          </p>

          {error && (
            <div style={{ background: 'rgba(107,26,26,0.07)', borderLeft: '3px solid var(--burgundy)', padding: '12px 16px', borderRadius: '2px', fontSize: '12.5px', color: 'var(--burgundy)', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '18px' }}>
              <label style={fieldLabelStyle}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="closetculture_ke"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={fieldLabelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={fieldLabelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  style={{ ...inputStyle, paddingRight: '60px' }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--muted)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', userSelect: 'none' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>

            <button type="submit" disabled={loading} style={primaryBtnStyle}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(107,26,26,0.15)' }} />
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(107,26,26,0.15)' }} />
          </div>

          <button onClick={handleGoogle} style={googleBtnStyle}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="16" alt="Google" />
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '12px', color: 'var(--muted)', fontWeight: 300 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--burgundy)', fontWeight: 400, borderBottom: '1px solid var(--burgundy)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
          .auth-right { padding: 40px 28px !important; }
        }
        input:focus { border-color: var(--burgundy) !important; background: rgba(107,26,26,0.03) !important; outline: none; }
      `}</style>
    </div>
  )
}

const fieldLabelStyle: React.CSSProperties = {
  display: 'block', fontSize: '10px', fontWeight: 500,
  letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'var(--muted)', marginBottom: '7px',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  background: 'transparent', border: '1px solid rgba(107,26,26,0.15)',
  borderRadius: '3px', fontFamily: 'DM Sans, sans-serif',
  fontSize: '14px', fontWeight: 300, color: '#1A1009',
  transition: 'border-color 0.25s, background 0.25s',
  boxSizing: 'border-box',
}
const primaryBtnStyle: React.CSSProperties = {
  width: '100%', background: '#6B1A1A', color: '#fff',
  border: 'none', padding: '15px', borderRadius: '3px',
  fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
  fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase',
  cursor: 'pointer', marginBottom: '0', transition: 'background 0.25s',
}
const googleBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: '10px', width: '100%', padding: '13px',
  background: 'transparent', border: '1px solid rgba(107,26,26,0.15)',
  borderRadius: '3px', color: '#1A1009', fontFamily: 'DM Sans, sans-serif',
  fontSize: '12px', fontWeight: 400, letterSpacing: '0.08em',
  cursor: 'pointer', transition: 'border-color 0.25s, background 0.25s',
}