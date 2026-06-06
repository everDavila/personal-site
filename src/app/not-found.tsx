import { headers } from 'next/headers'
import { getPage404 } from '@/sanity/queries/page404'
import { RotatingNote } from '@/components/not-found/RotatingNote'
import { LogoMark } from '@/components/nav/LogoMark'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'

const COPY: Record<Locale, { eyebrow: string; ctaHome: string; ctaWork: string; noteLabel: string }> = {
  es: { eyebrow: 'Error de navegación', ctaHome: 'Ir al inicio',  ctaWork: 'Explorar proyectos', noteLabel: 'Nota del sistema' },
  en: { eyebrow: 'Navigation error',    ctaHome: 'Go home',       ctaWork: 'Explore projects',   noteLabel: 'System note'       },
  pt: { eyebrow: 'Erro de navegação',   ctaHome: 'Ir ao início',  ctaWork: 'Explorar projetos',  noteLabel: 'Nota do sistema'   },
  qu: { eyebrow: 'Puriy pantay',        ctaHome: 'Qallariypi kutiy',  ctaWork: 'Llamk\'ayta qhaway', noteLabel: 'Sistemap willakuyn'},
  zh: { eyebrow: '导航错误',             ctaHome: '返回首页',           ctaWork: '浏览项目',            noteLabel: '系统备注'          },
}

function lastSignal() {
  return new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default async function RootNotFound() {
  const headersList = await headers()
  const rawLocale = headersList.get('X-NEXT-INTL-LOCALE') ?? 'es'
  const locale: Locale = (['es', 'en', 'pt', 'qu', 'zh'] as Locale[]).includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : 'es'

  const data  = await getPage404()
  const c     = COPY[locale] ?? COPY.en

  const title = data.title[locale] || data.title.es
  const body  = data.body[locale]  || data.body.es
  const notes = data.notes.map(n => n[locale] || n.es || '').filter(Boolean)

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
      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .nf-grid { grid-template-columns: 1fr !important; }
          .nf-visual { order: -1; max-width: 280px; margin-inline: auto; }
          .nf-content { order: 1; }
        }
      `}</style>

      {/* ── Top bar ── */}
      <nav style={{
        position: 'relative',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.125rem clamp(1.5rem, 5vw, 3rem)',
        borderBottom: '1px solid #1E1C1A',
        color: '#F0EFEC',
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
        position: 'relative',
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
            fontFamily: 'Georgia, serif',
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

          <RotatingNote notes={notes} />

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'nowrap', marginTop: '0.25rem' }}>
            <a href="/" style={{
              fontSize: '0.6875rem', color: '#F0EFEC',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              textDecoration: 'none',
              border: '1px solid #2E2C2A', borderRadius: '2px',
              padding: '0.6rem 1.1rem',
            }}>
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

          <span style={{ fontSize: '0.625rem', color: '#2E2C2A', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em' }}>
            LAST_SIGNAL: {signal}
          </span>
        </div>

        {/* RIGHT — image */}
        <div className="nf-visual" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src="/error-404.jpg"
            alt=""
            width={500}
            height={600}
            style={{
              maxWidth: '100%',
              maxHeight: '65vh',
              height: 'auto',
              width: 'auto',
              filter: 'invert(1)',
              mixBlendMode: 'screen',
              opacity: 0.9,
            }}
            priority
          />
        </div>
      </div>
    </div>
  )
}
