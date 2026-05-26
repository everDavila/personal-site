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

  const headline    = settings?.hero?.headline?.[locale]   || t('headline')
  const fallbackSub = settings?.hero?.sub?.[locale] ?? t('sub')
  const sub         = initialSub ?? fallbackSub
  const ctaWork     = settings?.hero?.ctaWork?.[locale]    || t('cta_work')
  const ctaCV       = settings?.hero?.ctaCV?.[locale]      || t('cta_cv')

  const cleanHeadline = headline.replace(/\.\s*$/, '')

  return (
    <section
      className="container"
      style={{
        minHeight: 'calc(100svh - 57px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 'clamp(3.5rem, 8vw, 6rem)',
        paddingTop: 'clamp(6rem, 15vw, 10rem)',
      }}
    >
      <div style={{ maxWidth: '72rem', width: '100%' }}>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-hero)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--color-text)',
            margin: '0 0 clamp(2rem, 5vw, 3.5rem)',
            maxWidth: '14ch',
          }}
        >
          {cleanHeadline}
          <span style={{ color: 'var(--color-accent)' }}>.</span>
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 26rem) 1fr',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'end',
        }}>
          <HeroSubtitle
            initial={sub}
            pool={subtitlePool}
            style={{
              color: 'var(--color-muted)',
              fontSize: 'var(--text-body)',
              lineHeight: 1.75,
              margin: 0,
            }}
          />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            paddingBottom: '0.25rem',
          }}>
            <Link
              href={{ pathname: '/work' }}
              style={{
                fontSize: 'var(--text-label)',
                color: 'var(--color-text)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
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
                  fontSize: 'var(--text-label)',
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  transition: 'color var(--transition)',
                }}
                className="link-accent"
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
