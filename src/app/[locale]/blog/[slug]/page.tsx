import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs } from '@/sanity/queries/posts'
import { PostBody } from '@/components/blog/PostBody'
import { FallbackBadge } from '@/components/ui/FallbackBadge'
import { localized } from '@/lib/i18n'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'
import { LOCALE_NAMES } from '@/lib/i18n'
import type { PortableTextBlock } from '@portabletext/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map(slug => ({ slug }))
}

function readingTime(blocks: PortableTextBlock[]): number {
  const text = blocks.reduce((acc, block) => {
    const b = block as PortableTextBlock & { children?: Array<{ text?: string }> }
    if (b._type === 'block' && Array.isArray(b.children)) {
      return acc + ' ' + b.children.map(c => c.text ?? '').join(' ')
    }
    return acc
  }, '')
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200))
}

const MIN_LABEL: Record<Locale, string> = {
  es: 'min de lectura',
  en: 'min read',
  pt: 'min de leitura',
  qu: 'min',
  zh: '分钟阅读',
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
  const title  = localized(post.title,  currentLocale, post.originalLanguage)
  const excerpt = localized(post.excerpt, currentLocale, post.originalLanguage)

  const locales: Locale[] = ['es', 'en', 'pt', 'qu', 'zh']
  const availableLocales = locales.filter(l => l !== currentLocale && post.title?.[l])

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

  const mins = bodyValue ? readingTime(bodyValue) : null
  const minLabel = MIN_LABEL[currentLocale] ?? 'min read'

  return (
    <main className="container section">

      {/* Back link */}
      <Link
        href={{ pathname: '/blog' }}
        style={{
          fontSize: 'var(--text-label)',
          color: 'var(--color-muted)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          marginBottom: '3rem',
          transition: 'color var(--transition)',
        }}
        className="link-accent"
      >
        ← {t('back')}
      </Link>

      <article style={{ maxWidth: '68ch' }}>

        {/* Header */}
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            color: 'var(--color-text)',
            margin: '0 0 1.25rem',
          }}>
            {title.value || '—'}
            {title.isFallback && title.fallbackLocale && (
              <FallbackBadge fallbackLocale={title.fallbackLocale} />
            )}
          </h1>

          {excerpt.value && (
            <p style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-muted)',
              lineHeight: 1.65,
              margin: '0 0 1.75rem',
              fontStyle: 'italic',
            }}>
              {excerpt.value}
            </p>
          )}

          {/* Meta row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: 'var(--border-width) solid var(--color-border)',
            flexWrap: 'wrap',
          }}>
            <time style={{
              fontSize: 'var(--text-label)',
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {date}
            </time>

            {mins && (
              <>
                <span aria-hidden="true" style={{ color: 'var(--color-border)', fontSize: 'var(--text-label)' }}>·</span>
                <span style={{
                  fontSize: 'var(--text-label)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {mins} {minLabel}
                </span>
              </>
            )}

            {/* Language switcher */}
            {availableLocales.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginLeft: 'auto',
              }}>
                {availableLocales.map(l => (
                  <Link
                    key={l}
                    href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
                    locale={l}
                    style={{
                      fontSize: 'var(--text-label)',
                      fontWeight: 500,
                      color: 'var(--color-muted)',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--tracking-label)',
                      border: 'var(--border-width) solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      padding: '0.2rem 0.5rem',
                      transition: 'border-color var(--transition), color var(--transition)',
                    }}
                    className="link-accent"
                  >
                    {LOCALE_NAMES[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Body */}
        {bodyValue?.length ? (
          <PostBody value={bodyValue} />
        ) : (
          <p style={{ color: 'var(--color-muted)' }}>{t('no_content')}</p>
        )}

      </article>
    </main>
  )
}
