import type { Metadata } from 'next'
import { getAllProjects } from '@/sanity/queries/projects'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { getMode } from '@/lib/mode'
import { getSiteSettings, lbl, narrativeText, NARRATIVE_FALLBACK, resolveSeo } from '@/sanity/queries/siteSettings'
import { PageHeader } from '@/components/ui/PageHeader'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings()
  const { title, description } = resolveSeo(settings?.seoPages?.work, locale as Locale, {
    title: 'Proyectos — Ever Davila',
    description: 'Intervenciones de diseño en sistemas complejos del sector público peruano.',
  })
  return { title, description, openGraph: { title, description }, twitter: { title, description } }
}

export const dynamic = 'force-dynamic'

export default async function WorkPage() {
  const locale = await getLocale() as Locale
  const mode   = await getMode()
  const [projects, t, subtitle, settings] = await Promise.all([
    getAllProjects(),
    getTranslations('work'),
    getPageSubtitle('work', locale, mode),
    getSiteSettings(),
  ])

  const w          = settings?.labels?.work
  const titleDark  = narrativeText(settings?.pageTitles?.work, 'dark',  locale, NARRATIVE_FALLBACK.dark.pageTitles.work)  ?? lbl(w?.title, locale, t('title'))
  const titleLight = narrativeText(settings?.pageTitles?.work, 'light', locale, NARRATIVE_FALLBACK.light.pageTitles.work) ?? titleDark
  const empty      = lbl(w?.empty, locale, t('empty'))

  const imageSet = {
    dark:  settings?.pageImages?.work?.dark?.asset?.url  ?? null,
    light: settings?.pageImages?.work?.light?.asset?.url ?? null,
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
            marginBottom: '3rem',
            maxWidth: '52ch',
            lineHeight: 1.6,
          }}>
            {subtitle}
          </p>
        )}
      </PageHeader>

      {projects.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>{empty}</p>
      ) : (
        <div className="lab-list">
          {projects.map((project) => {
            const summary = localized(project.summary, locale)
            const role    = localized(project.role,    locale)
            const detail  = [role.value, project.year].filter(Boolean).join(' · ')
            const imgUrl  = project.mainImage?.asset?.url ?? null
            const imgAlt  = localized(project.mainImage?.alt ?? {}, locale).value ?? project.client ?? ''
            return (
              <Link
                key={project._id}
                href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
                className="lab-row"
              >
                <div className="lab-row-image">
                  {imgUrl ? (
                    <Image src={imgUrl} alt={imgAlt} width={240} height={160} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.5rem', opacity: 0.25 }}>◌</span>
                  )}
                </div>
                <div className="lab-row-body">
                  <div className="lab-row-meta">
                    <span style={{ color: 'var(--color-muted)' }}>{project.client}</span>
                    {detail && <span style={{ color: 'var(--color-muted)' }}>{detail}</span>}
                  </div>
                  <h3 className="lab-row-title">{summary.value || '—'}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
