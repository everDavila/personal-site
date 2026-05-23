import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { ProjectSummary } from '@/sanity/queries/projects'
import type { Locale } from '@/lib/i18n'

type Props = { projects: ProjectSummary[] }

export async function SelectedWork({ projects }: Props) {
  if (!projects.length) return null

  const locale = await getLocale() as Locale
  const t = await getTranslations('home')
  const tw = await getTranslations('work')

  return (
    <section
      className="container section"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      {/* Section header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '2.5rem',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <p className="text-label" style={{ margin: 0 }}>{t('projects_label')}</p>
        <Link
          href={{ pathname: '/work' }}
          className="link-accent"
          style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', textDecoration: 'none' }}
        >
          {tw('title')} →
        </Link>
      </div>

      {/* 3-col project grid */}
      <div className="projects-grid">
        {projects.map(project => {
          const title   = project.title?.[locale]   || project.title?.es   || project.title?.en   || ''
          const summary = project.summary?.[locale]  || project.summary?.es  || project.summary?.en  || ''

          return (
            <Link
              key={project._id}
              href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
              className="project-card card-hover"
            >
              {/* Image */}
              {project.mainImage?.asset?.url ? (
                <div className="project-card-image">
                  <img
                    src={project.mainImage.asset.url}
                    alt={project.mainImage.alt?.[locale] || title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ) : (
                <div className="project-card-image" style={{ background: 'var(--color-surface)' }} />
              )}

              {/* Meta row: year + arrow */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '0.5rem',
              }}>
                <span style={{
                  fontSize: 'var(--text-label)',
                  fontWeight: 500,
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-label)',
                }}>
                  {project.year || ''}
                </span>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>↗</span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: 'var(--text-body)',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: '0 0 0.375rem',
                lineHeight: 1.3,
              }}>
                {title}
              </h3>

              {/* Description */}
              {summary && (
                <p style={{
                  fontSize: 'var(--text-small)',
                  color: 'var(--color-muted)',
                  lineHeight: 1.6,
                  margin: '0 0 0.75rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {summary}
                </p>
              )}

              {/* Tags */}
              {project.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      fontSize: 'var(--text-label)',
                      color: 'var(--color-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--tracking-label)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
