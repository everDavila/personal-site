import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs } from '@/sanity/queries/posts'
import { PostBody } from '@/components/blog/PostBody'
import { FallbackBadge } from '@/components/ui/FallbackBadge'
import { localized } from '@/lib/i18n'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'
import type { PortableTextBlock } from '@portabletext/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map(slug => ({ slug }))
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [post, locale, t] = await Promise.all([
    getPostBySlug(slug),
    getLocale(),
    getTranslations('blog'),
  ])

  if (!post) notFound()

  const currentLocale = locale as Locale
  const title = localized(post.title, currentLocale, post.originalLanguage)
  const excerpt = localized(post.excerpt, currentLocale, post.originalLanguage)

  const locales: Locale[] = ['es', 'en', 'pt', 'qu', 'zh']
  const bodyBlocks = (post.body as Record<Locale, PortableTextBlock[]>)
  const bodyValue: PortableTextBlock[] | null =
    bodyBlocks[currentLocale] ??
    bodyBlocks[post.originalLanguage] ??
    locales.map(l => bodyBlocks[l]).find(v => v?.length) ??
    null

  const date = new Date(post.publishedAt).toLocaleDateString(
    currentLocale === 'zh' ? 'zh-CN' : currentLocale,
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <main className="container section prose">
      <Link
        href={{ pathname: '/blog' }}
        style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          marginBottom: '2rem',
        }}
      >
        ← {t('back')}
      </Link>

      <article>
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <h1 style={{
              fontSize: 'var(--text-section)',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: 0,
              lineHeight: 1.3,
            }}>
              {title.value || '—'}
            </h1>
            {title.isFallback && title.fallbackLocale && (
              <FallbackBadge fallbackLocale={title.fallbackLocale} />
            )}
          </div>

          {excerpt.value && (
            <p style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-muted)',
              lineHeight: 1.6,
              margin: '0.75rem 0 0',
            }}>
              {excerpt.value}
            </p>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: 'var(--border-width) solid var(--color-border)',
          }}>
            <time style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>
              {date}
            </time>
            {post.categories?.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {post.categories.map(cat => {
                  const catTitle = localized(cat.title, currentLocale, post.originalLanguage)
                  return (
                    <span key={cat.slug} style={{
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
        </header>

        {bodyValue?.length ? (
          <PostBody value={bodyValue} />
        ) : (
          <p style={{ color: 'var(--color-muted)' }}>{t('no_content')}</p>
        )}
      </article>
    </main>
  )
}
