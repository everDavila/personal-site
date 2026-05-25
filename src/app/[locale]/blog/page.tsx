import { getAllPosts } from '@/sanity/queries/posts'
import { PostCard } from '@/components/blog/PostCard'
import { getTranslations, getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { BLOG_FALLBACK } from '@/lib/i18n'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { getSiteSettings, lbl } from '@/sanity/queries/siteSettings'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const locale = await getLocale() as Locale
  const [t, subtitle, settings] = await Promise.all([
    getTranslations('blog'),
    getPageSubtitle('blog', locale),
    getSiteSettings(),
  ])

  const b = settings?.labels?.blog
  const title    = lbl(b?.title,  locale, t('title'))
  const emptyMsg = lbl(b?.empty,  locale, t('empty'))

  let posts = await getAllPosts(locale)
  let displayLocale = locale
  if (posts.length === 0) {
    const fallback = BLOG_FALLBACK[locale]
    if (fallback !== locale) {
      posts = await getAllPosts(fallback)
      displayLocale = fallback
    }
  }

  return (
    <main className="container section">
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '0.25rem',
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          marginBottom: '0.5rem',
          maxWidth: '52ch',
          lineHeight: 1.6,
        }}>
          {subtitle}
        </p>
      )}
      <p style={{
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
        marginBottom: '2.5rem',
      }}>
        {t('count', { count: posts.length })}
      </p>

      <div>
        {posts.map(post => (
          <PostCard key={post._id} post={post} locale={displayLocale} />
        ))}
      </div>

      {posts.length === 0 && (
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-body)' }}>
          {emptyMsg}
        </p>
      )}
    </main>
  )
}
