import { getExperience } from '@/sanity/queries/experience'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import type { WorkEntry, EducationEntry } from '@/sanity/queries/experience'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { getSiteSettings, lbl } from '@/sanity/queries/siteSettings'
import { PageHeader } from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

function FeaturedEntry({ entry, locale, currentLabel }: {
  entry: WorkEntry; locale: Locale; currentLabel: string
}) {
  const role = localized(entry.role, locale)
  const desc = localized(entry.description, locale)
  return (
    <div className="exp-feat-row">
      <div>
        <time style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
          {entry.period.replace(/\s*[–—]\s*/g, '\n')}
        </time>
      </div>
      <div>
        <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2, margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>
          {role.value || entry.company}
          {entry.current && (
            <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '0.75rem', verticalAlign: 'middle' }}>
              {currentLabel}
            </span>
          )}
        </h3>
        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: '0 0 1rem' }}>{entry.company}</p>
        {desc.value && (
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', lineHeight: 1.7, margin: '0 0 1rem', maxWidth: '56ch' }}>{desc.value}</p>
        )}
        {entry.tags?.length ? (
          <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)', margin: 0 }}>
            {entry.tags.join(' · ')}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function PreviousEntry({ entry, locale }: { entry: WorkEntry; locale: Locale }) {
  const role = localized(entry.role, locale)
  return (
    <div className="exp-prev-row">
      <span style={{ fontWeight: 600, fontSize: 'var(--text-small)', color: 'var(--color-text)' }}>{role.value || entry.company}</span>
      <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>{entry.company}</span>
      <time style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>{entry.period}</time>
    </div>
  )
}

function EduCard({ entry, locale }: { entry: EducationEntry; locale: Locale }) {
  const degree = localized(entry.degree, locale)
  return (
    <div>
      <p style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 0.25rem', lineHeight: 1.3 }}>{degree.value || '—'}</p>
      <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: '0 0 0.15rem' }}>{entry.institution}</p>
      <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: 0 }}>{entry.period}</p>
    </div>
  )
}

function SectionLabel({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <p style={{ fontSize: 'var(--text-label)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)', color: accent ? 'var(--color-accent)' : 'var(--color-muted)', margin: '0 0 2rem' }}>
      {children}
    </p>
  )
}

export default async function ExperiencePage() {
  const locale = await getLocale() as Locale
  const [data, t, subtitle, settings] = await Promise.all([
    getExperience(),
    getTranslations('experience'),
    getPageSubtitle('experience', locale),
    getSiteSettings(),
  ])

  const e             = settings?.labels?.experience
  const title         = lbl(e?.title,         locale, t('title'))
  const currentLabel  = lbl(e?.current,       locale, t('current'))
  const featuredLabel = lbl(e?.featuredLabel, locale, t('featured_label'))
  const previousLabel = lbl(e?.previousLabel, locale, t('previous_label'))
  const eduLabel      = lbl(e?.eduLabel,      locale, t('edu_label'))
  const downloadCv    = lbl(e?.downloadCv,    locale, t('download_cv'))
  const emptyMsg      = lbl(e?.empty,         locale, t('empty'))

  const imageSet = {
    dark:  settings?.pageImages?.experience?.dark?.asset?.url  ?? null,
    light: settings?.pageImages?.experience?.light?.asset?.url ?? null,
  }

  const work     = data?.workExperience ?? []
  const edu      = data?.education ?? []
  const cvUrl    = data?.cvUrl
  const featured = work.filter(entry => entry.featured)
  const previous = work.filter(entry => !entry.featured)

  return (
    <>
      <section className="container" style={{ paddingTop: 'var(--spacing-section)', paddingBottom: '2.5rem', borderBottom: 'var(--border-width) solid var(--color-border)' }}>
        <PageHeader imageSet={imageSet}>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', lineHeight: 1.6, margin: 0, maxWidth: '52ch' }}>
              {subtitle}
            </p>
          )}
        </PageHeader>
      </section>

      {featured.length > 0 && (
        <section className="container" style={{ borderTop: 'var(--border-width) solid var(--color-border)', paddingBlock: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <SectionLabel accent>{featuredLabel}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {featured.map(entry => (
              <FeaturedEntry key={entry._key} entry={entry} locale={locale} currentLabel={currentLabel} />
            ))}
          </div>
        </section>
      )}

      {previous.length > 0 && (
        <section className="container" style={{ borderTop: 'var(--border-width) solid var(--color-border)', paddingBlock: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <SectionLabel>{previousLabel}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {previous.map(entry => <PreviousEntry key={entry._key} entry={entry} locale={locale} />)}
          </div>
        </section>
      )}

      {edu.length > 0 && (
        <section className="container section-inner" style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}>
          <SectionLabel accent>{eduLabel}</SectionLabel>
          <div className="exp-edu-grid">
            {edu.map(entry => <EduCard key={entry._key} entry={entry} locale={locale} />)}
          </div>
          {cvUrl && (
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: 'var(--border-width) solid var(--color-border)' }}>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="link-accent" style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', textDecoration: 'none', borderBottom: '1px solid currentColor', paddingBottom: '2px' }}>
                {downloadCv} →
              </a>
            </div>
          )}
        </section>
      )}

      {work.length === 0 && edu.length === 0 && (
        <section className="container section-inner">
          <p style={{ color: 'var(--color-muted)' }}>{emptyMsg}</p>
        </section>
      )}
    </>
  )
}
