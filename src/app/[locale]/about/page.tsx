import { getSiteSettings, lbl, narrativeText, NARRATIVE_FALLBACK, pageImage } from '@/sanity/queries/siteSettings'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { getMode } from '@/lib/mode'
import { PageHeader } from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const [locale, mode] = await Promise.all([
    getLocale() as Promise<Locale>,
    getMode(),
  ])
  const [settings, t, subtitle] = await Promise.all([
    getSiteSettings(),
    getTranslations('about'),
    getPageSubtitle('about', locale),
  ])

  const a       = settings?.labels?.about
  const title   = lbl(a?.title,         locale, t('title'))
  const connect = lbl(a?.connect,       locale, t('connect'))
  const seeExp  = lbl(a?.seeExperience, locale, t('see_experience'))
  const social  = settings?.social
  const bio     = narrativeText(settings?.about, mode, locale, NARRATIVE_FALLBACK[mode].about)
  const imgUrl  = pageImage(settings?.pageImages?.about, mode)

  return (
    <main className="container section">
      <PageHeader imageUrl={imgUrl}>
        <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-muted)',
            marginBottom: '2rem',
            maxWidth: '52ch',
            lineHeight: 1.6,
          }}>
            {subtitle}
          </p>
        )}
      </PageHeader>

      {bio ? (
        <p style={{
          fontSize: 'var(--text-body)',
          color: 'var(--color-text)',
          lineHeight: 'var(--leading-body)',
          maxWidth: '38rem',
          marginBottom: '3rem',
          letterSpacing: 'var(--tracking-body)',
        }}>
          {bio}
        </p>
      ) : null}

      {social && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>
            {connect}
          </p>
          {social.email && (
            <a href={`mailto:${social.email}`} className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              {social.email}
            </a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              LinkedIn
            </a>
          )}
          {social.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              GitHub
            </a>
          )}
        </div>
      )}

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: 'var(--border-width) solid var(--color-border)' }}>
        <Link href={{ pathname: '/experience' }} className="link-accent" style={{ fontSize: 'var(--text-small)' }}>
          {seeExp} →
        </Link>
      </div>
    </main>
  )
}
