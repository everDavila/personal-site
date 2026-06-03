import type { Metadata } from 'next'
import { getAllProjects } from '@/sanity/queries/projects'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import { Link } from '@/i18n/navigation'
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
        <div className="projects-list">
          {projects.map((project) => {
            const summary = localized(project.summary, locale)
            const role    = localized(project.role,    locale)
            const detail  = [role.value, project.year].filter(Boolean).join(' · ')
            return (
              <Link
                key={project._id}
                href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
                className="project-row"
              >
                <p className="project-row-headline">{summary.value}</p>
                <div className="project-row-footer">
                  <div className="project-row-meta-left">
                    <p className="project-row-client">{project.client}</p>
                    {detail && <p className="project-row-detail">{detail}</p>}
                  </div>
                  <span className="project-row-arrow">↗</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
