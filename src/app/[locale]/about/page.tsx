import type { Metadata } from 'next'
import { getSiteSettings, lbl, narrativeText, NARRATIVE_FALLBACK, resolveSeo } from '@/sanity/queries/siteSettings'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { PageHeader } from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings()
  const { title, description } = resolveSeo(settings?.seoAbout, locale as Locale, {
    title: 'Enfoque — Ever Davila',
    description: 'UX/UI Designer especializado en sistemas digitales complejos para el sector público peruano.',
  })
  return { title, description, openGraph: { title, description }, twitter: { title, description } }
}

export default async function AboutPage() {
  const locale = await getLocale() as Locale
  const [settings, t, subtitle] = await Promise.all([
    getSiteSettings(),
    getTranslations('about'),
    getPageSubtitle('about', locale),
  ])

  const a          = settings?.labels?.about
  const titleDark  = narrativeText(settings?.pageTitles?.about, 'dark',  locale, NARRATIVE_FALLBACK.dark.pageTitles.about)  ?? lbl(a?.title, locale, t('title'))
  const titleLight = narrativeText(settings?.pageTitles?.about, 'light', locale, NARRATIVE_FALLBACK.light.pageTitles.about) ?? titleDark
  const connect = lbl(a?.connect,       locale, t('connect'))
  const seeExp  = lbl(a?.seeExperience, locale, t('see_experience'))
  const social  = settings?.social

  const bioDark  = narrativeText(settings?.about, 'dark',  locale, NARRATIVE_FALLBACK.dark.about)
  const bioLight = narrativeText(settings?.about, 'light', locale, NARRATIVE_FALLBACK.light.about)

  const imageSet = {
    dark:  settings?.pageImages?.about?.dark?.asset?.url  ?? null,
    light: settings?.pageImages?.about?.light?.asset?.url ?? null,
  }

  return (
    <main className="container section-page">
      <PageHeader imageSet={imageSet}>
        <h1 className="page-title n-slot" style={{ marginBottom: '0.25rem' }}>
          <span className="n-d">{titleDark}</span>
          <span className="n-l">{titleLight}</span>
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

      {(bioDark || bioLight) && (
        <div style={{
          fontSize: 'var(--text-body)',
          color: 'var(--color-text)',
          lineHeight: 'var(--leading-body)',
          maxWidth: '38rem',
          marginBottom: '3rem',
          letterSpacing: 'var(--tracking-body)',
        }}>
          <div className="n-slot">
            {bioDark  && <p className="n-d" style={{ margin: 0 }}>{bioDark}</p>}
            {bioLight && <p className="n-l" style={{ margin: 0 }}>{bioLight}</p>}
          </div>
        </div>
      )}

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
