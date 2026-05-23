import { getSiteSettings } from '@/sanity/queries/siteSettings'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'

export default async function AboutPage() {
  const [settings, locale, t] = await Promise.all([
    getSiteSettings(),
    getLocale(),
    getTranslations('about'),
  ])

  const currentLocale = locale as Locale
  const bio = settings?.about ? localized(settings.about, currentLocale) : null
  const social = settings?.social

  return (
    <main className="container section">
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '2rem',
      }}>
        {t('title')}
      </h1>

      {bio?.value ? (
        <p style={{
          fontSize: 'var(--text-body)',
          color: 'var(--color-text)',
          lineHeight: 1.8,
          maxWidth: '38rem',
          marginBottom: '3rem',
        }}>
          {bio.value}
        </p>
      ) : null}

      {social && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>
            {t('connect')}
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
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              X / Twitter
            </a>
          )}
        </div>
      )}

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: 'var(--border-width) solid var(--color-border)' }}>
        <Link href={{ pathname: '/experience' }} className="link-accent" style={{ fontSize: 'var(--text-small)' }}>
          {t('see_experience')} →
        </Link>
      </div>
    </main>
  )
}
