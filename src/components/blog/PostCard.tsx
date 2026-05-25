import { Link } from '@/i18n/navigation'
import { localized, type Locale } from '@/lib/i18n'
import { FallbackBadge } from '@/components/ui/FallbackBadge'
import type { PostSummary } from '@/sanity/queries/posts'

type Props = { post: PostSummary; locale: Locale; featured?: boolean }

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(2, Math.ceil((words * 4) / 200))
}

const FIELD_LABEL: Record<Locale, string> = {
  es: 'Notas de campo',
  en: 'Field Notes',
  pt: 'Notas de campo',
  qu: 'Llank\'ay willakuy',
  zh: '田野笔记',
}

const MIN_LABEL: Record<Locale, string> = {
  es: 'min',
  en: 'min',
  pt: 'min',
  qu: 'min',
  zh: '分钟',
}

export function PostCard({ post, locale, featured = false }: Props) {
  const title   = localized(post.title,   locale, post.originalLanguage)
  const excerpt = localized(post.excerpt, locale, post.originalLanguage)

  const date = new Date(post.publishedAt).toLocaleDateString(
    locale === 'zh' ? 'zh-CN' : locale,
    { year: 'numeric', month: 'short', day: 'numeric' }
  )

  const mins = estimateReadTime(excerpt.value || title.value || '')
  const minLabel = MIN_LABEL[locale] ?? 'min'

  if (featured) {
    return (
      <Link
        href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <article className="blog-featured">
          <p className="text-label" style={{ marginBottom: '1.5rem' }}>
            {FIELD_LABEL[locale] ?? 'Field Notes'}
          </p>
          <h2 className="blog-featured-title">
            {title.value || '—'}
            {title.isFallback && title.fallbackLocale && (
              <FallbackBadge fallbackLocale={title.fallbackLocale} />
            )}
          </h2>
          {excerpt.value && (
            <p className="blog-featured-excerpt">{excerpt.value}</p>
          )}
          <div className="blog-meta">
            <time>{date}</time>
            <span aria-hidden="true">·</span>
            <span>{mins} {minLabel}</span>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link
      href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <article className="blog-row">
        <div className="blog-row-main">
          <h2 className="blog-row-title">
            {title.value || '—'}
            {title.isFallback && title.fallbackLocale && (
              <FallbackBadge fallbackLocale={title.fallbackLocale} />
            )}
          </h2>
          {excerpt.value && (
            <p className="blog-row-excerpt">{excerpt.value}</p>
          )}
        </div>
        <div className="blog-row-meta">
          <time>{date}</time>
          <span>{mins} {minLabel}</span>
        </div>
      </article>
    </Link>
  )
}
