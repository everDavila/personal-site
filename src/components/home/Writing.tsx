import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { localized } from '@/lib/i18n'
import type { PostSummary } from '@/sanity/queries/posts'
import type { Locale } from '@/lib/i18n'

type Props = { posts: PostSummary[]; displayLocale?: Locale }

export async function Writing({ posts, displayLocale }: Props) {
  if (!posts.length) return null

  const locale = (displayLocale ?? await getLocale()) as Locale
  const tn = await getTranslations('nav')
  const tb = await getTranslations('blog')

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
        <p className="text-label" style={{ margin: 0 }}>{tn('blog')}</p>
        <Link
          href={{ pathname: '/blog' }}
          className="link-accent"
          style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', textDecoration: 'none' }}
        >
          {tb('title')} →
        </Link>
      </div>

      {/* 3-col card grid */}
      <div className="writing-grid">
        {posts.map(post => {
          const title   = localized(post.title,   locale, post.originalLanguage)
          const excerpt = localized(post.excerpt,  locale, post.originalLanguage)
          const date    = new Date(post.publishedAt).toLocaleDateString(
            locale === 'zh' ? 'zh-CN' : locale,
            { day: '2-digit', month: 'short', year: 'numeric' }
          )

          return (
            <Link
              key={post._id}
              href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article className="writing-card card-hover">
                {/* Date + arrow */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}>
                  <time style={{
                    fontSize: 'var(--text-label)',
                    fontWeight: 500,
                    color: 'var(--color-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-label)',
                  }}>
                    {date}
                  </time>
                  <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>↗</span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: 'var(--text-body)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  lineHeight: 1.35,
                  margin: '0 0 0.625rem',
                }}>
                  {title.value || '—'}
                </h3>

                {/* Excerpt */}
                {excerpt.value && (
                  <p style={{
                    fontSize: 'var(--text-small)',
                    color: 'var(--color-muted)',
                    lineHeight: 1.6,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {excerpt.value}
                  </p>
                )}
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
