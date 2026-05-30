'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setNarrativeMode } from '@/app/actions/setMode'
import type { NarrativeMode } from '@/lib/mode'

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
    // Update CSS immediately — no flash
    document.documentElement.dataset.mode = next
    setMode(next)
    // Persist cookie + refresh server components (text updates)
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
        color: 'var(--color-muted)',
        padding: '0.25rem',
        lineHeight: 1,
        transition: 'color var(--transition)',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
    >
      {isDark ? '○' : '●'}
    </button>
  )
}
