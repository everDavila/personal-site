import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAdjacentPosts } from '@/sanity/queries/posts'
import { PostBody } from '@/components/blog/PostBody'
import { FallbackBadge } from '@/components/ui/FallbackBadge'
import { localized } from '@/lib/i18n'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'
import { LOCALE_NAMES } from '@/lib/i18n'
import type { PortableTextBlock } from '@portabletext/types'

type Props = { params: Promise<{ slug: string; locale: string }> }

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; locale: string }> }
): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, locale as Locale)
  if (!post) return {}

  const currentLocale = locale as Locale
  const title  = localized(post.title,   currentLocale, post.originalLanguage)
  const excerpt = localized(post.excerpt, currentLocale, post.originalLanguage)

  const date = new Date(post.publishedAt).toLocaleDateString(
    currentLocale === 'zh' ? 'zh-CN' : currentLocale,
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://davila.uno'
  const ogImage = post.mainImage?.asset?.url
    ?? `${base}/api/og?title=${encodeURIComponent(title.value ?? '')}&date=${encodeURIComponent(date)}`

  return {
    title: title.value ?? undefined,
    description: excerpt.value ?? undefined,
    openGraph: {
      title:         title.value  ?? undefined,
      description:   excerpt.value ?? undefined,
      type:          'article',
      publishedTime: post.publishedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title.value ?? '' }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       title.value  ?? undefined,
      description: excerpt.value ?? undefined,
      images:      [ogImage],
    },
  }
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
  const { slug, locale } = await params
  setRequestLocale(locale)
  const [post, t] = await Promise.all([
    getPostBySlug(slug, locale as Locale),
    getTranslations('blog'),
  ])

  if (!post) notFound()

  const { prev: prevPost, next: nextPost } = await getAdjacentPosts(post.publishedAt)

  const currentLocale = locale as Locale
  const title  = localized(post.title,  currentLocale, post.originalLanguage)
  const excerpt = localized(post.excerpt, currentLocale, post.originalLanguage)

  const locales: Locale[] = ['es', 'en', 'pt', 'qu', 'zh']
  const availableLocales = locales.filter(l => l !== currentLocale && post.title?.[l])

  const bodyBlocks = post.body as Record<Locale, PortableTextBlock[]> | null
  const bodyValue: PortableTextBlock[] | null =
    bodyBlocks?.[currentLocale] ??
    bodyBlocks?.[post.originalLanguage] ??
    locales.map(l => bodyBlocks?.[l]).find(v => v?.length) ??
    null

  const date = new Date(post.publishedAt).toLocaleDateString(
    currentLocale === 'zh' ? 'zh-CN' : currentLocale,
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  const mins = bodyValue ? readingTime(bodyValue) : null
  const minLabel = MIN_LABEL[currentLocale] ?? 'min read'

  return (
    <main className="container section-page">

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

      {/* Cover image — real from Sanity or generated from title */}
      {(() => {
        const imageSrc = post.mainImage?.asset?.url
          ?? `/api/og?title=${encodeURIComponent(title.value || '')}&date=${encodeURIComponent(date)}`
        const imageAlt = post.mainImage
          ? (post.mainImage.alt?.[currentLocale] ?? post.mainImage.alt?.[post.originalLanguage as Locale] ?? title.value ?? '')
          : (title.value ?? '')
        return (
          <div style={{
            marginInline: 'calc(-1 * var(--spacing-container))',
            aspectRatio: '1200 / 630',
            overflow: 'hidden',
            marginBottom: '3rem',
            backgroundColor: '#0F0F0D',
          }}>
            <img
              src={imageSrc}
              alt={imageAlt}
              width={1200}
              height={630}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: post.mainImage
                  ? 'grayscale(100%) brightness(0.97) contrast(1.05)'
                  : 'none',
              }}
            />
          </div>
        )
      })()}

      <article style={{ maxWidth: '64ch' }}>

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

          {/* Meta row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            paddingTop: '1.25rem',
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
                gap: '0.75rem',
                marginLeft: 'auto',
              }}>
                {availableLocales.map(l => (
                  <Link
                    key={l}
                    href={{ pathname: '/blog/[slug]', params: { slug: post.slugs[l] } }}
                    locale={l}
                    style={{
                      fontSize: 'var(--text-label)',
                      color: 'var(--color-muted)',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      transition: 'color var(--transition)',
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

      {/* Adjacent post navigation */}
      {(prevPost || nextPost) && (
        <nav
          aria-label="Post navigation"
          style={{
            maxWidth: '64ch',
            borderTop: 'var(--border-width) solid var(--color-border)',
            marginTop: '5rem',
            paddingTop: '3rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
          }}
        >
          <div>
            {prevPost && (
              <Link
                href={{ pathname: '/blog/[slug]', params: { slug: prevPost.slugs[currentLocale] } }}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                className="link-accent"
              >
                <p style={{
                  fontSize: 'var(--text-label)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: '0 0 0.5rem',
                }}>
                  ← {t('prev')}
                </p>
                <p style={{
                  fontSize: 'var(--text-small)',
                  lineHeight: 1.4,
                  margin: 0,
                  color: 'var(--color-text)',
                }}>
                  {localized(prevPost.title, currentLocale, prevPost.originalLanguage).value || '—'}
                </p>
              </Link>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            {nextPost && (
              <Link
                href={{ pathname: '/blog/[slug]', params: { slug: nextPost.slugs[currentLocale] } }}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                className="link-accent"
              >
                <p style={{
                  fontSize: 'var(--text-label)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: '0 0 0.5rem',
                }}>
                  {t('next')} →
                </p>
                <p style={{
                  fontSize: 'var(--text-small)',
                  lineHeight: 1.4,
                  margin: 0,
                  color: 'var(--color-text)',
                }}>
                  {localized(nextPost.title, currentLocale, nextPost.originalLanguage).value || '—'}
                </p>
              </Link>
            )}
          </div>
        </nav>
      )}

    </main>
  )
}
