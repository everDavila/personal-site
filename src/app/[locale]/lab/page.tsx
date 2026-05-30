'use client'

import { useState, useRef } from 'react'

// Textos reales del sitio — dark=lúdico, light=profesional
const BLOCKS = [
  {
    label: 'Lúdico (oscuro)',
    p1: 'Me llevo bien con los problemas difíciles. Los sistemas complejos me parecen fascinantes — como puzzles enormes donde cada pieza importa. Y sí, también dibujo garabatos cuando pienso.',
    p2: 'Soy ese tipo que se pregunta por qué los trámites del Estado son tan confusos. Entonces los diseño mejor. Trabajo con datos, personas, burocracia y, a veces, mucha cafeína.',
  },
  {
    label: 'Profesional (claro)',
    p1: 'Diseño sistemas digitales para que funcionen en el mundo real, no en el ideario de Silicon Valley. Cada interfaz es una pregunta sobre quién tiene acceso y quién no.',
    p2: 'Diseñador UX/UI con enfoque en sistemas digitales complejos para el sector público peruano. He trabajado en la intersección del diseño centrado en el usuario y la política pública digital.',
  },
]

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234!?#@'

// ── Shared trigger button ─────────────────────────────────────────────────────
function TriggerBtn({ onClick, label = 'Trigger →' }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: '1px solid #272522', color: '#7A7975',
      fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em',
      padding: '0.4rem 0.85rem', cursor: 'pointer', fontFamily: 'ui-monospace',
      transition: 'border-color 180ms, color 180ms', flexShrink: 0,
    }}
      onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#5A7C94'; b.style.color = '#5A7C94' }}
      onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = '#272522'; b.style.color = '#7A7975' }}
    >{label}</button>
  )
}

// ── Demo shell ────────────────────────────────────────────────────────────────
function Shell({ label, sub, note, current, onTrigger, children }: {
  label: string; sub: string; note?: string; current: string
  onTrigger: () => void; children: React.ReactNode
}) {
  return (
    <div style={{ borderTop: '1px solid #1A1A18', paddingBlock: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, color: '#F0EFEC', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'ui-monospace' }}>{label}</p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.65rem', color: '#3A3A37', fontFamily: 'ui-monospace' }}>{sub}</p>
          {note && <p style={{ margin: '0.3rem 0 0', fontSize: '0.65rem', color: '#5A4A37', fontFamily: 'ui-monospace' }}>⚠ {note}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.6rem', color: '#3A3A37', fontFamily: 'ui-monospace' }}>{current}</span>
          <TriggerBtn onClick={onTrigger} />
        </div>
      </div>
      <div style={{ maxWidth: '52ch' }}>
        {children}
      </div>
    </div>
  )
}

function TextBlock({ p1, p2, style }: { p1: React.ReactNode; p2: React.ReactNode; style?: React.CSSProperties }) {
  const base: React.CSSProperties = {
    fontFamily: 'Georgia, serif', fontSize: '1.0625rem', fontWeight: 400,
    color: '#F0EFEC', lineHeight: 1.75, letterSpacing: '-0.01em',
  }
  return (
    <div style={style}>
      <p style={{ ...base, margin: '0 0 1rem' }}>{p1}</p>
      <p style={{ ...base, margin: 0 }}>{p2}</p>
    </div>
  )
}

// ── 1. Blur dissolve ──────────────────────────────────────────────────────────
function BlurDemo() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [shown, setShown] = useState(0)

  function trigger() {
    const next = (idx + 1) % BLOCKS.length
    setPhase('out')
    setTimeout(() => { setShown(next); setPhase('in')
      setTimeout(() => { setPhase('idle'); setIdx(next) }, 550)
    }, 380)
  }

  const b = BLOCKS[shown]
  const outStyle: React.CSSProperties = { opacity: 0, filter: 'blur(14px)', transform: 'scale(1.02)', transition: 'opacity 380ms ease, filter 380ms ease, transform 380ms ease' }
  const inStyle:  React.CSSProperties = { opacity: 0, filter: 'blur(14px)', transform: 'scale(0.98)', transition: 'none' }
  const idleStyle: React.CSSProperties = { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)',  transition: 'opacity 550ms ease, filter 550ms ease, transform 550ms ease' }

  const s = phase === 'out' ? outStyle : phase === 'in' ? inStyle : idleStyle

  return (
    <Shell label="Blur dissolve" sub="Texto se disuelve en niebla → reaparece" current={b.label} onTrigger={trigger}>
      <TextBlock style={s} p1={b.p1} p2={b.p2} />
    </Shell>
  )
}

// ── 2. Dissolve escalonado por palabra ────────────────────────────────────────
function WordDissolveDemo() {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [shown, setShown] = useState(0)

  function trigger() {
    const next = (idx + 1) % BLOCKS.length
    setPhase('out')
    setTimeout(() => { setShown(next); setPhase('in')
      setTimeout(() => { setPhase('idle'); setIdx(next) }, 700)
    }, 500)
  }

  const b = BLOCKS[shown]
  const fullText = b.p1 + ' ' + b.p2
  const words = fullText.split(' ')

  return (
    <Shell label="Dissolve por palabra" sub="Cada palabra fade/sube con delay escalonado" current={b.label} onTrigger={trigger}>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.0625rem', color: '#F0EFEC', lineHeight: 1.75, margin: 0, letterSpacing: '-0.01em' }}>
        {words.map((w, i) => (
          <span key={`${shown}-${i}`} style={{
            display: 'inline-block',
            marginRight: '0.28em',
            opacity: phase === 'out' ? 0 : phase === 'in' ? 1 : 1,
            transform: phase === 'out' ? 'translateY(-5px)' : 'translateY(0)',
            transition: `opacity 280ms ease ${i * 12}ms, transform 280ms ease ${i * 12}ms`,
          }}>{w}</span>
        ))}
      </p>
    </Shell>
  )
}

// ── 3. Scramble (para comparar — puede cansar en texto largo) ─────────────────
function ScrambleDemo() {
  const [idx, setIdx] = useState(0)
  const [displayP1, setDisplayP1] = useState(BLOCKS[0].p1)
  const [displayP2, setDisplayP2] = useState(BLOCKS[0].p2)
  const rafRef = useRef<number>(0)

  function scrambleText(target: string, onUpdate: (s: string) => void) {
    let frame = 0
    const total = Math.min(target.length * 3, 120)
    function tick() {
      onUpdate(target.split('').map((ch, i) => {
        if (ch === ' ') return ' '
        if (frame > i * 2.5) return ch
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join(''))
      frame++
      if (frame <= total) requestAnimationFrame(tick)
      else onUpdate(target)
    }
    requestAnimationFrame(tick)
  }

  function trigger() {
    const next = (idx + 1) % BLOCKS.length
    setIdx(next)
    cancelAnimationFrame(rafRef.current)
    scrambleText(BLOCKS[next].p1, setDisplayP1)
    scrambleText(BLOCKS[next].p2, setDisplayP2)
  }

  return (
    <Shell label="Scramble" sub="Letras random → resuelven al texto final" note="Puede cansar en texto largo" current={BLOCKS[idx].label} onTrigger={trigger}>
      <TextBlock p1={displayP1} p2={displayP2} />
    </Shell>
  )
}

// ── 4. Flip 3D actual (referencia) ────────────────────────────────────────────
function FlipDemo() {
  const [idx, setIdx] = useState(0)
  const [next, setNext] = useState(1)
  const [flipping, setFlipping] = useState(false)

  function trigger() {
    if (flipping) return
    setFlipping(true)
    setTimeout(() => { setIdx(i => (i + 1) % BLOCKS.length); setNext(n => (n + 1) % BLOCKS.length); setFlipping(false) }, 420)
  }

  const b = BLOCKS[idx]
  return (
    <Shell label="Flip 3D actual" sub="rotateX — referencia del efecto en producción" current={b.label} onTrigger={trigger}>
      <div style={{ display: 'grid' }}>
        {BLOCKS.map((bl, i) => (
          <div key={i} style={{
            gridArea: '1/1',
            transition: 'transform 380ms ease-in-out, opacity 280ms ease',
            transform: i === idx
              ? 'perspective(700px) rotateX(0deg)'
              : `perspective(700px) rotateX(${i < idx ? 90 : -90}deg)`,
            opacity: i === idx ? 1 : 0,
            pointerEvents: i === idx ? 'auto' : 'none',
          }}>
            <TextBlock p1={bl.p1} p2={bl.p2} />
          </div>
        ))}
      </div>
    </Shell>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LabPage() {
  return (
    <div style={{
      minHeight: '100svh',
      background: '#0F0F0D',
      padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 3rem)',
      maxWidth: '72rem',
      margin: '0 auto',
    }}>
      <p style={{ fontFamily: 'ui-monospace', fontSize: '0.6rem', color: '#2E2E2B', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 0.5rem' }}>
        davila.uno / lab · exp/microinteractions
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 400, color: '#F0EFEC', letterSpacing: '-0.02em', margin: '0 0 0.35rem' }}>
        Transición de texto narrativo — 2 párrafos
      </h1>
      <p style={{ fontFamily: 'ui-monospace', fontSize: '0.65rem', color: '#3A3A37', margin: '0 0 0.25rem' }}>
        Textos reales del sitio · Trigger cada demo para comparar · No indexado
      </p>

      <BlurDemo />
      <WordDissolveDemo />
      <ScrambleDemo />
      <FlipDemo />
    </div>
  )
}
