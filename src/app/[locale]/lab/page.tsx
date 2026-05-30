'use client'

import { useState, useEffect, useRef } from 'react'

const TEXTS = [
  'Apuntes que nadie pidió.',
  'Apuntes.',
]

// ── Scramble ──────────────────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234!?#@'

function ScrambleDemo() {
  const [idx, setIdx] = useState(0)
  const [display, setDisplay] = useState(TEXTS[0])
  const rafRef = useRef<number>(0)

  function trigger() {
    const next = TEXTS[(idx + 1) % TEXTS.length]
    const nextIdx = (idx + 1) % TEXTS.length
    setIdx(nextIdx)

    let frame = 0
    const total = next.length * 4

    function tick() {
      setDisplay(
        next.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          if (frame > i * 3.5) return ch
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      frame++
      if (frame <= total) rafRef.current = requestAnimationFrame(tick)
      else setDisplay(next)
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }

  return <Demo label="Scramble" sub="Letras random → resuelven al texto final" onTrigger={trigger} display={display} />
}

// ── Dissolve escalonado ───────────────────────────────────────────────────────
function DissolveDemo() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [shown, setShown] = useState(TEXTS[0])
  const [next, setNext] = useState(TEXTS[1])

  function trigger() {
    const nextIdx = (idx + 1) % TEXTS.length
    setNext(TEXTS[nextIdx])
    setPhase('out')
    setTimeout(() => {
      setShown(TEXTS[nextIdx])
      setPhase('in')
      setTimeout(() => { setPhase('idle'); setIdx(nextIdx) }, 600)
    }, 500)
  }

  const chars = shown.split('')

  return (
    <Demo label="Dissolve escalonado" sub="Cada carácter fade con delay incremental" onTrigger={trigger}
      display={
        <span aria-hidden="true">
          {chars.map((ch, i) => (
            <span key={`${i}-${shown}`} style={{
              display: 'inline-block',
              whiteSpace: ch === ' ' ? 'pre' : undefined,
              opacity: phase === 'out' ? 0 : phase === 'in' ? 1 : 1,
              transform: phase === 'out' ? 'translateY(-6px)' : phase === 'in' ? 'translateY(0)' : 'none',
              transition: `opacity 300ms ease ${i * 18}ms, transform 300ms ease ${i * 18}ms`,
            }}>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </span>
      }
    />
  )
}

// ── Blur dissolve ─────────────────────────────────────────────────────────────
function BlurDemo() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [shown, setShown] = useState(TEXTS[0])

  function trigger() {
    const nextIdx = (idx + 1) % TEXTS.length
    setPhase('out')
    setTimeout(() => {
      setShown(TEXTS[nextIdx])
      setPhase('in')
      setTimeout(() => { setPhase('idle'); setIdx(nextIdx) }, 500)
    }, 350)
  }

  return (
    <Demo label="Blur dissolve" sub="Texto se disuelve en niebla → reaparece" onTrigger={trigger}
      display={
        <span style={{
          display: 'inline-block',
          opacity:    phase === 'out' ? 0 : 1,
          filter:     phase === 'out' ? 'blur(12px)' : phase === 'in' ? 'blur(8px)' : 'blur(0px)',
          transform:  phase === 'out' ? 'scale(1.04)' : 'scale(1)',
          transition: phase === 'out'
            ? 'opacity 350ms ease, filter 350ms ease, transform 350ms ease'
            : 'opacity 500ms ease, filter 500ms ease, transform 500ms ease',
        }}>
          {shown}
        </span>
      }
    />
  )
}

// ── Clip-path wipe ────────────────────────────────────────────────────────────
function ClipDemo() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [shown, setShown] = useState(TEXTS[0])

  function trigger() {
    const nextIdx = (idx + 1) % TEXTS.length
    setPhase('out')
    setTimeout(() => {
      setShown(TEXTS[nextIdx])
      setPhase('in')
      setTimeout(() => { setPhase('idle'); setIdx(nextIdx) }, 450)
    }, 380)
  }

  return (
    <Demo label="Clip-path wipe" sub="Una cortina barre el texto de arriba a abajo" onTrigger={trigger}
      display={
        <span style={{
          display: 'inline-block',
          clipPath: phase === 'out'
            ? 'inset(0 0 100% 0)'
            : phase === 'in'
            ? 'inset(100% 0 0 0)'
            : 'inset(0 0 0% 0)',
          opacity: phase === 'idle' ? 1 : 0.9,
          transition: 'clip-path 380ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms',
        }}>
          {shown}
        </span>
      }
    />
  )
}

// ── Flip actual (referencia) ──────────────────────────────────────────────────
function FlipDemo() {
  const [idx, setIdx] = useState(0)

  function trigger() { setIdx(i => (i + 1) % TEXTS.length) }

  return (
    <Demo label="Flip 3D actual" sub="rotateX — el que está en producción ahora" onTrigger={trigger}
      display={
        <span style={{ display: 'grid' }}>
          {TEXTS.map((t, i) => (
            <span key={i} style={{
              gridArea: '1/1',
              transition: 'transform 380ms ease-in-out, opacity 280ms ease',
              transform: i === idx ? 'perspective(700px) rotateX(0deg)' : `perspective(700px) rotateX(${i < idx ? 90 : -90}deg)`,
              opacity: i === idx ? 1 : 0,
            }}>{t}</span>
          ))}
        </span>
      }
    />
  )
}

// ── Demo wrapper ──────────────────────────────────────────────────────────────
function Demo({ label, sub, onTrigger, display }: {
  label: string
  sub: string
  onTrigger: () => void
  display: React.ReactNode
}) {
  return (
    <div style={{
      borderTop: '1px solid #272522',
      paddingTop: '2.5rem',
      paddingBottom: '2.5rem',
      display: 'grid',
      gridTemplateColumns: '14rem 1fr auto',
      gap: '2rem',
      alignItems: 'center',
    }}>
      <div>
        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#F0EFEC', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'ui-monospace' }}>{label}</p>
        <p style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: '#4A4A47', lineHeight: 1.5, fontFamily: 'ui-monospace' }}>{sub}</p>
      </div>
      <div style={{
        fontFamily: 'Georgia, serif',
        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
        fontWeight: 400,
        color: '#F0EFEC',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        minHeight: '3rem',
        display: 'flex',
        alignItems: 'center',
      }}>
        {display}
      </div>
      <button
        onClick={onTrigger}
        style={{
          background: 'none',
          border: '1px solid #272522',
          color: '#7A7975',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontFamily: 'ui-monospace',
          whiteSpace: 'nowrap',
          transition: 'border-color 200ms, color 200ms',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#5A7C94'; (e.currentTarget as HTMLButtonElement).style.color = '#5A7C94' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#272522'; (e.currentTarget as HTMLButtonElement).style.color = '#7A7975' }}
      >
        Trigger →
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LabPage() {
  return (
    <div style={{
      minHeight: '100svh',
      background: '#0F0F0D',
      padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 3rem)',
      maxWidth: '80rem',
      margin: '0 auto',
    }}>
      <p style={{ fontFamily: 'ui-monospace', fontSize: '0.65rem', color: '#3A3A37', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 0.5rem' }}>
        davila.uno / lab
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 400, color: '#F0EFEC', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>
        Micro-interacciones — Transición de texto
      </h1>
      <p style={{ fontFamily: 'ui-monospace', fontSize: '0.7rem', color: '#4A4A47', margin: '0 0 1rem' }}>
        Rama: exp/microinteractions · No indexado · Trigger cada demo para comparar
      </p>

      <FlipDemo />
      <ScrambleDemo />
      <DissolveDemo />
      <BlurDemo />
      <ClipDemo />
    </div>
  )
}
