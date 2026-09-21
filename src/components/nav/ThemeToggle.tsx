'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Sun, Moon, Globe, Orbit, X } from 'lucide-react'
import { setNarrativeMode } from '@/app/actions/setMode'
import type { NarrativeMode } from '@/lib/mode'

const TOAST_DURATION = 5500

export function ThemeToggle() {
  const t = useTranslations('modeToast')
  const [mode, setMode] = useState<NarrativeMode | null>(null)
  const [burst, setBurst] = useState(false)
  const [toastMode, setToastMode] = useState<NarrativeMode | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [, startTransition] = useTransition()

  useEffect(() => {
    const current = document.documentElement.dataset.mode as NarrativeMode | undefined
    setMode(current ?? 'light')
  }, [])

  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current) }
  }, [])

  function toggle() {
    const next: NarrativeMode = mode === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.mode = next
    setMode(next)
    setBurst(true)
    startTransition(async () => {
      await setNarrativeMode(next)
    })

    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMode(next)
    toastTimer.current = setTimeout(() => setToastMode(null), TOAST_DURATION)
  }

  function closeToast() {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMode(null)
  }

  if (!mode) return null

  const isDark = mode === 'dark'

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggle}
        aria-label={isDark ? t('switchToEarth') : t('switchToOrbital')}
        title={isDark ? t('earthName') : t('orbitalName')}
        style={{
          position: 'relative',
          width: 60,
          height: 24,
          borderRadius: 12,
          background: 'var(--color-surface)',
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
          {isDark ? <Moon size={14} /> : <Sun size={14} />}
        </span>
      </button>

      {/* Toast — mensaje narrativo al cambiar de modo */}
      {toastMode && (
        <div
          role="status"
          className="mode-toast"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.625rem)',
            right: 0,
            zIndex: 500,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.625rem',
            width: '17rem',
            maxWidth: '80vw',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '0.125rem' }}>
            {toastMode === 'dark' ? <Orbit size={16} /> : <Globe size={16} />}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: '0.9375rem',
              color: 'var(--color-text)',
            }}>
              {toastMode === 'dark' ? t('orbitalTitle') : t('earthTitle')}
            </p>
            <p style={{
              margin: '0.25rem 0 0',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-small)',
              color: 'var(--color-muted)',
              lineHeight: 1.45,
            }}>
              {toastMode === 'dark' ? t('orbitalDesc') : t('earthDesc')}
            </p>
          </div>

          <button
            onClick={closeToast}
            aria-label={t('close')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-muted)',
              padding: 0,
              lineHeight: 0,
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
