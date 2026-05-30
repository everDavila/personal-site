'use client'

import { useState, useRef, useCallback } from 'react'

type Mode = 'dark' | 'light'

const BLOCKS: Record<Mode, { p1: string; p2: string }> = {
  dark: {
    p1: 'Me llevo bien con los problemas difíciles. Los sistemas complejos me parecen fascinantes — como puzzles enormes donde cada pieza importa. Y sí, también dibujo garabatos cuando pienso.',
    p2: 'Soy ese tipo que se pregunta por qué los trámites del Estado son tan confusos. Entonces los diseño mejor. Trabajo con datos, personas, burocracia y, a veces, mucha cafeína.',
  },
  light: {
    p1: 'Diseño sistemas digitales para que funcionen en el mundo real, no en el ideario de Silicon Valley. Cada interfaz es una pregunta sobre quién tiene acceso y quién no.',
    p2: 'Diseñador UX/UI con enfoque en sistemas digitales complejos para el sector público peruano. He trabajado en la intersección del diseño centrado en el usuario y la política pública digital.',
  },
}

const COLORS: Record<Mode, { bg: string; text: string; muted: string; border: string; label: string }> = {
  dark:  { bg: '#0F0F0D', text: '#F0EFEC', muted: '#7A7975', border: '#1E1E1B', label: 'Modo oscuro → claro' },
  light: { bg: '#F5F4F0', text: '#111110', muted: '#6A6A67', border: '#D6D4CF', label: 'Modo claro → oscuro' },
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234!?#@'

// ── Blur dissolve ─────────────────────────────────────────────────────────────
function BlurEffect({ mode, shown }: { mode: Mode; shown: Mode }) {
  const b = BLOCKS[shown]
  const transitioning = mode !== shown
  const style: React.CSSProperties = {
    opacity:    transitioning ? 0 : 1,
    filter:     transitioning ? 'blur(16px)' : 'blur(0px)',
    transform:  transitioning ? 'scale(1.02)' : 'scale(1)',
    transition: transitioning
      ? 'opacity 380ms ease, filter 380ms ease, transform 380ms ease'
      : 'opacity 500ms ease, filter 500ms ease, transform 500ms ease',
  }
  return <TwoParas p1={b.p1} p2={b.p2} style={style} />
}

// ── Word dissolve ─────────────────────────────────────────────────────────────
function WordEffect({ mode, shown }: { mode: Mode; shown: Mode }) {
  const b = BLOCKS[shown]
  const out = mode !== shown
  const words = (b.p1 + ' ' + b.p2).split(' ')
  return (
    <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.0625rem', lineHeight: 1.75, letterSpacing: '-0.01em' }}>
      {words.map((w, i) => (
        <span key={`${shown}-${i}`} style={{
          display: 'inline-block',
          marginRight: '0.28em',
          opacity:   out ? 0 : 1,
          transform: out ? 'translateY(-5px)' : 'translateY(0)',
          transition: `opacity 260ms ease ${i * 10}ms, transform 260ms ease ${i * 10}ms`,
        }}>{w}</span>
      ))}
    </p>
  )
}

// ── Scramble ──────────────────────────────────────────────────────────────────
function ScrambleEffect({ targetMode, shown }: { targetMode: Mode; shown: Mode }) {
  const [d1, setD1] = useState(BLOCKS[shown].p1)
  const [d2, setD2] = useState(BLOCKS[shown].p2)
  const prevMode = useRef(shown)

  if (prevMode.current !== shown) {
    prevMode.current = shown
    const b = BLOCKS[shown]
    const go = (target: string, set: (s: string) => void) => {
      let frame = 0
      const total = Math.min(target.length * 3, 100)
      const tick = () => {
        set(target.split('').map((ch, i) => {
          if (ch === ' ') return ' '
          if (frame > i * 2.5) return ch
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join(''))
        frame++
        if (frame <= total) requestAnimationFrame(tick)
        else set(target)
      }
      requestAnimationFrame(tick)
    }
    go(b.p1, setD1)
    go(b.p2, setD2)
  }

  return <TwoParas p1={d1} p2={d2} />
}

// ── Flip 3D ───────────────────────────────────────────────────────────────────
function FlipEffect({ mode, shown }: { mode: Mode; shown: Mode }) {
  const modes: Mode[] = ['dark', 'light']
  return (
    <div style={{ display: 'grid' }}>
      {modes.map(m => (
        <div key={m} style={{
          gridArea: '1/1',
          transition: 'transform 380ms ease-in-out, opacity 280ms ease',
          transform: m === shown
            ? 'perspective(700px) rotateX(0deg)'
            : `perspective(700px) rotateX(${m === 'dark' && shown === 'light' ? 90 : -90}deg)`,
          opacity: m === shown ? 1 : 0,
          pointerEvents: m === shown ? 'auto' : 'none',
        }}>
          <TwoParas p1={BLOCKS[m].p1} p2={BLOCKS[m].p2} />
        </div>
      ))}
    </div>
  )
}

// ── Shared text block ─────────────────────────────────────────────────────────
function TwoParas({ p1, p2, style }: { p1: string; p2: string; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <p style={{ margin: '0 0 1rem', fontFamily: 'Georgia, serif', fontSize: '1.0625rem', lineHeight: 1.75, letterSpacing: '-0.01em' }}>{p1}</p>
      <p style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.0625rem', lineHeight: 1.75, letterSpacing: '-0.01em' }}>{p2}</p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LabPage() {
  const [mode, setMode] = useState<Mode>('dark')
  // "shown" lags behind mode so effects can animate from the old content
  const [shown, setShown] = useState<Mode>('dark')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const toggle = useCallback(() => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark'
    setMode(next)
    // swap content mid-transition (blur dissolve: ~380ms out)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setShown(next), 380)
  }, [mode])

  const c = COLORS[mode]

  return (
    <div style={{
      minHeight: '100svh',
      background: c.bg,
      color: c.text,
      transition: 'background 600ms ease, color 600ms ease',
      padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 3rem)',
    }}>
      <div style={{ maxWidth: '52rem', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', marginBottom: '3.5rem' }}>
          <div>
            <p style={{ fontFamily: 'ui-monospace', fontSize: '0.6rem', color: c.muted, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 0.4rem' }}>
              davila.uno / lab · exp/microinteractions
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)', fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 0.25rem' }}>
              Transición narrativa — color + texto
            </h1>
            <p style={{ fontFamily: 'ui-monospace', fontSize: '0.65rem', color: c.muted, margin: 0 }}>
              Un trigger cambia fondo, color de texto y contenido — como en producción.
            </p>
          </div>

          {/* Global trigger */}
          <button onClick={toggle} style={{
            background: c.text,
            color: c.bg,
            border: 'none',
            padding: '0.6rem 1.25rem',
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontFamily: 'ui-monospace',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 600ms ease, color 600ms ease',
          }}>
            {c.label}
          </button>
        </div>

        {/* Demos */}
        {[
          { label: 'Blur dissolve', sub: 'El texto se disuelve en niebla mientras el fondo cambia', el: <BlurEffect mode={mode} shown={shown} /> },
          { label: 'Dissolve por palabra', sub: 'Cada palabra fade/sube escalonada', el: <WordEffect mode={mode} shown={shown} /> },
          { label: 'Scramble', sub: 'Letras random → resuelven al texto — ⚠ puede cansar en largo', el: <ScrambleEffect targetMode={mode} shown={shown} /> },
          { label: 'Flip 3D actual', sub: 'rotateX — referencia del estado en producción', el: <FlipEffect mode={mode} shown={shown} /> },
        ].map(({ label, sub, el }) => (
          <div key={label} style={{ borderTop: `1px solid ${c.border}`, paddingBlock: '2.5rem', transition: 'border-color 600ms ease' }}>
            <p style={{ fontFamily: 'ui-monospace', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.text, margin: '0 0 0.3rem', transition: 'color 600ms ease' }}>{label}</p>
            <p style={{ fontFamily: 'ui-monospace', fontSize: '0.62rem', color: c.muted, margin: '0 0 1.5rem', transition: 'color 600ms ease' }}>{sub}</p>
            <div style={{ color: c.text, transition: 'color 600ms ease' }}>{el}</div>
          </div>
        ))}

        {/* ── Sección: blend-mode — fondo blanco sin cuadrado ── */}
        <div style={{ borderTop: `1px solid ${c.border}`, paddingBlock: '2.5rem', transition: 'border-color 600ms ease' }}>
          <p style={{ fontFamily: 'ui-monospace', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.text, margin: '0 0 0.3rem', transition: 'color 600ms ease' }}>
            mix-blend-mode — PNG fondo blanco sin cuadrado
          </p>
          <p style={{ fontFamily: 'ui-monospace', fontSize: '0.62rem', color: c.muted, margin: '0 0 1.75rem', transition: 'color 600ms ease' }}>
            Dibujado en papel blanco / lápiz negro. El trigger cambia el fondo — el blanco desaparece sin Photoshop.
          </p>

          {/* Comparación en 2 fondos side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: c.border }}>
            {/* Fondo claro — normalize + multiply */}
            <div style={{ background: '#E8E5DF', padding: '2rem' }}>
              <p style={{ fontFamily: 'ui-monospace', fontSize: '0.6rem', color: '#6A6A67', margin: '0 0 0.35rem' }}>
                Fondo claro · <code>multiply</code>
              </p>
              <p style={{ fontFamily: 'ui-monospace', fontSize: '0.55rem', color: '#9A9A97', margin: '0 0 1rem' }}>
                grayscale → brightness → contrast → multiply
              </p>
              <img src="/lab-character.png" alt="Character"
                style={{
                  width: '100%', display: 'block',
                  filter: 'grayscale(1) brightness(1.4) contrast(2)',
                  mixBlendMode: 'multiply',
                }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }}
              />
            </div>

            {/* Fondo oscuro — normalize + invert + screen */}
            <div style={{ background: '#0F0F0D', padding: '2rem' }}>
              <p style={{ fontFamily: 'ui-monospace', fontSize: '0.6rem', color: '#7A7975', margin: '0 0 0.35rem' }}>
                Fondo oscuro · <code>invert + screen</code>
              </p>
              <p style={{ fontFamily: 'ui-monospace', fontSize: '0.55rem', color: '#4A4A47', margin: '0 0 1rem' }}>
                grayscale → brightness → contrast → invert → screen
              </p>
              <img src="/lab-character.png" alt="Character"
                style={{
                  width: '100%', display: 'block',
                  filter: 'grayscale(1) brightness(1.4) contrast(2) invert(1)',
                  mixBlendMode: 'screen',
                }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }}
              />
            </div>
          </div>

          {/* Referencia: original con el cuadrado */}
          <div style={{ marginTop: '1px', background: mode === 'dark' ? '#0F0F0D' : '#E8E5DF', padding: '2rem' }}>
            <p style={{ fontFamily: 'ui-monospace', fontSize: '0.6rem', color: c.muted, margin: '0 0 1rem' }}>
              Original sin blend (el "cuadrado" que queremos eliminar)
            </p>
            <img src="/lab-character.png" alt="Character"
              style={{ width: '40%', display: 'block' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
