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

const css = `
@keyframes mc-orbit {
  from { transform: rotateX(70deg) rotateZ(0deg); }
  to   { transform: rotateX(70deg) rotateZ(360deg); }
}
@keyframes mc-earth-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.mc-orbit-ring {
  opacity: 0;
  transition: opacity 400ms ease;
}
.mc-dark-btn:hover .mc-orbit-ring {
  opacity: 1;
  animation: mc-orbit 4s linear infinite;
}
.mc-earth-sphere {
  opacity: 0;
  transition: opacity 400ms ease;
}
.mc-light-btn:hover .mc-earth-sphere {
  opacity: 1;
  animation: mc-earth-spin 12s linear infinite;
}
`

export function ModeChooser({ hasMode, question, darkLabel, darkDesc, lightLabel, lightDesc, footer }: Props) {
  const [visible, setVisible] = useState(!hasMode)
  const [, startTransition] = useTransition()

  if (!visible) return null

  const choose = (mode: 'dark' | 'light') => {
    startTransition(async () => {
      await setNarrativeMode(mode)
      document.documentElement.dataset.mode = mode
      setVisible(false)
    })
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={question}
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
          {/* Orbital button */}
          <button
            className="mc-dark-btn"
            onClick={() => choose('dark')}
            style={{
              background: '#0F0F0D',
              border: 'none',
              padding: 'clamp(1.75rem, 4vw, 3rem)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              transition: 'background 180ms ease',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#181715' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0F0F0D' }}
          >
            {/* Orbit ring */}
            <div className="mc-orbit-ring" style={{
              position: 'absolute',
              top: '50%', right: '2rem',
              width: 56, height: 56,
              marginTop: -28,
              borderRadius: '50%',
              border: '1px solid #3A3A37',
              boxShadow: 'inset 0 0 0 1px #272522',
              pointerEvents: 'none',
            }}>
              {/* dot on orbit */}
              <div style={{
                position: 'absolute',
                top: -2, left: '50%',
                width: 4, height: 4,
                marginLeft: -2,
                borderRadius: '50%',
                background: '#5A7C94',
              }} />
            </div>

            <span style={{
              fontFamily: 'var(--font-serif, Georgia, serif)',
              fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
              color: '#F0EFEC',
              fontWeight: 400,
              letterSpacing: '-0.015em',
            }}>
              {darkLabel}
            </span>
            <span style={{
              fontSize: '0.8125rem',
              color: '#7A7975',
              lineHeight: 1.6,
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
              maxWidth: '22ch',
            }}>
              {darkDesc}
            </span>
          </button>

          {/* Earth button */}
          <button
            className="mc-light-btn"
            onClick={() => choose('light')}
            style={{
              background: '#F5F4F0',
              border: 'none',
              padding: 'clamp(1.75rem, 4vw, 3rem)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              transition: 'background 180ms ease',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EDEDEA' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F4F0' }}
          >
            {/* Earth sphere */}
            <div className="mc-earth-sphere" style={{
              position: 'absolute',
              top: '50%', right: '2rem',
              width: 48, height: 48,
              marginTop: -24,
              borderRadius: '50%',
              overflow: 'hidden',
              pointerEvents: 'none',
              boxShadow: '0 0 0 1px #C0BEBB',
            }}>
              {/* landmass strips — muted pastel */}
              <div style={{
                width: '200%',
                height: '100%',
                background: `
                  radial-gradient(ellipse 18px 10px at 30% 35%, #A8A6A4 0%, transparent 100%),
                  radial-gradient(ellipse 12px 8px  at 65% 55%, #AEACAA 0%, transparent 100%),
                  radial-gradient(ellipse 10px 6px  at 20% 70%, #A6A4A2 0%, transparent 100%),
                  #CCCAC8
                `,
              }} />
            </div>

            <span style={{
              fontFamily: 'var(--font-serif, Georgia, serif)',
              fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
              color: '#111110',
              fontWeight: 400,
              letterSpacing: '-0.015em',
            }}>
              {lightLabel}
            </span>
            <span style={{
              fontSize: '0.8125rem',
              color: '#6B6B6B',
              lineHeight: 1.6,
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
              maxWidth: '22ch',
            }}>
              {lightDesc}
            </span>
          </button>
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
    </>
  )
}
