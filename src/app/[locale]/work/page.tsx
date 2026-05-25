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
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '0.25rem',
      }}>
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {projects.map((project, i) => {
            const projectTitle = localized(project.title, locale)
            const summary = localized(project.summary, locale)
            return (
              <Link
                key={project._id}
                href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article
                  className="card-hover"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'start',
                    paddingBlock: '1.75rem',
                    borderTop: i === 0 ? 'none' : 'var(--border-width) solid var(--color-border)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <h2 style={{
                      fontSize: 'var(--text-body)',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      margin: 0,
                    }}>
                      {projectTitle.value || project.client}
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
