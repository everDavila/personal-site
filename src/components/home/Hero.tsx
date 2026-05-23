import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { SiteSettings } from '@/sanity/queries/siteSettings'

type Props = { settings: SiteSettings | null; cvUrl?: string | null }

export async function Hero({ settings, cvUrl }: Props) {
  const locale = await getLocale() as 'es' | 'en' | 'pt' | 'qu' | 'zh'
  const t = await getTranslations('home.hero')

  const roleLabel  = settings?.hero?.roleLabel?.[locale]  || t('role_label')
  const headline   = settings?.hero?.headline?.[locale]   || t('headline')
  const sub        = settings?.hero?.sub?.[locale]        || t('sub')
  const ctaWork    = settings?.hero?.ctaWork?.[locale]    || t('cta_work')
  const ctaCV      = settings?.hero?.ctaCV?.[locale]      || t('cta_cv')
  const heroImgUrl = settings?.hero?.heroImage?.asset?.url || null

  // Strip trailing period so we can append a colored one
  const cleanHeadline = headline.replace(/\.\s*$/, '')

  return (
    <section
      className="container"
      style={{
        minHeight: 'calc(100svh - 57px)',
        display: 'flex',
        alignItems: 'center',
        paddingBlock: 'clamp(4rem, 10vw, 8rem)',
      }}
    >
      <div className={heroImgUrl ? 'hero-grid' : 'hero-content-only'} style={{ width: '100%' }}>

        {/* ── Text ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {roleLabel && (
            <p className="text-label" style={{ margin: 0 }}>{roleLabel}</p>
          )}

          <h1
            style={{
              fontSize: 'var(--text-hero)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              maxWidth: '16ch',
              margin: 0,
            }}
          >
            {cleanHeadline}
            <span style={{ color: 'var(--color-accent)' }}>.</span>
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
                color: 'var(--color-accent)',
                fontWeight: 500,
                fontSize: 'var(--text-small)',
                textDecoration: 'none',
                borderBottom: '1px solid currentColor',
                paddingBottom: '2px',
                transition: 'opacity var(--transition)',
              }}
              className="hero-cta-work"
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
        </div>

        {/* ── Hero image ── */}
        {heroImgUrl && (
          <div
            style={{
              overflow: 'hidden',
              background: 'var(--color-surface)',
              aspectRatio: '3/4',
            }}
          >
            <img
              src={heroImgUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
