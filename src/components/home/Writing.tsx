import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { localized } from '@/lib/i18n'
import type { PostSummary } from '@/sanity/queries/posts'
import type { Locale } from '@/lib/i18n'

type Props = { posts: PostSummary[] }

export async function Writing({ posts }: Props) {
  if (!posts.length) return null

  const locale = await getLocale() as Locale
  const t = await getTranslations('home')

  return (
    <section
      className="container section"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <p className="text-label" style={{ marginBottom: '2rem' }}>{t('posts_label')}</p>

      <div>
        {posts.map(post => {
          const title = localized(post.title, locale, post.originalLanguage)
          const date  = new Date(post.publishedAt).toLocaleDateString(
            locale === 'zh' ? 'zh-CN' : locale,
            { year: 'numeric', month: 'short' }
          )

          return (
            <Link
              key={post._id}
              href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <article
                className="card-hover"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '1.5rem',
                  paddingBlock: '1.125rem',
                  borderBottom: 'var(--border-width) solid var(--color-border)',
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  fontWeight: 500,
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text)',
                }}>
                  {title.value || '—'}
                </span>
                <time style={{
                  fontSize: 'var(--text-small)',
                  color: 'var(--color-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {date}
                </time>
              </article>
            </Link>
          )
        })}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link
          href={{ pathname: '/blog' }}
          className="link-accent"
          style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-muted)',
            textDecoration: 'none',
            borderBottom: '1px solid currentColor',
            paddingBottom: '2px',
          }}
        >
          {t('posts_label')} →
        </Link>
      </div>
    </section>
  )
}
