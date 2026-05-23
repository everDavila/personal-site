'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark'
    setTheme(current)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    setTheme(next)
  }

  if (!theme) return null

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-muted)',
        padding: '0.25rem',
        lineHeight: 1,
        transition: 'color var(--transition)',
        fontSize: '1rem',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
    >
      {theme === 'dark' ? '○' : '●'}
    </button>
  )
}
