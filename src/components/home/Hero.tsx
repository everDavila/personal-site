import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { HeroSubtitle } from './HeroSubtitle'

type Props = {
  settings: SiteSettings | null
  cvUrl?: string | null
  initialSub?: string | null
  subtitlePool?: string[]
}

export async function Hero({ settings, cvUrl, initialSub, subtitlePool = [] }: Props) {
  const locale = await getLocale() as 'es' | 'en' | 'pt' | 'qu' | 'zh'
  const t = await getTranslations('home.hero')

  const roleLabel  = settings?.hero?.roleLabel?.[locale]  || t('role_label')
  const headline   = settings?.hero?.headline?.[locale]   || t('headline')
  const fallbackSub = settings?.hero?.sub?.[locale] ?? t('sub')
  const sub        = initialSub ?? fallbackSub
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
              fontFamily: 'var(--font-display)',
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

          <HeroSubtitle
            initial={sub}
            pool={subtitlePool}
            style={{
              maxWidth: '42ch',
              color: 'var(--color-muted)',
              fontSize: 'var(--text-body)',
              lineHeight: 1.7,
              margin: 0,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link
              href={{ pathname: '/work' }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--color-bg)',
                background: 'var(--color-accent)',
                fontWeight: 500,
                fontSize: 'var(--text-small)',
                textDecoration: 'none',
                padding: '0.5rem 1.125rem',
                borderRadius: 'var(--radius)',
                transition: 'background var(--transition)',
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
