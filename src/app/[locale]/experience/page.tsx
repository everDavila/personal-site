import { getExperience } from '@/sanity/queries/experience'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import type { WorkEntry, EducationEntry } from '@/sanity/queries/experience'

function ColLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '0.7rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
      marginBottom: '2rem',
    }}>
      {children}
    </p>
  )
}

function TagsMeta({ tags }: { tags: string[] | null }) {
  if (!tags?.length) return null
  return (
    <p style={{
      fontSize: '0.7rem',
      color: 'var(--color-border)',
      marginTop: '0.75rem',
      letterSpacing: '0.02em',
    }}>
      {tags.join(' · ')}
    </p>
  )
}

function Logo({ url, name }: { url: string | undefined; name: string }) {
  if (!url) return null
  return (
    <img
      src={url}
      alt={name}
      width={20}
      height={20}
      style={{
        width: '1.25rem',
        height: '1.25rem',
        objectFit: 'contain',
        borderRadius: '2px',
        opacity: 0.7,
        marginBottom: '0.5rem',
        display: 'block',
      }}
    />
  )
}

function WorkCard({ entry, locale }: { entry: WorkEntry; locale: Locale }) {
  const role = localized(entry.role, locale)
  const desc = localized(entry.description, locale)

  return (
    <div style={{
      paddingBlock: '1.75rem',
      borderTop: 'var(--border-width) solid var(--color-border)',
    }}>
      <Logo url={entry.logo?.asset.url} name={entry.company} />

      {/* Cargo — primer nivel */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 'var(--text-body)',
          fontWeight: 600,
          color: 'var(--color-text)',
          lineHeight: 1.3,
        }}>
          {role.value || entry.company}
        </span>
        {entry.current && (
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 600,
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            actual
          </span>
        )}
      </div>

      {/* Empresa — segundo nivel */}
      <p style={{
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
        margin: '0.2rem 0 0',
      }}>
        {entry.company}
      </p>

      {/* Período — tercer nivel */}
      <time style={{
        display: 'block',
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
        opacity: 0.7,
        marginTop: '0.1rem',
      }}>
        {entry.period}
      </time>

      {/* Descripción */}
      {desc.value && (
        <p style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          lineHeight: 1.65,
          marginTop: '0.75rem',
          opacity: 0.85,
        }}>
          {desc.value}
        </p>
      )}

      {/* Tags — metadata secundaria */}
      <TagsMeta tags={entry.tags} />
    </div>
  )
}

function EduCard({ entry, locale }: { entry: EducationEntry; locale: Locale }) {
  const degree = localized(entry.degree, locale)
  const desc = localized(entry.description, locale)

  return (
    <div style={{
      paddingBlock: '1.75rem',
      borderTop: 'var(--border-width) solid var(--color-border)',
    }}>
      <Logo url={entry.logo?.asset.url} name={entry.institution} />

      {/* Carrera / Programa — primer nivel */}
      {degree.value && (
        <p style={{
          fontSize: 'var(--text-body)',
          fontWeight: 600,
          color: 'var(--color-text)',
          lineHeight: 1.3,
          margin: 0,
        }}>
          {degree.value}
        </p>
      )}

      {/* Institución — segundo nivel */}
      <p style={{
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
        margin: '0.2rem 0 0',
      }}>
        {entry.institution}
      </p>

      {/* Período — tercer nivel */}
      <time style={{
        display: 'block',
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
        opacity: 0.7,
        marginTop: '0.1rem',
      }}>
        {entry.period}
      </time>

      {/* Descripción */}
      {desc.value && (
        <p style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          lineHeight: 1.65,
          marginTop: '0.75rem',
          opacity: 0.85,
        }}>
          {desc.value}
        </p>
      )}

      {/* Tags — metadata secundaria */}
      <TagsMeta tags={entry.tags} />
    </div>
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
        marginBottom: '3.5rem',
      }}>
        {t('title')}
      </h1>

      {work.length === 0 && edu.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>{t('empty')}</p>
      ) : (
        <div className="exp-grid">
          <section className="exp-col">
            <ColLabel>{t('work_label')}</ColLabel>
            {work.map(entry => (
              <WorkCard key={entry._key} entry={entry} locale={currentLocale} />
            ))}
          </section>

          <section className="exp-col">
            <ColLabel>{t('edu_label')}</ColLabel>
            {edu.map(entry => (
              <EduCard key={entry._key} entry={entry} locale={currentLocale} />
            ))}
          </section>
        </div>
      )}
    </main>
  )
}
