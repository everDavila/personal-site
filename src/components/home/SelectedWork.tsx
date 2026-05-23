import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { ProjectSummary } from '@/sanity/queries/projects'
import type { Locale } from '@/lib/i18n'

type Props = { projects: ProjectSummary[] }

export async function SelectedWork({ projects }: Props) {
  if (!projects.length) return null

  const locale = await getLocale() as Locale
  const t = await getTranslations('home')

  return (
    <section
      className="container section"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <p className="text-label" style={{ marginBottom: '2.5rem' }}>{t('projects_label')}</p>

      <div className="projects-grid">
        {projects.map(project => {
          const title = project.title?.[locale] || project.title?.es || project.title?.en || ''
          const role  = project.role?.[locale]  || project.role?.es  || ''

          return (
            <Link
              key={project._id}
              href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
              className="project-card card-hover"
            >
              {project.mainImage?.asset?.url && (
                <div className="project-card-image">
                  <img
                    src={project.mainImage.asset.url}
                    alt={project.mainImage.alt?.[locale] || title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}

              <div>
                {project.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        fontSize: 'var(--text-label)',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: 'var(--tracking-label)',
                        color: 'var(--color-muted)',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h3 style={{
                  fontSize: 'var(--text-body)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  margin: '0 0 0.25rem',
                }}>
                  {title}
                </h3>

                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', margin: 0 }}>
                  {[project.client, role, project.year].filter(Boolean).join(' — ')}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <Link
          href={{ pathname: '/work' }}
          className="link-accent"
          style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-muted)',
            textDecoration: 'none',
            borderBottom: '1px solid currentColor',
            paddingBottom: '2px',
          }}
        >
          {t('projects_label')} →
        </Link>
      </div>
    </section>
  )
}
