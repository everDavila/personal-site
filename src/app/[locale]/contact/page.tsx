import type { Metadata } from 'next'
import { getSiteSettings, lbl, narrativeText, NARRATIVE_FALLBACK, resolveSeo } from '@/sanity/queries/siteSettings'
import { getLocale, getTranslations } from 'next-intl/server'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { getMode } from '@/lib/mode'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings()
  const { title, description } = resolveSeo(settings?.seoContact, locale as Locale, {
    title: 'Hablemos — Ever Davila',
    description: 'Disponible para consultas estratégicas y proyectos complejos.',
  })
  return { title, description, openGraph: { title, description }, twitter: { title, description } }
}

export default async function ContactPage() {
  const locale = await getLocale() as Locale
  const mode   = await getMode()
  const [settings, t, subtitle] = await Promise.all([
    getSiteSettings(),
    getTranslations('contact'),
    getPageSubtitle('contact', locale, mode),
  ])

  const c          = settings?.labels?.contact
  const titleDark  = narrativeText(settings?.pageTitles?.contact, 'dark',  locale, NARRATIVE_FALLBACK.dark.pageTitles.contact)  ?? lbl(c?.title, locale, t('title'))
  const titleLight = narrativeText(settings?.pageTitles?.contact, 'light', locale, NARRATIVE_FALLBACK.light.pageTitles.contact) ?? titleDark
  const emailLabel = lbl(c?.emailLabel, locale, t('email_label'))
  const social     = settings?.social

  const introDark  = narrativeText(settings?.contactIntro, 'dark',  locale, NARRATIVE_FALLBACK.dark.contactIntro)
  const introLight = narrativeText(settings?.contactIntro, 'light', locale, NARRATIVE_FALLBACK.light.contactIntro)
  const hasIntro   = introDark || introLight

  const imageSet = {
    dark:  settings?.pageImages?.contact?.dark?.asset?.url  ?? null,
    light: settings?.pageImages?.contact?.light?.asset?.url ?? null,
  }

  return (
    <main className="container section-page">
      <PageHeader imageSet={imageSet}>
        <h1 className="page-title n-slot" style={{ marginBottom: '0.75rem' }}>
          <span className="n-d">{titleDark}</span>
          <span className="n-l">{titleLight}</span>
        </h1>
        {hasIntro && (
          <div style={{
            fontSize: 'var(--text-body)',
            color: 'var(--color-text)',
            lineHeight: 'var(--leading-body)',
            letterSpacing: 'var(--tracking-body)',
            maxWidth: '44ch',
            marginTop: '0.25rem',
          }}>
            <div className="n-slot">
              {introDark  && <p className="n-d" style={{ margin: 0, whiteSpace: 'pre-line' }}>{introDark}</p>}
              {introLight && <p className="n-l" style={{ margin: 0, whiteSpace: 'pre-line' }}>{introLight}</p>}
            </div>
          </div>
        )}
        {subtitle && !hasIntro && (
          <p style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-muted)',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '52ch',
          }}>
            {subtitle}
          </p>
        )}
      </PageHeader>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {social?.email && (
          <ContactRow label={emailLabel}>
            <a href={`mailto:${social.email}`} className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              {social.email}
            </a>
          </ContactRow>
        )}
        {social?.linkedin && (
          <ContactRow label="LinkedIn">
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              {social.linkedin.replace('https://', '')}
            </a>
          </ContactRow>
        )}
        {social?.github && (
          <ContactRow label="GitHub">
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              {social.github.replace('https://', '')}
            </a>
          </ContactRow>
        )}
      </div>
    </main>
  )
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '7rem 1fr',
      gap: '1rem',
      paddingBlock: '1rem',
      borderBottom: 'var(--border-width) solid var(--color-border)',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', fontWeight: 500 }}>
        {label}
      </span>
      {children}
    </div>
  )
}
