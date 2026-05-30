import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { NARRATIVE_FALLBACK } from '@/sanity/queries/siteSettings'
import { HeroSubtitle } from './HeroSubtitle'

type Props = {
  settings:    SiteSettings | null
  cvUrl?:      string | null
  initialSub?: string | null
  subtitlePool?: string[]
}

export async function Hero({ settings, cvUrl, initialSub, subtitlePool = [] }: Props) {
  const locale = await getLocale() as 'es' | 'en' | 'pt' | 'qu' | 'zh'
  const t      = await getTranslations('home.hero')

  const heroBase = settings?.hero

  const darkHeadline  = heroBase?.headline?.[locale]      || t('headline')
  const lightHeadline = heroBase?.headlineLight?.[locale]
    ?? NARRATIVE_FALLBACK.light.heroHeadline?.[locale]
    ?? NARRATIVE_FALLBACK.light.heroHeadline?.es
    ?? darkHeadline

  const darkSub  = heroBase?.sub?.[locale]      ?? t('sub')
  const lightSub = heroBase?.subLight?.[locale]  ?? darkSub

  const ctaWork = heroBase?.ctaWork?.[locale] || t('cta_work')
  const ctaCV   = heroBase?.ctaCV?.[locale]   || t('cta_cv')

  const cleanDark  = darkHeadline.replace(/\.\s*$/, '')
  const cleanLight = lightHeadline.replace(/\.\s*$/, '')

  const headlineStyle: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-hero)',
    fontWeight: 400,
    lineHeight: 1.05,
    letterSpacing: 'var(--tracking-hero)',
    color: 'var(--color-text)',
    margin: '0 0 clamp(3rem, 8vw, 6rem)',
    maxWidth: '13ch',
  }

  return (
    <section
      className="container"
      style={{
        minHeight: 'calc(100svh - 57px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 'clamp(4rem, 9vw, 7rem)',
        paddingTop: 'clamp(7rem, 18vw, 12rem)',
      }}
    >
      <div style={{ maxWidth: '76rem', width: '100%' }}>

        {/* Headline — grid stacking, crossfade on mode switch */}
        <h1 className="n-slot" style={headlineStyle}>
          <span className="n-d">
            {cleanDark}<span style={{ color: 'var(--color-accent)' }}>.</span>
          </span>
          <span className="n-l">
            {cleanLight}<span style={{ color: 'var(--color-accent)' }}>.</span>
          </span>
        </h1>

        {/* Subtitle + CTAs */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 'clamp(2rem, 5vw, 4rem)',
          flexWrap: 'wrap',
        }}>
          <div style={{ paddingLeft: 'clamp(0rem, 7vw, 6rem)' }}>
            <div className="n-slot">
              <HeroSubtitle
                initial={initialSub ?? darkSub}
                pool={subtitlePool}
                className="n-d"
                style={{
                  color: 'var(--color-muted)',
                  fontSize: 'var(--text-body)',
                  lineHeight: 1.75,
                  margin: 0,
                  maxWidth: '36ch',
                }}
              />
              <HeroSubtitle
                initial={lightSub}
                pool={[]}
                className="n-l"
                style={{
                  color: 'var(--color-muted)',
                  fontSize: 'var(--text-body)',
                  lineHeight: 1.75,
                  margin: 0,
                  maxWidth: '36ch',
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.75rem',
            paddingBottom: '0.1rem',
            flexShrink: 0,
          }}>
            <Link
              href={{ pathname: '/work' }}
              style={{
                fontSize: 'var(--text-label)',
                color: 'var(--color-text)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'opacity var(--transition)',
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
                  fontSize: 'var(--text-label)',
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  transition: 'opacity var(--transition)',
                }}
              >
                {ctaCV} ↗
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
