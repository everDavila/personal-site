import { getLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { ProjectSummary } from '@/sanity/queries/projects'
import type { Locale } from '@/lib/i18n'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { lbl } from '@/sanity/queries/siteSettings'

type Props = { projects: ProjectSummary[]; settings?: SiteSettings | null }

export async function SelectedWork({ projects, settings }: Props) {
  if (!projects.length) return null

  const locale = await getLocale() as Locale
  const t  = await getTranslations('home')
  const tw = await getTranslations('work')

  const h  = settings?.labels?.home
  const w  = settings?.labels?.work
  const sectionLabel = lbl(h?.projectsLabel, locale, t('projects_label'))
  const workTitle    = lbl(w?.title,         locale, tw('title'))

  return (
    <section
      className="container section"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '3rem',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <p className="text-label" style={{ margin: 0 }}>{sectionLabel}</p>
        <Link
          href={{ pathname: '/work' }}
          className="link-accent"
          style={{
            fontSize: 'var(--text-label)',
            color: 'var(--color-muted)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {workTitle} →
        </Link>
      </div>

      <div className="projects-list">
        {projects.map((project, i) => {
          const title   = project.title?.[locale]   || project.title?.es   || project.title?.en   || ''
          const summary = project.summary?.[locale]  || project.summary?.es  || project.summary?.en  || ''

          return (
            <Link
              key={project._id}
              href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
              className="project-row"
            >
              <span className="project-row-num">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div>
                <h3 className="project-row-title">{title}</h3>
                {summary && (
                  <p className="project-row-summary">{summary}</p>
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
    </section>
  )
}
