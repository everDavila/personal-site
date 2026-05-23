import { getExperience } from '@/sanity/queries/experience'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import type { WorkEntry, EducationEntry } from '@/sanity/queries/experience'

/* ─── Typography tokens ──────────────────────────────── */
const T = {
  role:    { fontSize: 'var(--text-body)',  fontWeight: 600, color: 'var(--color-text)',  margin: 0, lineHeight: 1.25 },
  company: { fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: 0 },
  period:  { fontSize: '0.75rem',           color: 'var(--color-muted)', opacity: 0.55 },
  desc:    { fontSize: 'var(--text-small)', color: 'var(--color-muted)', lineHeight: 1.55, opacity: 0.8, margin: 0,
             display: '-webkit-box' as const, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' },
} as const

/* ─── Work entry ─────────────────────────────────────── */
function WorkEntry({ entry, locale }: { entry: WorkEntry; locale: Locale }) {
  const role = localized(entry.role, locale)
  const desc = localized(entry.description, locale)

  return (
    <div
      className="exp-item"
      style={{
        paddingBlock: '1.5rem',
        borderTop: 'var(--border-width) solid var(--color-border)',
      }}
    >
      {/* Role */}
      <p style={T.role}>
        {role.value || entry.company}
        {entry.current && (
          <span style={{
            fontSize: '0.55rem',
            fontWeight: 600,
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginLeft: '0.6rem',
            verticalAlign: 'middle',
          }}>
            actual
          </span>
        )}
      </p>

      {/* Company + period */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '1rem',
        marginTop: '0.2rem',
      }}>
        <p style={T.company}>{entry.company}</p>
        <time style={T.period}>{entry.period}</time>
      </div>

      {/* Description — 2 lines max */}
      {desc.value && (
        <p style={{ ...T.desc, marginTop: '0.65rem' }}>
          {desc.value}
        </p>
      )}

      {/* Tags — revealed on hover via CSS .exp-tags */}
      {entry.tags?.length ? (
        <p className="exp-tags" style={{
          fontSize: '0.65rem',
          color: 'var(--color-muted)',
          opacity: 0.5,
          marginTop: '0.6rem',
          letterSpacing: '0.03em',
        }}>
          {entry.tags.join(' · ')}
        </p>
      ) : null}
    </div>
  )
}

/* ─── Education entry — ultra compact ───────────────── */
function EduEntry({ entry, locale }: { entry: EducationEntry; locale: Locale }) {
  const degree = localized(entry.degree, locale)

  return (
    <div style={{ paddingBlock: '1.1rem', borderTop: 'var(--border-width) solid var(--color-border)' }}>
      {degree.value && (
        <p style={{
          fontSize: 'var(--text-small)',
          fontWeight: 500,
          color: 'var(--color-text)',
          margin: 0,
          lineHeight: 1.3,
        }}>
          {degree.value}
        </p>
      )}
      <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', opacity: 0.65, margin: '0.15rem 0 0' }}>
        {entry.institution}
        {entry.period ? ` · ${entry.period}` : ''}
      </p>
    </div>
  )
}

/* ─── Column label ───────────────────────────────────── */
function ColLabel({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <p style={{
      fontSize: '0.65rem',
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: muted ? 'var(--color-border)' : 'var(--color-accent)',
      marginBottom: '1.75rem',
    }}>
      {children}
    </p>
  )
}

/* ─── Page ───────────────────────────────────────────── */
export default async function ExperiencePage() {
  const [data, locale, t] = await Promise.all([
    getExperience(),
    getLocale(),
    getTranslations('experience'),
  ])

  const currentLocale = locale as Locale
  const work = data?.workExperience ?? []
  const edu  = data?.education      ?? []
  const cvUrl = data?.cvUrl

  return (
    <main className="container section">
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '3.5rem',
      }}>
        {t('title')}
      </h1>

      {work.length === 0 && edu.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>{t('empty')}</p>
      ) : (
        <div className="exp-grid">

          {/* ── Left 70% — Work experience ── */}
          <section>
            <ColLabel>{t('work_label')}</ColLabel>
            {work.map(entry => (
              <WorkEntry key={entry._key} entry={entry} locale={currentLocale} />
            ))}
          </section>

          {/* ── Right 30% — Education ── */}
          <section className="exp-col-edu">
            <ColLabel muted>{t('edu_label')}</ColLabel>
            {edu.map(entry => (
              <EduEntry key={entry._key} entry={entry} locale={currentLocale} />
            ))}

            {/* CV download */}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: 'var(--text-small)',
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  marginTop: '2rem',
                  transition: 'color var(--transition)',
                  borderTop: 'var(--border-width) solid var(--color-border)',
                  paddingTop: '1.25rem',
                  width: '100%',
                }}
                onMouseEnter={undefined}
                className="link-accent"
              >
                {t('download_cv')} ↗
              </a>
            )}
          </section>

        </div>
      )}
    </main>
  )
}
