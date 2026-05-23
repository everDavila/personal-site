import { getAllProjects } from '@/sanity/queries/projects'
import { getLocale, getTranslations } from 'next-intl/server'
import { localized } from '@/lib/i18n'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'

export default async function WorkPage() {
  const [projects, locale, t] = await Promise.all([
    getAllProjects(),
    getLocale(),
    getTranslations('work'),
  ])

  const currentLocale = locale as Locale

  return (
    <main className="container section">
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '3rem',
      }}>
        {t('title')}
      </h1>

      {projects.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>{t('empty')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {projects.map((project, i) => {
            const title = localized(project.title, currentLocale)
            const summary = localized(project.summary, currentLocale)
            return (
              <Link
                key={project._id}
                href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'start',
                    paddingBlock: '1.75rem',
                    borderTop: i === 0 ? 'none' : 'var(--border-width) solid var(--color-border)',
                    transition: 'opacity var(--transition)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h2 style={{
                      fontSize: 'var(--text-body)',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      margin: 0,
                    }}>
                      {title.value || project.client}
                    </h2>
                    <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>
                      {project.client}
                    </span>
                    {summary.value && (
                      <p style={{
                        fontSize: 'var(--text-small)',
                        color: 'var(--color-muted)',
                        lineHeight: 1.6,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {summary.value}
                      </p>
                    )}
                    {project.tags?.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        {project.tags.map(tag => (
                          <span key={tag} style={{
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: 'var(--color-accent)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {project.year && (
                    <span style={{
                      fontSize: 'var(--text-small)',
                      color: 'var(--color-muted)',
                      whiteSpace: 'nowrap',
                      paddingTop: '0.2rem',
                    }}>
                      {project.year}
                    </span>
                  )}
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
