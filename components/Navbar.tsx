'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setDropdownOpen(false)
  }

  return (
    <>
      <header style={{
        background: 'var(--cream-dark)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 100,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 20px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Logo */}
          <Link href="/" style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '30px',
            color: 'var(--burgundy)',
            textDecoration: 'none',
            fontWeight: 'bold',
            flexShrink: 0,
          }}>
            Closet Culture
          </Link>

          {/* Mobile hamburger */}
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '30px',
              height: '22px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span style={{
              display: 'block', width: '100%', height: '3px',
              background: '#333',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: menuOpen ? 'translateY(9.5px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '100%', height: '3px',
              background: '#333',
              transition: 'opacity 0.3s ease',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: '100%', height: '3px',
              background: '#333',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: menuOpen ? 'translateY(-9.5px) rotate(-45deg)' : 'none',
            }} />
          </button>

          {/* Nav links */}
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              gap: '20px',
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: '40px',
              margin: 0,
              padding: 0,
            }}>
             {[
  { href: '/brands', label: 'Brands' },
  { href: '/stories', label: 'Stories' },
  { href: '/about', label: 'About Us' },
   { href: '/contact', label: 'Contact Us' },
    
].map(({ href, label }) => (
  <li key={href}>
    <Link href={href} style={{
      fontSize: '1.2rem', // increase from whatever it is
      color: pathname === href ? 'var(--burgundy)' : '#333',
      fontWeight: pathname === href ? '500' : '400',
      transition: 'color 0.3s',
      textDecoration: 'none',
      letterSpacing: '0.03em',
    }}>
      {label}
    </Link>
  </li>
))}
            </ul>
          </nav>

          {/* User area */}
          <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {/* User icon SVG */}
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="var(--cream-dark)" />
                <circle cx="20" cy="16" r="7" fill="var(--burgundy)" opacity="0.7" />
                <ellipse cx="20" cy="34" rx="12" ry="8" fill="var(--burgundy)" opacity="0.5" />
              </svg>
              {user && (
                <span style={{ fontSize: '0.9rem', color: '#333' }}>
                  Hi, {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              )}
            </div>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                background: '#fff',
                borderRadius: '6px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                minWidth: '150px',
                overflow: 'hidden',
                zIndex: 1000,
                animation: 'slideDown 0.2s ease',
              }}>
                {user ? (
                  <>
                    <Link href="/profile" style={dropdownItemStyle} onClick={() => setDropdownOpen(false)}>
                      My Profile
                    </Link>
                    <button onClick={handleSignOut} style={{ ...dropdownItemStyle, width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" style={dropdownItemStyle} onClick={() => setDropdownOpen(false)}>
                      Login
                    </Link>
                    <Link href="/register" style={dropdownItemStyle} onClick={() => setDropdownOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <style>{`
        .menu-toggle { display: none !important; }

        @media (max-width: 768px) {
          .menu-toggle { display: flex !important; }

          .main-nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 250px;
            background: var(--cream-dark);
            box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
            padding: 1rem;
            z-index: 999;
          }
          .main-nav.open { display: flex; flex-direction: column; }
          .main-nav ul { flex-direction: column !important; gap: 0 !important; }
          .main-nav ul li a { display: block; padding: 10px; }

          header { position: relative; }
        }
      `}</style>
    </>
  )
}

const dropdownItemStyle: React.CSSProperties = {
  display: 'block',
  padding: '10px 15px',
  textDecoration: 'none',
  color: '#333',
  fontSize: '0.9rem',
  transition: 'background 0.2s',
}
