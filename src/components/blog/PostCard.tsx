import { Link } from '@/i18n/navigation'
import { localized, type Locale } from '@/lib/i18n'
import { FallbackBadge } from '@/components/ui/FallbackBadge'
import type { PostSummary } from '@/sanity/queries/posts'
import Image from 'next/image'

type Props = { post: PostSummary; locale: Locale; featured?: boolean }

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(2, Math.ceil((words * 4) / 200))
}

const DAY = 86_400_000

function editorialLabel(publishedAt: string, locale: Locale): string | null {
  const published = new Date(publishedAt).getTime()
  const now       = Date.now()
  if (now - published < 7 * DAY) return LABELS.new[locale]
  return null
}

const LABELS = {
  new:   { es: 'Nuevo',          en: 'New',        pt: 'Novo',           qu: 'Musuq',    zh: '最新'     },
  field: { es: 'Notas de campo', en: 'Field Notes', pt: 'Notas de campo', qu: 'Willakuy', zh: '田野笔记' },
  min:   { es: 'min',            en: 'min',         pt: 'min',            qu: 'min',      zh: '分钟'     },
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
  const elabel  = editorialLabel(post.publishedAt, locale)

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

  const imgUrl = post.mainImage?.asset?.url ?? null
  const imgAlt = post.mainImage?.alt?.[locale] ?? post.mainImage?.alt?.es ?? ''

  return (
    <Link
      href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}
      className="lab-row"
    >
      <div className="lab-row-image">
        {imgUrl ? (
          <Image src={imgUrl} alt={imgAlt} width={240} height={160} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '1.5rem', opacity: 0.25 }}>◌</span>
        )}
      </div>
      <div className="lab-row-body">
        <div className="lab-row-meta">
          <time style={{ color: 'var(--color-muted)' }}>{date}</time>
          <span style={{ color: 'var(--color-muted)' }}>{mins} {lbl('min', locale)}</span>
          {elabel && (
            <span style={{ color: 'var(--color-accent)', textTransform: 'uppercase' }}>{elabel}</span>
          )}
        </div>
        <h2 className="lab-row-title">
          {title.value || '—'}
          {title.isFallback && title.fallbackLocale && (
            <FallbackBadge fallbackLocale={title.fallbackLocale} />
          )}
        </h2>
        {excerpt.value && (
          <p className="lab-row-desc">{excerpt.value}</p>
        )}
      </div>
    </Link>
  )
}
