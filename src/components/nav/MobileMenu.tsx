'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'

type NavLink = { href: string; label: string }

type Props = { links: NavLink[] }

export function MobileMenu({ links }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text)',
          padding: '0.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}
      >
        <span style={{ display: 'block', width: '20px', height: '1.5px', backgroundColor: 'currentColor' }} />
        <span style={{ display: 'block', width: '20px', height: '1.5px', backgroundColor: 'currentColor' }} />
        <span style={{ display: 'block', width: '14px', height: '1.5px', backgroundColor: 'currentColor' }} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem 1.5rem',
          }}
        >
          {/* Header del overlay */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBlock: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>ever davila</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-muted)',
                fontSize: '1.25rem',
                lineHeight: 1,
                padding: '0.25rem',
              }}
            >
              ✕
            </button>
          </div>

          {/* Links */}
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              marginTop: '2rem',
              flex: 1,
            }}
          >
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 'var(--text-section)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  paddingBlock: '0.75rem',
                  borderBottom: 'var(--border-width) solid var(--color-border)',
                  transition: 'color var(--transition)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Controles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBlock: '1.5rem' }}>
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  )
}
