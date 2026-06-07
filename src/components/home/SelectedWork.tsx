import { getLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { ProjectSummary } from '@/sanity/queries/projects'
import type { Locale } from '@/lib/i18n'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { lbl } from '@/sanity/queries/siteSettings'

const DARK_LABEL: Record<string, string> = {
  es: 'Misiones', en: 'Missions', pt: 'Missões', qu: 'Misiones', zh: '使命',
}

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
  const darkLabel    = DARK_LABEL[locale] ?? DARK_LABEL.en

  return (
    <section
      className="container section-inner"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '3rem',
      }}>
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
          <span className="n-slot">
            <span className="n-d">{darkLabel}</span>
            <span className="n-l">{workTitle}</span>
          </span>
          {' →'}
        </Link>
      </div>

      <div className="projects-list">
        {projects.map((project) => {
          const summary = project.summary?.[locale] || project.summary?.es || project.summary?.en || ''
          const role    = project.role?.[locale]    || project.role?.es    || project.role?.en    || ''
          const detail  = [role, project.year].filter(Boolean).join(' · ')

          return (
            <Link
              key={project._id}
              href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
              className="project-row"
            >
              <p className="project-row-headline">
                {summary}
              </p>

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
    </section>
  )
}
