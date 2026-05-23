import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { SiteSettings } from '@/sanity/queries/siteSettings'

type Props = { settings: SiteSettings | null; cvUrl?: string | null }

export async function Hero({ settings, cvUrl }: Props) {
  const locale = await getLocale() as 'es' | 'en' | 'pt' | 'qu' | 'zh'
  const t = await getTranslations('home.hero')

  const headline = settings?.hero?.headline?.[locale] || t('headline')
  const sub      = settings?.hero?.sub?.[locale]      || t('sub')
  const ctaWork  = settings?.hero?.ctaWork?.[locale]  || t('cta_work')
  const ctaCV    = settings?.hero?.ctaCV?.[locale]    || t('cta_cv')

  return (
    <section
      className="container"
      style={{
        minHeight: 'calc(100svh - 57px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBlock: 'clamp(4rem, 10vw, 8rem)',
        gap: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--text-hero)',
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'var(--color-text)',
          maxWidth: '16ch',
          margin: 0,
        }}
      >
        {headline}
      </h1>

      <p
        style={{
          maxWidth: '42ch',
          color: 'var(--color-muted)',
          fontSize: 'var(--text-body)',
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {sub}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <Link
          href={{ pathname: '/work' }}
          style={{
            color: 'var(--color-text)',
            fontWeight: 500,
            fontSize: 'var(--text-small)',
            textDecoration: 'none',
            borderBottom: '1px solid currentColor',
            paddingBottom: '2px',
            transition: 'color var(--transition)',
          }}
          className="link-accent"
        >
          {ctaWork} →
        </Link>

        {cvUrl && (
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-muted)',
              fontWeight: 400,
              fontSize: 'var(--text-small)',
              textDecoration: 'none',
              transition: 'color var(--transition)',
            }}
            className="link-accent"
          >
            {ctaCV} ↗
          </a>
        )}
      </div>
    </section>
  )
}
