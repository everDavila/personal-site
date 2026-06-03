'use client'

import { useState, useTransition } from 'react'
import { setNarrativeMode } from '@/app/actions/setMode'

type Props = {
  hasMode:    boolean
  question:   string
  darkLabel:  string
  darkDesc:   string
  lightLabel: string
  lightDesc:  string
  footer:     string
}

export function ModeChooser({ hasMode, question, darkLabel, darkDesc, lightLabel, lightDesc, footer }: Props) {
  const [visible,  setVisible]  = useState(!hasMode)
  const [leaving,  setLeaving]  = useState(false)
  const [, startTransition] = useTransition()

  if (!visible) return null

  const choose = (mode: 'dark' | 'light') => {
    setLeaving(true)
    startTransition(async () => {
      await setNarrativeMode(mode)
      document.documentElement.dataset.mode = mode
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={question}
      onTransitionEnd={() => { if (leaving) setVisible(false) }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0F0F0D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 6vw, 5rem)',
        gap: 'clamp(2.5rem, 5vw, 4rem)',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 700ms ease',
      }}
    >
      <p style={{
        fontSize: '0.6875rem',
        color: '#3A3A37',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        margin: 0,
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        davila.uno
      </p>

      <p style={{
        fontFamily: 'var(--font-serif, Georgia, serif)',
        fontSize: 'clamp(1.625rem, 4vw, 2.75rem)',
        fontWeight: 400,
        color: '#F0EFEC',
        letterSpacing: '-0.025em',
        lineHeight: 1.15,
        textAlign: 'center',
        maxWidth: '22ch',
        margin: 0,
      }}>
        {question}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        maxWidth: '42rem',
        gap: '1px',
        background: '#272522',
      }}>
        <ModeOption
          mode="dark"
          label={darkLabel}
          description={darkDesc}
          bg="#0F0F0D"
          bgHover="#181715"
          labelColor="#F0EFEC"
          descColor="#7A7975"
          onChoose={choose}
        />
        <ModeOption
          mode="light"
          label={lightLabel}
          description={lightDesc}
          bg="#F5F4F0"
          bgHover="#EDEDEA"
          labelColor="#111110"
          descColor="#6B6B6B"
          onChoose={choose}
        />
      </div>

      <p style={{
        fontSize: '0.625rem',
        color: '#2E2E2B',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        margin: 0,
        fontFamily: 'var(--font-mono, monospace)',
      }}>
        {footer}
      </p>
    </div>
  )
}

function ModeOption({
  mode, label, description, bg, bgHover, labelColor, descColor, onChoose,
}: {
  mode: 'dark' | 'light'
  label: string
  description: string
  bg: string
  bgHover: string
  labelColor: string
  descColor: string
  onChoose: (m: 'dark' | 'light') => void
}) {
  return (
    <button
      onClick={() => onChoose(mode)}
      style={{
        background: bg,
        border: 'none',
        padding: 'clamp(1.75rem, 4vw, 3rem)',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        transition: 'background 180ms ease',
        width: '100%',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = bgHover }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = bg }}
    >
      <span style={{
        fontFamily: 'var(--font-serif, Georgia, serif)',
        fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
        color: labelColor,
        fontWeight: 400,
        letterSpacing: '-0.015em',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '0.8125rem',
        color: descColor,
        lineHeight: 1.6,
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        maxWidth: '22ch',
      }}>
        {description}
      </span>
    </button>
  )
}
