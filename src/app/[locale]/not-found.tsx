import { getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { getPage404 } from '@/sanity/queries/page404'
import { RotatingNote } from '@/components/not-found/RotatingNote'
import { LogoMark } from '@/components/nav/LogoMark'

const COPY: Record<Locale, { eyebrow: string; ctaHome: string; ctaWork: string; noteLabel: string }> = {
  es: { eyebrow: 'Error de navegación', ctaHome: 'Volver al inicio',  ctaWork: 'Explorar proyectos', noteLabel: 'Nota del sistema' },
  en: { eyebrow: 'Navigation error',    ctaHome: 'Back to home',      ctaWork: 'Explore projects',   noteLabel: 'System note'       },
  pt: { eyebrow: 'Erro de navegação',   ctaHome: 'Voltar ao início',  ctaWork: 'Explorar projetos',  noteLabel: 'Nota do sistema'   },
  qu: { eyebrow: 'Puriy pantay',        ctaHome: 'Qallariypi kutiy',  ctaWork: 'Llamk\'ayta qhaway', noteLabel: 'Sistemap willakuyn'},
  zh: { eyebrow: '导航错误',             ctaHome: '返回首页',           ctaWork: '浏览项目',            noteLabel: '系统备注'          },
}

function traceId() {
  return `SYS-${Math.random().toString(16).slice(2, 8).toUpperCase()}`
}

function lastSignal() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default async function NotFound() {
  const locale = await getLocale() as Locale
  const data   = await getPage404()
  const c      = COPY[locale] ?? COPY.en

  const title = data.title[locale] || data.title.es
  const body  = data.body[locale]  || data.body.es
  const notes = data.notes.map(n => n[locale] || n.es || '').filter(Boolean)

  const trace  = traceId()
  const signal = lastSignal()

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      background: '#0F0F0D',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      fontFamily: 'var(--font-sans)',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .nf-grid { grid-template-columns: 1fr !important; }
          .nf-visual { order: -1; max-width: 280px; margin-inline: auto; }
          .nf-content { order: 1; }
        }
      `}</style>

      {/* ── Background layers ── */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, #1E1C1A 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.6,
      }} />
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 65% 45%, rgba(90,124,148,0.07) 0%, transparent 55%)',
      }} />

      {/* ── Ghosted 404 ── */}
      <span aria-hidden style={{
        position: 'absolute',
        top: '48%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(10rem, 28vw, 22rem)',
        fontWeight: 400,
        lineHeight: 1,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(255,255,255,0.035)',
        letterSpacing: '-0.05em',
        userSelect: 'none',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        404
      </span>

      {/* ── Top bar ── */}
      <nav style={{
        position: 'relative', zIndex: 1,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.125rem clamp(1.5rem, 5vw, 3rem)',
        borderBottom: '1px solid #1E1C1A',
        color: '#3A3835',
      }}>
        <LogoMark />
        <span style={{ fontSize: '0.6875rem', color: '#3A3835', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em' }}>
          SYS://404
        </span>
      </nav>

      {/* ── Main grid ── */}
      <div className="nf-grid" style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: '2rem',
        padding: 'clamp(2.5rem, 7vw, 5rem) clamp(1.5rem, 5vw, 3rem)',
        position: 'relative', zIndex: 1,
        maxWidth: '80rem',
        marginInline: 'auto',
        width: '100%',
        alignItems: 'center',
      }}>

        {/* LEFT — editorial content */}
        <div className="nf-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          <p style={{
            fontSize: '0.6875rem', color: '#5A7C94',
            textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0,
          }}>
            {c.eyebrow}
          </p>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.875rem, 3.5vw, 2.875rem)',
            fontWeight: 400,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            color: '#F0EFEC',
            margin: 0,
            maxWidth: '20ch',
          }}>
            {title}
          </h1>

          <div style={{ width: '2rem', height: '1px', background: '#272522' }} />

          <p style={{
            fontSize: '0.9375rem', color: '#5A5855',
            lineHeight: 1.7, margin: 0, maxWidth: '42ch',
          }}>
            {body}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            <a href="/" style={{
              fontSize: '0.6875rem', color: '#F0EFEC',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              textDecoration: 'none',
              border: '1px solid #2E2C2A', borderRadius: '2px',
              padding: '0.6rem 1.1rem',
              transition: 'border-color 300ms ease, color 300ms ease',
            }}
            onMouseEnter={undefined}
            >
              ← {c.ctaHome}
            </a>
            <a href="/work" style={{
              fontSize: '0.6875rem', color: '#5A5855',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              textDecoration: 'none',
            }}>
              {c.ctaWork} →
            </a>
          </div>

          {/* Trace metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.625rem', color: '#2E2C2A', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em' }}>
              TRACE_ID: {trace}
            </span>
            <span style={{ fontSize: '0.625rem', color: '#2E2C2A', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em' }}>
              LAST_SIGNAL: {signal}
            </span>
          </div>
        </div>

        {/* RIGHT — system visualization */}
        <div className="nf-visual" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg
            viewBox="0 0 420 420"
            fill="none"
            aria-hidden
            style={{ width: '100%', maxWidth: '420px', opacity: 0.9 }}
          >
            {/* Corner brackets */}
            <path d="M 24 48 L 24 24 L 48 24"  stroke="#2E4052" strokeWidth="1" strokeLinecap="square"/>
            <path d="M 372 24 L 396 24 L 396 48" stroke="#2E4052" strokeWidth="1" strokeLinecap="square"/>
            <path d="M 24 372 L 24 396 L 48 396" stroke="#2E4052" strokeWidth="1" strokeLinecap="square"/>
            <path d="M 396 372 L 396 396 L 372 396" stroke="#2E4052" strokeWidth="1" strokeLinecap="square"/>

            {/* Route paths — dashed */}
            <path d="M 210 60 C 180 110 260 170 210 210"  stroke="#2E4052" strokeWidth="0.75" strokeDasharray="4 10"/>
            <path d="M 90 150 C 140 160 180 195 210 210"  stroke="#2E4052" strokeWidth="0.75" strokeDasharray="4 10" opacity="0.7"/>
            <path d="M 330 100 C 300 150 240 185 210 210" stroke="#2E4052" strokeWidth="0.75" strokeDasharray="4 10" opacity="0.7"/>
            <path d="M 210 210 C 220 270 320 320 370 310" stroke="#2E4052" strokeWidth="0.75" strokeDasharray="4 10" opacity="0.5"/>
            <path d="M 210 210 C 180 280 100 310 70 330"  stroke="#2E4052" strokeWidth="0.75" strokeDasharray="4 10" opacity="0.4"/>

            {/* Orbit ring */}
            <circle cx="210" cy="210" r="46" stroke="#2E4052" strokeWidth="0.5" strokeDasharray="2 7" opacity="0.5"/>

            {/* Glow rings */}
            <circle cx="210" cy="210" r="28" fill="#5A7C94" opacity="0.04"/>
            <circle cx="210" cy="210" r="14" fill="#5A7C94" opacity="0.06"/>

            {/* Active dot */}
            <circle cx="210" cy="210" r="4" fill="#8FD3FF" opacity="0.9"/>
            <circle cx="210" cy="210" r="8" fill="#8FD3FF" opacity="0.15"/>

            {/* Cross marker */}
            <path d="M 305 72 L 311 78 M 311 72 L 305 78" stroke="#2E4052" strokeWidth="1"/>

            {/* Floating labels — top right */}
            <text x="248" y="138" fill="#2E4052" fontSize="7.5" fontFamily="ui-monospace,monospace" letterSpacing="0.5">RUTA_SOLICITADA</text>
            <text x="248" y="152" fill="#5A7C94" fontSize="9"   fontFamily="ui-monospace,monospace" letterSpacing="0.3">/inexistente</text>
            <text x="248" y="168" fill="#2E4052" fontSize="7.5" fontFamily="ui-monospace,monospace" letterSpacing="0.5">ESTADO: NO_ENCONTRADA</text>

            {/* Floating labels — bottom left */}
            <text x="52" y="300" fill="#2E2C2A" fontSize="7.5" fontFamily="ui-monospace,monospace" letterSpacing="0.5">ÚLTIMA_SEÑAL</text>
            <text x="52" y="314" fill="#2E2C2A" fontSize="8"   fontFamily="ui-monospace,monospace">desconocida</text>
            <text x="52" y="328" fill="#2E2C2A" fontSize="7.5" fontFamily="ui-monospace,monospace" letterSpacing="0.5">HORA: {signal}</text>

            {/* Small x marker bottom */}
            <path d="M 338 334 L 342 338 M 342 334 L 338 338" stroke="#272522" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      {/* ── Rotating note — bottom bar ── */}
      <RotatingNote notes={notes} label={c.noteLabel} />
    </div>
  )
}
