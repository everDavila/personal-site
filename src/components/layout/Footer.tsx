import { getSiteSettings } from '@/sanity/queries/siteSettings'
import { getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'

export async function Footer() {
  const settings = await getSiteSettings()
  const locale   = await getLocale() as Locale

  const text   = settings?.footerText?.[locale] || settings?.footerText?.es || null
  const social = settings?.social
  const year   = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: 'var(--border-width) solid var(--color-border)',
      paddingBlock: 'clamp(1.5rem, 4vw, 2.5rem)',
    }}>
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: 0 }}>
          {text || `© ${year} Ever Dávila`}
        </p>

        {social && (
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
                style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', textDecoration: 'none' }}
              >
                GitHub
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
                style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', textDecoration: 'none' }}
              >
                LinkedIn
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
                style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', textDecoration: 'none' }}
              >
                Twitter
              </a>
            )}
            {social.email && (
              <a
                href={`mailto:${social.email}`}
                className="link-accent"
                style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', textDecoration: 'none' }}
              >
                {social.email}
              </a>
            )}
          </nav>
        )}
      </div>
    </footer>
  )
}
