import { getAllPosts } from '@/sanity/queries/posts'
import { PostCard } from '@/components/blog/PostCard'
import { getTranslations, getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { BLOG_FALLBACK } from '@/lib/i18n'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { getSiteSettings, lbl, pageImage } from '@/sanity/queries/siteSettings'
import { getMode } from '@/lib/mode'
import { PageHeader } from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

const COUNT_LABEL: Record<Locale, (n: number) => string> = {
  es: (n) => `${n} nota${n !== 1 ? 's' : ''}`,
  en: (n) => `${n} note${n !== 1 ? 's' : ''}`,
  pt: (n) => `${n} nota${n !== 1 ? 's' : ''}`,
  qu: (n) => `${n} willakuy`,
  zh: (n) => `${n} 篇`,
}

export default async function BlogPage() {
  const [locale, mode] = await Promise.all([
    getLocale() as Promise<Locale>,
    getMode(),
  ])
  const [t, subtitle, settings] = await Promise.all([
    getTranslations('blog'),
    getPageSubtitle('blog', locale),
    getSiteSettings(),
  ])

  const n       = settings?.labels?.nav
  const b       = settings?.labels?.blog
  const title   = lbl(n?.blog, locale, t('title'))
  const emptyMsg = lbl(b?.empty, locale, t('empty'))
  const imgUrl  = pageImage(settings?.pageImages?.blog, mode)

  let posts = await getAllPosts(locale)
  let displayLocale = locale
  if (posts.length === 0) {
    const fallback = BLOG_FALLBACK[locale]
    if (fallback !== locale) {
      posts = await getAllPosts(fallback)
      displayLocale = fallback
    }
  }

  const [featured, ...rest] = posts
  const countLabel = (COUNT_LABEL[locale] ?? COUNT_LABEL.en)(posts.length)

  return (
    <main className="container section">

      {/* ── Editorial header ── */}
      <PageHeader imageUrl={imgUrl}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '0.5rem',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--color-text)',
            margin: 0,
          }}>
            {title}
          </h1>
          {posts.length > 0 && (
            <span style={{
              fontSize: 'var(--text-label)',
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}>
              {countLabel}
            </span>
          )}
        </div>

        {subtitle && (
          <p style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-muted)',
            maxWidth: '52ch',
            lineHeight: 1.6,
            marginBottom: '0',
          }}>
            {subtitle}
          </p>
        )}
      </PageHeader>

      {posts.length === 0 && (
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-body)', marginTop: '3rem' }}>
          {emptyMsg}
        </p>
      )}

      {/* ── Featured post — no cover image, prominence via typography ── */}
      {featured && (
        <PostCard post={featured} locale={displayLocale} featured />
      )}

      {/* ── Compact list ── */}
      {rest.length > 0 && (
        <div style={{ marginTop: featured ? '0' : '3rem' }}>
          {rest.map(post => (
            <PostCard key={post._id} post={post} locale={displayLocale} />
          ))}
        </div>
      )}

    </main>
  )
}
