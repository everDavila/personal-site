import { getExperience } from '@/sanity/queries/experience'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import type { WorkEntry, EducationEntry } from '@/sanity/queries/experience'

function Tags({ tags }: { tags: string[] | null }) {
  if (!tags?.length) return null
  return (
    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
      {tags.map(tag => (
        <span key={tag} style={{
          fontSize: '0.65rem',
          fontWeight: 500,
          color: 'var(--color-muted)',
          border: 'var(--border-width) solid var(--color-border)',
          borderRadius: 'var(--radius)',
          padding: '0.1rem 0.45rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {tag}
        </span>
      ))}
    </div>
  )
}

function Logo({ url, name }: { url: string | undefined; name: string }) {
  if (!url) return null
  return (
    <img
      src={url}
      alt={name}
      width={28}
      height={28}
      style={{
        width: '1.75rem',
        height: '1.75rem',
        objectFit: 'contain',
        borderRadius: 'var(--radius)',
        flexShrink: 0,
      }}
    />
  )
}

function WorkCard({ entry, locale }: { entry: WorkEntry; locale: Locale }) {
  const role = localized(entry.role, locale)
  const desc = localized(entry.description, locale)

  return (
    <div style={{
      paddingBlock: '1.25rem',
      borderTop: 'var(--border-width) solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.3rem' }}>
        <Logo url={entry.logo?.asset.url} name={entry.company} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>
              {entry.company}
            </span>
            <time style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {entry.period}
            </time>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
            {role.value && (
              <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>
                {role.value}
              </span>
            )}
            {entry.current && (
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                · actual
              </span>
            )}
          </div>
        </div>
      </div>
      {desc.value && (
        <p style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          lineHeight: 1.6,
          margin: '0.5rem 0 0',
        }}>
          {desc.value}
        </p>
      )}
      <Tags tags={entry.tags} />
    </div>
  )
}

function EduCard({ entry, locale }: { entry: EducationEntry; locale: Locale }) {
  const degree = localized(entry.degree, locale)
  const desc = localized(entry.description, locale)

  return (
    <div style={{
      paddingBlock: '1.25rem',
      borderTop: 'var(--border-width) solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.3rem' }}>
        <Logo url={entry.logo?.asset.url} name={entry.institution} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>
              {entry.institution}
            </span>
            <time style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {entry.period}
            </time>
          </div>
          {degree.value && (
            <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', marginTop: '0.1rem', display: 'block' }}>
              {degree.value}
            </span>
          )}
        </div>
      </div>
      {desc.value && (
        <p style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          lineHeight: 1.6,
          margin: '0.5rem 0 0',
        }}>
          {desc.value}
        </p>
      )}
      <Tags tags={entry.tags} />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.7rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
      marginBottom: '0.25rem',
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

      {work.length === 0 && edu.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>{t('empty')}</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(22rem, 100%), 1fr))',
          gap: '0 4rem',
          alignItems: 'start',
        }}>
          {/* Columna izquierda — Experiencia */}
          <section>
            <SectionLabel>{t('work_label')}</SectionLabel>
            {work.map(entry => (
              <WorkCard key={entry._key} entry={entry} locale={currentLocale} />
            ))}
          </section>

          {/* Columna derecha — Estudios */}
          <section>
            <SectionLabel>{t('edu_label')}</SectionLabel>
            {edu.map(entry => (
              <EduCard key={entry._key} entry={entry} locale={currentLocale} />
            ))}
          </section>
        </div>
      )}
    </main>
  )
}
