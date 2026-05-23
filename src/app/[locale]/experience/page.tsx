import { getExperience } from '@/sanity/queries/experience'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.7rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
      marginBottom: '1.5rem',
    }}>
      {children}
    </p>
  )
}

export default async function ExperiencePage() {
  const [data, locale, t] = await Promise.all([
    getExperience(),
    getLocale(),
    getTranslations('experience'),
  ])

  const currentLocale = locale as Locale
  const work = data?.workExperience ?? []
  const edu = data?.education ?? []

  return (
    <main className="container section">
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '3rem',
      }}>
        {t('title')}
      </h1>

      {/* Experiencia laboral */}
      {work.length > 0 && (
        <section style={{ marginBottom: '3.5rem' }}>
          <SectionLabel>{t('work_label')}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {work.map((entry, i) => {
              const role = localized(entry.role, currentLocale)
              const desc = localized(entry.description, currentLocale)
              return (
                <div
                  key={entry._key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: '0 1.5rem',
                    paddingBlock: '1.5rem',
                    borderTop: i === 0 ? 'none' : 'var(--border-width) solid var(--color-border)',
                  }}
                >
                  {/* Período */}
                  <time style={{
                    fontSize: 'var(--text-small)',
                    color: 'var(--color-muted)',
                    whiteSpace: 'nowrap',
                    paddingTop: '0.2rem',
                    minWidth: '7rem',
                  }}>
                    {entry.period}
                  </time>

                  {/* Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>
                        {role.value || entry.company}
                      </span>
                      {entry.current && (
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: 'var(--color-accent)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}>
                          {t('current')}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>
                      {entry.company}
                    </span>
                    {desc.value && (
                      <p style={{
                        fontSize: 'var(--text-small)',
                        color: 'var(--color-muted)',
                        lineHeight: 1.6,
                        marginTop: '0.4rem',
                      }}>
                        {desc.value}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Estudios */}
      {edu.length > 0 && (
        <section>
          <SectionLabel>{t('edu_label')}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {edu.map((entry, i) => {
              const degree = localized(entry.degree, currentLocale)
              const desc = localized(entry.description, currentLocale)
              return (
                <div
                  key={entry._key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: '0 1.5rem',
                    paddingBlock: '1.5rem',
                    borderTop: i === 0 ? 'none' : 'var(--border-width) solid var(--color-border)',
                  }}
                >
                  <time style={{
                    fontSize: 'var(--text-small)',
                    color: 'var(--color-muted)',
                    whiteSpace: 'nowrap',
                    paddingTop: '0.2rem',
                    minWidth: '7rem',
                  }}>
                    {entry.period}
                  </time>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>
                      {degree.value || entry.institution}
                    </span>
                    <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>
                      {entry.institution}
                    </span>
                    {desc.value && (
                      <p style={{
                        fontSize: 'var(--text-small)',
                        color: 'var(--color-muted)',
                        lineHeight: 1.6,
                        marginTop: '0.4rem',
                      }}>
                        {desc.value}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {work.length === 0 && edu.length === 0 && (
        <p style={{ color: 'var(--color-muted)' }}>{t('empty')}</p>
      )}
    </main>
  )
}
