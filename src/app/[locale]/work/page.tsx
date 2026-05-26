import { getAllProjects } from '@/sanity/queries/projects'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { getSiteSettings, lbl } from '@/sanity/queries/siteSettings'

export const dynamic = 'force-dynamic'

export default async function WorkPage() {
  const locale = await getLocale() as Locale
  const [projects, t, subtitle, settings] = await Promise.all([
    getAllProjects(),
    getTranslations('work'),
    getPageSubtitle('work', locale),
    getSiteSettings(),
  ])

  const w = settings?.labels?.work
  const title = lbl(w?.title, locale, t('title'))
  const empty = lbl(w?.empty, locale, t('empty'))

  return (
    <main className="container section">
      <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>
        {title}
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

      {projects.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>{empty}</p>
      ) : (
        <div className="projects-list">
          {projects.map((project, i) => {
            const projectTitle = localized(project.title, locale)
            const summary = localized(project.summary, locale)
            return (
              <Link
                key={project._id}
                href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
                className="project-row"
              >
                <span className="project-row-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="project-row-title">
                    {projectTitle.value || project.client}
                  </h2>
                  {project.client && (
                    <span className="project-row-summary">{project.client}</span>
                  )}
                  {summary.value && (
                    <p className="project-row-summary" style={{ marginTop: '0.2rem' }}>
                      {summary.value}
                    </p>
                  )}
                </div>
                <div className="project-row-meta">
                  {project.year && <span>{project.year}</span>}
                  <span>↗</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
