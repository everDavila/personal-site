import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { SiteSettings } from '@/sanity/queries/siteSettings'

type Props = { settings: SiteSettings | null }

export async function Hero({ settings }: Props) {
  const locale = await getLocale() as 'es' | 'en' | 'pt' | 'qu' | 'zh'
  const t = await getTranslations('home.hero')

  const headline = settings?.hero?.headline?.[locale] || t('headline')
  const sub = settings?.hero?.sub?.[locale] || t('sub')

  return (
    <section
      className="container section"
      style={{
        minHeight: 'calc(100svh - 57px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <h1 className="text-hero" style={{ maxWidth: '14ch', color: 'var(--color-text)' }}>
        {headline}
      </h1>

      <p style={{
        maxWidth: '44ch',
        color: 'var(--color-muted)',
        fontSize: 'var(--text-body)',
        lineHeight: 'var(--leading-body)',
      }}>
        {sub}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link
          href="/work"
          style={{
            color: 'var(--color-text)',
            fontWeight: 500,
            fontSize: 'var(--text-small)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--color-accent)',
            paddingBottom: '2px',
            transition: 'color var(--transition)',
          }}
        >
          {t('cta_work')} →
        </Link>

        <Link
          href="/blog"
          className="link-accent"
          style={{ fontWeight: 500, fontSize: 'var(--text-small)' }}
        >
          {t('cta_blog')} →
        </Link>
      </div>
    </section>
  )
}
