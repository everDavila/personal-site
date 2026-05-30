'use client'

import { useEffect, useState, useTransition } from 'react'
import { setNarrativeMode } from '@/app/actions/setMode'
import type { NarrativeMode } from '@/lib/mode'

function HumanIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 18a5 5 0 0 0-10 0"/>
      <circle cx="12" cy="9" r="4"/>
      <path d="M10.5 9h.01M13.5 9h.01"/>
      <path d="M12 12c-1 0-1.5-.5-1.5-.5"/>
    </svg>
  )
}

function AstronautIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21a8 8 0 0 0 8-8V9a8 8 0 0 0-16 0v4a8 8 0 0 0 8 8z"/>
      <rect x="7" y="6" width="10" height="9" rx="3.5"/>
      <path d="M9 21v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1"/>
      <path d="M17 15h1a2 2 0 0 0 2-2v-2"/>
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
