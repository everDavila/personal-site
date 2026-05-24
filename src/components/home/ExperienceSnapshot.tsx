import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { WorkEntry, EducationEntry } from '@/sanity/queries/experience'
import type { Locale } from '@/lib/i18n'

type Props = {
  workEntries: WorkEntry[]
  eduEntries: EducationEntry[]
  cvUrl?: string | null
}

export async function ExperienceSnapshot({ workEntries, eduEntries, cvUrl }: Props) {
  if (!workEntries.length && !eduEntries.length) return null

  const locale = await getLocale() as Locale
  const t  = await getTranslations('experience')
  const th = await getTranslations('home')

  const recent = workEntries.slice(0, 3)

  return (
    <section
      className="container section"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div className="home-exp-grid">

        {/* ── Work column ── */}
        <div>
          <p className="text-label" style={{ marginBottom: '2rem' }}>{t('work_label')}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {recent.map(entry => {
              const role = entry.role?.[locale] || entry.role?.es || entry.role?.en || ''
              const desc = entry.description?.[locale] || entry.description?.es || entry.description?.en || ''

              return (
                <div key={entry._key} className="home-timeline-item">
                  <p style={{
                    fontSize: 'var(--text-label)',
                    fontWeight: 500,
                    color: 'var(--color-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-label)',
                    margin: '0 0 0.375rem',
                  }}>
                    {entry.period}
                  </p>
                  <h3 style={{
                    fontSize: 'var(--text-body)',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    margin: '0 0 0.2rem',
                  }}>
                    {entry.company}
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-small)',
                    color: 'var(--color-muted)',
                    fontWeight: 500,
                    margin: '0 0 0.5rem',
                  }}>
                    {role}
                  </p>
                  {desc && (
                    <p style={{
                      fontSize: 'var(--text-small)',
                      color: 'var(--color-muted)',
                      lineHeight: 1.6,
                      margin: '0 0 0.625rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {desc}
                    </p>
                  )}
                  {entry.tags?.length ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {entry.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: 'var(--text-label)',
                          color: 'var(--color-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: 'var(--tracking-label)',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link
              href={{ pathname: '/experience' }}
              className="link-accent"
              style={{
                fontSize: 'var(--text-small)',
                color: 'var(--color-muted)',
                textDecoration: 'none',
                borderBottom: '1px solid currentColor',
                paddingBottom: '2px',
              }}
            >
              {th('view_experience')} →
            </Link>
          </div>
        </div>

        {/* ── Education column ── */}
        <div className="home-exp-edu-col">
          <p className="text-label" style={{ marginBottom: '2rem' }}>{t('edu_label')}</p>

          <div>
            {eduEntries.map((entry, i) => {
              const degree = entry.degree?.[locale] || entry.degree?.es || entry.degree?.en || ''
              return (
                <div
                  key={entry._key}
                  style={{
                    paddingBlock: '1.25rem',
                    borderBottom: i < eduEntries.length - 1
                      ? 'var(--border-width) solid var(--color-border)'
                      : 'none',
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: 'var(--text-body)', color: 'var(--color-text)', margin: '0 0 0.2rem' }}>
                    {degree}
                  </p>
                  <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: '0 0 0.15rem' }}>
                    {entry.institution}
                  </p>
                  <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: 0 }}>
                    {entry.period}
                  </p>
                </div>
              )
            })}
          </div>

          {cvUrl && (
            <div style={{ marginTop: '2rem' }}>
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
                {t('download_cv')} ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
