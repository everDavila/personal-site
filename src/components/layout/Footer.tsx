import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSiteSettings } from '@/sanity/queries/siteSettings'
import type { Locale } from '@/lib/i18n'

function LogoStatic() {
  return (
    <svg
      viewBox="0 0 32 43"
      width="16"
      height="21"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', color: 'var(--color-text)', flexShrink: 0, marginTop: '0.1rem' }}
    >
      <path d="M 5 5 H 13"                   stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M 14 5 A 13 16.5 0 0 1 14 38" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M 3 38 H 13"                   stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  )
}

const LINK_STYLE = {
  fontSize: '0.8125rem',
  color: 'var(--color-muted)',
  textDecoration: 'none',
} as const

const LABELS: Record<Locale, { nav: string; resources: string; follow: string }> = {
  es: { nav: 'Navegación', resources: 'Recursos',  follow: 'Sígueme'  },
  en: { nav: 'Navigation', resources: 'Resources', follow: 'Follow'   },
  pt: { nav: 'Navegação',  resources: 'Recursos',  follow: 'Siga-me'  },
  qu: { nav: 'Puriyway',   resources: 'Imaykuna',  follow: 'Qhatiway' },
  zh: { nav: '导航',        resources: '资源',       follow: '关注'     },
}

export async function Footer() {
  const settings = await getSiteSettings()
  const locale   = await getLocale() as Locale
  const tn       = await getTranslations('nav')

  const text   = settings?.footerText?.[locale] || settings?.footerText?.es || null
  const social = settings?.social
  const cvUrl  = settings?.cvUrl
  const year   = new Date().getFullYear()
  const lbl    = LABELS[locale]

  return (
    <footer style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}>

      {/* ── Main row ── */}
      <div className="container footer-top" style={{ paddingBlock: '1.5rem' }}>

        {/* Col 1 — Logo + tagline */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <LogoStatic />
          {text && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.55, maxWidth: '22ch' }}>
              {text}
            </p>
          )}
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <p className="text-label" style={{ marginBottom: '0.75rem' }}>{lbl.nav}</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {([
              { label: tn('work'),       pathname: '/work'       },
              { label: tn('experience'), pathname: '/experience' },
              { label: tn('blog'),       pathname: '/blog'       },
              { label: tn('about'),      pathname: '/about'      },
              { label: tn('playground'), pathname: '/playground' },
            ] as { label: string; pathname: string }[]).map(({ label, pathname }) => (
              <Link
                key={pathname}
                href={{ pathname } as Parameters<typeof Link>[0]['href']}
                className="link-accent"
                style={LINK_STYLE}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3 — Resources */}
        <div>
          <p className="text-label" style={{ marginBottom: '0.75rem' }}>{lbl.resources}</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link href={{ pathname: '/contact' }} className="link-accent" style={LINK_STYLE}>
              {tn('contact')}
            </Link>
            {cvUrl && (
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="link-accent" style={LINK_STYLE}>
                CV ↗
              </a>
            )}
          </nav>
        </div>

        {/* Col 4 — Social */}
        {social && (
          <div>
            <p className="text-label" style={{ marginBottom: '0.75rem' }}>{lbl.follow}</p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {social.email && (
                <a href={`mailto:${social.email}`} className="footer-social-icon" aria-label="Email">
                  <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="2.5" width="11" height="8" rx="1"/>
                    <polyline points="1,2.5 6.5,7.5 12,2.5"/>
                  </svg>
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="LinkedIn">
                  <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                    <rect x="1" y="1" width="11" height="11" rx="2"/>
                    <line x1="4" y1="5.5" x2="4" y2="9.5"/>
                    <line x1="4" y1="3.5" x2="4" y2="4"/>
                    <path d="M7 9.5V7a1.5 1.5 0 013 0v2.5M7 5.5v4"/>
                  </svg>
                </a>
              )}
              {social.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="GitHub">
                  <svg width="12" height="12" viewBox="0 0 13 13" fill="currentColor">
                    <path d="M6.5 1A5.5 5.5 0 001 6.5c0 2.43 1.57 4.49 3.76 5.22.27.05.37-.12.37-.26v-.95c-1.52.33-1.84-.74-1.84-.74-.25-.63-.61-.8-.61-.8-.5-.34.04-.33.04-.33.55.04.84.57.84.57.49.84 1.28.6 1.59.46.05-.36.19-.6.35-.74-1.22-.14-2.5-.61-2.5-2.72 0-.6.21-1.09.57-1.48-.06-.14-.25-.7.05-1.46 0 0 .47-.15 1.53.57.44-.12.92-.18 1.39-.18.47 0 .95.06 1.39.18 1.06-.72 1.53-.57 1.53-.57.3.76.11 1.32.05 1.46.36.39.57.88.57 1.48 0 2.12-1.29 2.58-2.52 2.72.2.17.37.51.37 1.03v1.53c0 .14.1.31.38.26A5.5 5.5 0 0012 6.5 5.5 5.5 0 006.5 1z"/>
                  </svg>
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Twitter / X">
                  <svg width="12" height="12" viewBox="0 0 13 13" fill="currentColor">
                    <path d="M10.12 1.5h1.84L8.02 5.86 12.5 11.5H9.06L6.3 7.96 3.13 11.5H1.28l4.18-4.62L.5 1.5h3.54l2.5 3.25L10.12 1.5zm-.65 9h1.02L3.58 2.54H2.47l7 7.96z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="container"
        style={{ paddingBlock: '0.75rem', borderTop: 'var(--border-width) solid var(--color-border)' }}
      >
        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', margin: 0 }}>
          © {year} Ever Dávila. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
