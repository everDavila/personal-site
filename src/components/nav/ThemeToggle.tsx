'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setNarrativeMode } from '@/app/actions/setMode'
import type { NarrativeMode } from '@/lib/mode'

function AstronautIcon() {
  return (
    <svg
      width="15"
      height="19"
      viewBox="0 0 15 19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Helmet */}
      <circle cx="7.5" cy="6.5" r="5" />
      {/* Visor */}
      <ellipse cx="7.5" cy="6" rx="2.6" ry="2.1" fill="currentColor" fillOpacity="0.22" stroke="none" />
      {/* Neck ring */}
      <line x1="5.5" y1="11.5" x2="9.5" y2="11.5" />
      {/* Body suit */}
      <path d="M3.5 13 L4 18.5 H11 L11.5 13" />
      {/* Shoulders arc */}
      <path d="M3.5 13 Q7.5 11.8 11.5 13" />
      {/* Left arm */}
      <path d="M3.5 14.5 L1 16" />
      {/* Right arm */}
      <path d="M11.5 14.5 L14 16" />
    </svg>
  )
}

export function ThemeToggle() {
  const [mode, setMode] = useState<NarrativeMode | null>(null)
  const [, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const current = document.documentElement.dataset.mode as NarrativeMode | undefined
    setMode(current ?? 'dark')
  }, [])

  function toggle() {
    const next: NarrativeMode = mode === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.mode = next
    setMode(next)
    startTransition(async () => {
      await setNarrativeMode(next)
      router.refresh()
    })
  }

  if (!mode) return null

  const isDark = mode === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro (lúdico)' : 'Cambiar a modo oscuro (profesional)'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.25rem',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        transition: 'opacity var(--transition)',
        color: isDark ? 'var(--color-muted)' : 'var(--color-accent)',
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      className={isDark ? undefined : 'astronaut-float'}
    >
      {isDark ? (
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>○</span>
      ) : (
        <AstronautIcon />
      )}
    </button>
  )
}
