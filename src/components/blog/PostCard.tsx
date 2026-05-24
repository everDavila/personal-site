import { Link } from '@/i18n/navigation'
import { localized, type Locale } from '@/lib/i18n'
import { FallbackBadge } from '@/components/ui/FallbackBadge'
import type { PostSummary } from '@/sanity/queries/posts'

type Props = { post: PostSummary; locale: Locale }

export function PostCard({ post, locale }: Props) {
  const title = localized(post.title, locale, post.originalLanguage)
  const excerpt = localized(post.excerpt, locale, post.originalLanguage)

  const date = new Date(post.publishedAt).toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link
      href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <article
        className="card-hover"
        style={{
          paddingBlock: '1.75rem',
          borderBottom: 'var(--border-width) solid var(--color-border)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          alignItems: 'start',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h2 style={{
              fontSize: 'var(--text-body)',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: 0,
            }}>
              {title.value || '—'}
            </h2>
            {title.isFallback && title.fallbackLocale && (
              <FallbackBadge fallbackLocale={title.fallbackLocale} />
            )}
          </div>

          {excerpt.value && (
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
              {excerpt.value}
            </p>
          )}

          {post.categories?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              {post.categories.map((cat, i) => {
                const catTitle = localized(cat.title, locale, post.originalLanguage)
                return (
                  <span key={`${post._id}-${cat.slug ?? i}`} style={{
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: 'var(--color-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {catTitle.value}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        <time style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          whiteSpace: 'nowrap',
          paddingTop: '0.2rem',
        }}>
          {date}
        </time>
      </article>
    </Link>
  )
}
