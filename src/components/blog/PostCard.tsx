import { Link } from '@/i18n/navigation'
import { localized, type Locale } from '@/lib/i18n'
import { FallbackBadge } from '@/components/ui/FallbackBadge'
import type { PostSummary } from '@/sanity/queries/posts'

type Props = { post: PostSummary; locale: Locale; featured?: boolean }

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(2, Math.ceil((words * 4) / 200))
}

const DAY = 86_400_000

function editorialLabel(publishedAt: string, updatedAt: string, locale: Locale): string | null {
  const published = new Date(publishedAt).getTime()
  const updated   = new Date(updatedAt).getTime()
  const now       = Date.now()
  if (now - published < 7 * DAY)                        return LABELS.new[locale]
  if (updated - published > DAY && now - updated < 30 * DAY) return LABELS.updated[locale]
  return null
}

const LABELS = {
  new:     { es: 'Nuevo',              en: 'New',              pt: 'Novo',            qu: 'Musuq',       zh: '最新' },
  updated: { es: 'Actualizado',        en: 'Updated recently', pt: 'Atualizado',      qu: 'Musuqchasqa', zh: '已更新' },
  field:   { es: 'Notas de campo',     en: 'Field Notes',      pt: 'Notas de campo',  qu: 'Willakuy',    zh: '田野笔记' },
  min:     { es: 'min',                en: 'min',              pt: 'min',             qu: 'min',         zh: '分钟' },
} as const

type LabelKey = keyof typeof LABELS
function lbl(key: LabelKey, locale: Locale): string {
  return (LABELS[key] as Record<string, string>)[locale] ?? (LABELS[key] as Record<string, string>).en
}

export function PostCard({ post, locale, featured = false }: Props) {
  const title   = localized(post.title,   locale, post.originalLanguage)
  const excerpt = localized(post.excerpt, locale, post.originalLanguage)

  const date = new Date(post.publishedAt).toLocaleDateString(
    locale === 'zh' ? 'zh-CN' : locale,
    { year: 'numeric', month: 'short', day: 'numeric' }
  )

  const mins    = estimateReadTime(excerpt.value || title.value || '')
  const elabel  = editorialLabel(post.publishedAt, post._updatedAt, locale)

  if (featured) {
    return (
      <Link
        href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <article className="blog-featured">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <p className="text-label" style={{ margin: 0 }}>{lbl('field', locale)}</p>
            {elabel && (
              <span style={{
                fontSize: 'var(--text-label)',
                color: 'var(--color-accent)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                — {elabel}
              </span>
            )}
          </div>
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
            <span>{mins} {lbl('min', locale)}</span>
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
            <h2 className="blog-row-title">
              {title.value || '—'}
              {title.isFallback && title.fallbackLocale && (
                <FallbackBadge fallbackLocale={title.fallbackLocale} />
              )}
            </h2>
            {elabel && (
              <span style={{
                fontSize: 'var(--text-label)',
                color: 'var(--color-accent)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                {elabel}
              </span>
            )}
          </div>
          {excerpt.value && (
            <p className="blog-row-excerpt">{excerpt.value}</p>
          )}
        </div>
        <div className="blog-row-meta">
          <time>{date}</time>
          <span>{mins} {lbl('min', locale)}</span>
        </div>
      </article>
    </Link>
  )
}
