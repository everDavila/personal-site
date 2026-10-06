'use client'

import { useState, useEffect, useRef } from 'react'
import type { ComponentProps } from 'react'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'
import { LogoMark } from './LogoMark'

type NavLink = { href: string; labelDark: string; labelLight: string }

type Props = { links: NavLink[] }

// Área táctil mínima recomendada (WCAG 2.5.5)
const TAP = '44px'

export function MobileMenu({ links }: Props) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef   = useRef<HTMLButtonElement>(null)
  const dialogRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key !== 'Tab' || !dialogRef.current) return
      // Mantener el foco dentro del menú
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>('a, button, select')
      const first = focusables[0]
      const last  = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)

    const trigger = triggerRef.current
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      trigger?.focus()
    }
  }, [open])

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls="mobile-menu"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text)',
          width: TAP,
          height: TAP,
          marginRight: '-12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
        }}
      >
        <span style={{ display: 'block', width: '20px', height: '1.5px', backgroundColor: 'currentColor' }} />
        <span style={{ display: 'block', width: '20px', height: '1.5px', backgroundColor: 'currentColor' }} />
        <span style={{ display: 'block', width: '14px', height: '1.5px', backgroundColor: 'currentColor', transform: 'translateX(-3px)' }} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          id="mobile-menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
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
            <LogoMark />
            <button
              ref={closeRef}
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-muted)',
                fontSize: '1.25rem',
                lineHeight: 1,
                width: TAP,
                height: TAP,
                marginRight: '-12px',
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
            {links.map(({ href, labelDark, labelLight }) => (
              <Link
                key={href}
                href={{ pathname: href } as ComponentProps<typeof Link>['href']}
                onClick={() => setOpen(false)}
                className="mobile-menu-link"
                style={{
                  fontSize: 'var(--text-section)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  paddingBlock: '0.75rem',
                  borderBottom: 'var(--border-width) solid var(--color-border)',
                  transition: 'opacity var(--transition)',
                }}
              >
                <span className="n-slot">
                  <span className="n-d">{labelDark}</span>
                  <span className="n-l">{labelLight}</span>
                </span>
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
