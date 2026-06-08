import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { ProjectSummary } from '@/sanity/queries/projects'
import type { Locale } from '@/lib/i18n'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { lbl } from '@/sanity/queries/siteSettings'

const DARK_LABEL: Record<string, string> = {
  es: 'Misiones', en: 'Missions', pt: 'Missões', qu: 'Misiones', zh: '使命',
}

const EXPLORE_LABEL: Record<string, string> = {
  es: 'Explorar caso', en: 'Explore case', pt: 'Explorar caso', qu: 'Explorar caso', zh: '探索案例',
}

type Props = { projects: ProjectSummary[]; settings?: SiteSettings | null }

export async function SelectedWork({ projects, settings }: Props) {
  if (!projects.length) return null

  const locale = await getLocale() as Locale
  const t = await getTranslations('home')

  const h = settings?.labels?.home

  const PROJECTS_DESC_FALLBACK: Record<string, string> = {
    es: 'Proyectos de diseño UX/UI en sistemas reales, entidades públicas y productos digitales complejos.',
    en: 'UX/UI design projects for real systems, public institutions and complex digital products.',
    pt: 'Projetos de design UX/UI em sistemas reais, entidades públicas e produtos digitais complexos.',
    qu: 'Proyectos de diseño UX/UI en sistemas reales.',
    zh: '真实系统中的 UX/UI 设计项目，包括政府机构和复杂数字产品。',
  }

  const sectionLabel  = lbl(h?.projectsLabel, locale, t('projects_label'))
  const sectionDesc   = lbl(h?.projectsDesc,  locale, PROJECTS_DESC_FALLBACK[locale] ?? PROJECTS_DESC_FALLBACK.en)
  const darkLabel     = DARK_LABEL[locale]    ?? DARK_LABEL.en
  const exploreLabel  = EXPLORE_LABEL[locale] ?? EXPLORE_LABEL.en

  return (
    <section
      className="container section-inner"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div className="missions-header">
        <p className="text-label" style={{ margin: 0 }}>
          <span className="n-slot">
            <span className="n-d">{darkLabel}</span>
            <span className="n-l">{sectionLabel}</span>
          </span>
        </p>
        <p className="missions-desc">
          {sectionDesc}
        </p>
      </div>

      <div className="projects-list">
        {projects.map((project, idx) => {
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
                <span className="project-row-cta">
                  {exploreLabel} <span className="project-row-cta-arrow">→</span>
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
