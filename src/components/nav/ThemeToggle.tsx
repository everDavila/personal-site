'use client'

import { useEffect, useState, useTransition } from 'react'
import { setNarrativeMode } from '@/app/actions/setMode'
import type { NarrativeMode } from '@/lib/mode'

function HumanIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="3.5" r="2.5" />
      <path d="M1.5 13.5 C1.5 10.5 10.5 10.5 10.5 13.5" />
    </svg>
  )
}

function AstronautIcon() {
  return (
    <svg width="12" height="15" viewBox="0 0 15 19" fill="none" stroke="currentColor"
      strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="6.5" r="5" />
      <ellipse cx="7.5" cy="6" rx="2.6" ry="2.1" fill="currentColor" fillOpacity="0.22" stroke="none" />
      <line x1="5.5" y1="11.5" x2="9.5" y2="11.5" />
      <path d="M3.5 13 L4 18.5 H11 L11.5 13" />
      <path d="M3.5 13 Q7.5 11.8 11.5 13" />
      <path d="M3.5 14.5 L1 16" />
      <path d="M11.5 14.5 L14 16" />
    </svg>
  )
}

export function ThemeToggle() {
  const [mode, setMode] = useState<NarrativeMode | null>(null)
  const [burst, setBurst] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    const current = document.documentElement.dataset.mode as NarrativeMode | undefined
    setMode(current ?? 'dark')
  }, [])

  function toggle() {
    const next: NarrativeMode = mode === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.mode = next
    setMode(next)
    setBurst(true)
    startTransition(async () => {
      await setNarrativeMode(next)
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
        position: 'relative',
        width: 60,
        height: 24,
        borderRadius: 12,
        background: isDark ? 'var(--color-surface)' : 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        transition: 'border-color var(--transition)',
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
    >
      {/* Burst ring */}
      {burst && (
        <span
          className="toggle-burst"
          onAnimationEnd={() => setBurst(false)}
        />
      )}

      {/* Thumb */}
      <span
        style={{
          position: 'absolute',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#F0EFEC' : '#F5F4F0',
          transform: isDark ? 'translateX(3px)' : 'translateX(39px)',
          transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), background var(--transition)',
        }}
      >
        {isDark ? <HumanIcon /> : <AstronautIcon />}
      </span>
    </button>
  )
}
