import { getLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { WorkEntry, EducationEntry } from '@/sanity/queries/experience'
import type { Locale } from '@/lib/i18n'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { lbl } from '@/sanity/queries/siteSettings'

type Props = {
  workEntries: WorkEntry[]
  eduEntries: EducationEntry[]
  cvUrl?: string | null
  settings?: SiteSettings | null
}

function isCurrent(period: string) {
  return /presente|present|actual|ongoing|now|current/i.test(period)
}

export async function ExperienceSnapshot({ workEntries, eduEntries, cvUrl, settings }: Props) {
  if (!workEntries.length && !eduEntries.length) return null

  const locale = await getLocale() as Locale
  const t  = await getTranslations('experience')
  const th = await getTranslations('home')

  const e = settings?.labels?.experience
  const h = settings?.labels?.home
  const workLabel  = lbl(e?.workLabel,      locale, t('work_label'))
  const eduLabel   = lbl(e?.eduLabel,       locale, t('edu_label'))
  const downloadCv = lbl(e?.downloadCv,     locale, t('download_cv'))
  const viewExp    = lbl(h?.viewExperience, locale, th('view_experience'))

  const recent = workEntries.slice(0, 2)

  return (
    <section
      className="container section-inner"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div className="home-exp-grid">

        {/* ── Trayectoria ── */}
        <div style={{ paddingRight: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          <p className="text-label" style={{ marginBottom: '3rem' }}>{workLabel}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {recent.map(entry => {
              const role    = entry.role?.[locale]        || entry.role?.es        || entry.role?.en        || ''
              const desc    = entry.description?.[locale] || entry.description?.es || entry.description?.en || ''
              const current = isCurrent(entry.period ?? '')

              return (
                <div key={entry._key} style={{ position: 'relative', paddingLeft: '1.375rem' }}>
                  {/* dot */}
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: '0.4em',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: current ? 'var(--color-accent)' : 'var(--color-border)',
                    flexShrink: 0,
                  }} />

                  {/* período */}
                  <p style={{
                    fontSize: 'var(--text-label)',
                    fontWeight: 500,
                    color: current ? 'var(--color-accent)' : 'var(--color-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-label)',
                    margin: '0 0 0.5rem',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {entry.period}
                  </p>

                  {/* empresa */}
                  <h3 style={{
                    fontSize: 'var(--text-body)',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    margin: '0 0 0.2rem',
                    letterSpacing: '-0.01em',
                  }}>
                    {entry.company}
                  </h3>

                  {/* rol */}
                  <p style={{
                    fontSize: 'var(--text-small)',
                    color: 'var(--color-muted)',
                    fontWeight: 400,
                    margin: '0 0 0.75rem',
                  }}>
                    {role}
                  </p>

                  {/* descripción */}
                  {desc && (
                    <p style={{
                      fontSize: 'var(--text-small)',
                      color: 'var(--color-muted)',
                      lineHeight: 1.7,
                      margin: entry.tags?.length ? '0 0 1rem' : '0',
                    }}>
                      {desc}
                    </p>
                  )}

                  {/* tags */}
                  {entry.tags?.length ? (
                    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                      {entry.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: '0.5625rem',
                          color: 'var(--color-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.14em',
                          opacity: 0.55,
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

          <div style={{ marginTop: '3rem' }}>
            <Link href={{ pathname: '/experience' }} className="link-accent" style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-muted)',
              textDecoration: 'none',
            }}>
              {viewExp} →
            </Link>
          </div>
        </div>

        {/* ── Formación ── */}
        <div className="home-exp-edu-col">
          <p className="text-label" style={{ marginBottom: '3rem' }}>{eduLabel}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {eduEntries.map((entry, i) => {
              const degree = entry.degree?.[locale] || entry.degree?.es || entry.degree?.en || ''
              return (
                <div key={entry._key} style={{
                  paddingBlock: '1.75rem',
                  borderBottom: i < eduEntries.length - 1
                    ? 'var(--border-width) solid var(--color-border)'
                    : 'none',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 600,
                    fontSize: 'var(--text-body)',
                    color: 'var(--color-text)',
                    margin: '0 0 0.3rem',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                  }}>
                    {degree}
                  </p>
                  <p style={{
                    fontSize: 'var(--text-small)',
                    color: 'var(--color-muted)',
                    margin: '0 0 0.2rem',
                  }}>
                    {entry.institution}
                  </p>
                  <p style={{
                    fontSize: 'var(--text-label)',
                    color: 'var(--color-muted)',
                    margin: 0,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '0.04em',
                  }}>
                    {entry.period}
                  </p>
                </div>
              )
            })}
          </div>

          {cvUrl && (
            <div style={{ marginTop: '2.5rem' }}>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="link-accent" style={{
                fontSize: 'var(--text-small)',
                color: 'var(--color-muted)',
                textDecoration: 'none',
              }}>
                {downloadCv} ↗
              </a>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
