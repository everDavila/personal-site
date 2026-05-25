import { getExperience } from '@/sanity/queries/experience'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import type { WorkEntry, EducationEntry } from '@/sanity/queries/experience'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'

export const dynamic = 'force-dynamic'

/* ─── Featured work entry: period | title + company + desc + tags ── */
function FeaturedEntry({ entry, locale, currentLabel }: {
  entry: WorkEntry
  locale: Locale
  currentLabel: string
}) {
  const role = localized(entry.role, locale)
  const desc = localized(entry.description, locale)

  return (
    <div className="exp-feat-row">
      {/* Period column */}
      <div>
        <time style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          lineHeight: 1.5,
          whiteSpace: 'pre-line',
        }}>
          {entry.period.replace(/\s*[–—]\s*/g, '\n')}
        </time>
      </div>

      {/* Content column */}
      <div>
        <h3 style={{
          fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
          fontWeight: 700,
          color: 'var(--color-text)',
          lineHeight: 1.2,
          margin: '0 0 0.375rem',
          letterSpacing: '-0.02em',
        }}>
          {role.value || entry.company}
          {entry.current && (
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 600,
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginLeft: '0.75rem',
              verticalAlign: 'middle',
            }}>
              {currentLabel}
            </span>
          )}
        </h3>

        <p style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          margin: '0 0 1rem',
        }}>
          {entry.company}
        </p>

        {desc.value && (
          <p style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-muted)',
            lineHeight: 1.7,
            margin: '0 0 1rem',
            maxWidth: '56ch',
          }}>
            {desc.value}
          </p>
        )}

        {entry.tags?.length ? (
          <p style={{
            fontSize: 'var(--text-label)',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-label)',
            margin: 0,
          }}>
            {entry.tags.join(' · ')}
          </p>
        ) : null}
      </div>
    </div>
  )
}

/* ─── Previous work entry: compact table row ── */
function PreviousEntry({ entry, locale }: { entry: WorkEntry; locale: Locale }) {
  const role = localized(entry.role, locale)

  return (
    <div className="exp-prev-row">
      <span style={{
        fontWeight: 600,
        fontSize: 'var(--text-small)',
        color: 'var(--color-text)',
      }}>
        {role.value || entry.company}
      </span>
      <span style={{
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
      }}>
        {entry.company}
      </span>
      <time style={{
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
        textAlign: 'right',
        whiteSpace: 'nowrap',
      }}>
        {entry.period}
      </time>
    </div>
  )
}

/* ─── Education entry: 3-col grid cell ── */
function EduCard({ entry, locale }: { entry: EducationEntry; locale: Locale }) {
  const degree = localized(entry.degree, locale)

  return (
    <div>
      <p style={{
        fontSize: 'var(--text-body)',
        fontWeight: 600,
        color: 'var(--color-text)',
        margin: '0 0 0.25rem',
        lineHeight: 1.3,
      }}>
        {degree.value || '—'}
      </p>
      <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: '0 0 0.15rem' }}>
        {entry.institution}
      </p>
      <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: 0 }}>
        {entry.period}
      </p>
    </div>
  )
}

/* ─── Section label ── */
function SectionLabel({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <p style={{
      fontSize: 'var(--text-label)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-label)',
      color: accent ? 'var(--color-accent)' : 'var(--color-muted)',
      margin: '0 0 2rem',
    }}>
      {children}
    </p>
  )
}

/* ─── Page ── */
export default async function ExperiencePage() {
  const locale = await getLocale() as Locale
  const [data, t, subtitle] = await Promise.all([
    getExperience(),
    getTranslations('experience'),
    getPageSubtitle('experience', locale),
  ])

  const currentLocale = locale
  const work  = data?.workExperience ?? []
  const edu   = data?.education ?? []
  const cvUrl = data?.cvUrl

  const featured = work.filter(e => e.featured)
  const previous = work.filter(e => !e.featured)

  return (
    <>
      {/* ── Header ── */}
      <section
        className="container"
        style={{
          paddingTop: 'var(--spacing-section)',
          paddingBottom: '2.5rem',
          borderBottom: 'var(--border-width) solid var(--color-border)',
        }}
      >
        <h1 style={{
          fontSize: 'var(--text-section)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '0.25rem',
        }}>
          {t('title')}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-muted)',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '52ch',
          }}>
            {subtitle}
          </p>
        )}
      </section>

      {/* ── Featured experience ── */}
      {featured.length > 0 && (
        <section
          className="container section"
          style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
        >
          <SectionLabel accent>{t('featured_label')}</SectionLabel>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {featured.map(entry => (
              <FeaturedEntry
                key={entry._key}
                entry={entry}
                locale={currentLocale}
                currentLabel={t('current')}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Previous experience ── */}
      {previous.length > 0 && (
        <section
          className="container section"
          style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
        >
          <SectionLabel>{t('previous_label')}</SectionLabel>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {previous.map(entry => (
              <PreviousEntry key={entry._key} entry={entry} locale={currentLocale} />
            ))}
          </div>
        </section>
      )}

      {/* ── Education ── */}
      {edu.length > 0 && (
        <section
          className="container section"
          style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
        >
          <SectionLabel accent>{t('edu_label')}</SectionLabel>

          <div className="exp-edu-grid">
            {edu.map(entry => (
              <EduCard key={entry._key} entry={entry} locale={currentLocale} />
            ))}
          </div>

          {cvUrl && (
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: 'var(--border-width) solid var(--color-border)' }}>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
                style={{
                  fontSize: 'var(--text-small)',
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  borderBottom: '1px solid currentColor',
                  paddingBottom: '2px',
                }}
              >
                {t('download_cv')} →
              </a>
            </div>
          )}
        </section>
      )}

      {work.length === 0 && edu.length === 0 && (
        <section className="container section">
          <p style={{ color: 'var(--color-muted)' }}>{t('empty')}</p>
        </section>
      )}
    </>
  )
}
