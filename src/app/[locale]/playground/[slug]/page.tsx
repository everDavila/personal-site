import { notFound }                   from 'next/navigation'
import { setRequestLocale }            from 'next-intl/server'
import { Link }                        from '@/i18n/navigation'
import { getPlaygroundItemBySlug }     from '@/sanity/queries/playground'
import { localized }                   from '@/lib/i18n'
import { LabTimeline }                 from '@/components/lab/LabTimeline'
import type { Locale }                 from '@/lib/i18n'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string; locale: string }> }

const STATUS_LABEL: Record<string, string> = {
  en_proceso: 'En proceso',
  prototipo:  'Prototipo',
  archivado:  'Archivado',
  fallido:    'Fallido',
}

const STATUS_COLOR: Record<string, string> = {
  en_proceso: 'var(--color-accent)',
  prototipo:  'var(--color-text)',
  archivado:  'var(--color-muted)',
  fallido:    'var(--color-muted)',
}

export default async function LabDetailPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)

  const item = await getPlaygroundItemBySlug(slug, locale as Locale)
  if (!item) notFound()

  const loc   = locale as Locale
  const title = localized(item.title, loc, 'es')
  const desc  = item.description ? localized(item.description, loc, 'es') : null
  const idea  = item.idea?.[loc] ?? item.idea?.es ?? null
  const why   = item.why?.[loc]  ?? item.why?.es  ?? null

  return (
    <main style={{ maxWidth: 'var(--max-width, 82rem)', margin: '0 auto', padding: '0 var(--space-side, 2rem)' }}>

      {/* Back */}
      <Link
        href={{ pathname: '/playground' }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          textDecoration: 'none',
          padding: '2rem 0 0',
          transition: 'opacity var(--transition)',
        }}
        className="link-muted"
      >
        ← Lab
      </Link>

      {/* ── Header ── */}
      <header style={{ paddingBlock: 'clamp(2rem, 5vw, 3.5rem)', borderBottom: 'var(--border-width) solid var(--color-border)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
            {item.category}
          </span>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '0.625rem', letterSpacing: '0.1em', color: STATUS_COLOR[item.status] ?? 'var(--color-muted)', textTransform: 'uppercase' }}>
            {STATUS_LABEL[item.status] ?? item.status}
          </span>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--color-muted)' }}>
            {item.year}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          color: 'var(--color-text)',
          margin: '0 0 0.5rem',
          lineHeight: 1.15,
        }}>
          {title.value || '—'}
        </h1>

        {desc?.value && (
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--color-muted)',
            margin: '0 0 1.5rem',
            letterSpacing: '-0.01em',
          }}>
            {desc.value}
          </p>
        )}

        {(item.repoUrl || item.demoUrl) && (
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {item.repoUrl && (
              <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="link-accent"
                style={{ fontSize: 'var(--text-small)', fontWeight: 500 }}>
                GitHub ↗
              </a>
            )}
            {item.demoUrl && (
              <a href={item.demoUrl} target="_blank" rel="noopener noreferrer" className="link-accent"
                style={{ fontSize: 'var(--text-small)', fontWeight: 500 }}>
                Ver demo ↗
              </a>
            )}
          </div>
        )}
      </header>

      {/* ── 01 La Idea ── */}
      {idea && (
        <section className="lab-section">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <span className="lab-section-num">01</span>
            <h2 className="lab-section-title">La Idea</h2>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--color-text)', opacity: 0.8, margin: 0 }}>
            {idea}
          </p>
        </section>
      )}

      {/* ── 02 El Porqué ── */}
      {why && (
        <section className="lab-section">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <span className="lab-section-num">02</span>
            <h2 className="lab-section-title">El Porqué</h2>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--color-text)', opacity: 0.8, margin: 0 }}>
            {why}
          </p>
        </section>
      )}

      {/* ── 03 Bitácora ── */}
      {item.logEntries && item.logEntries.length > 0 && (
        <section className="lab-section">
          <LabTimeline entries={item.logEntries} locale={loc} />
        </section>
      )}

      {/* ── 04 Estado actual ── */}
      <section className="lab-section" style={{ borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <span className="lab-section-num">04</span>
          <h2 className="lab-section-title">Estado actual</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{
            fontFamily: 'ui-monospace,monospace',
            fontSize: '0.6875rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.3rem 0.85rem',
            borderRadius: '2px',
            border: 'var(--border-width) solid var(--color-border)',
            color: STATUS_COLOR[item.status] ?? 'var(--color-muted)',
          }}>
            {STATUS_LABEL[item.status] ?? item.status}
          </span>
          {(item.repoUrl || item.demoUrl) && (
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              {item.repoUrl && (
                <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="link-accent"
                  style={{ fontSize: 'var(--text-small)', fontWeight: 500 }}>
                  GitHub ↗
                </a>
              )}
              {item.demoUrl && (
                <a href={item.demoUrl} target="_blank" rel="noopener noreferrer" className="link-accent"
                  style={{ fontSize: 'var(--text-small)', fontWeight: 500 }}>
                  Ver demo ↗
                </a>
              )}
            </div>
          )}
        </div>
      </section>

    </main>
  )
}
