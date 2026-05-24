import { getAllPosts } from '@/sanity/queries/posts'
import { PostCard } from '@/components/blog/PostCard'
import { getTranslations, getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { BLOG_FALLBACK } from '@/lib/i18n'

export default async function BlogPage() {
  const [t, locale] = await Promise.all([
    getTranslations('blog'),
    getLocale(),
  ])

  const currentLocale = locale as Locale

  // Show posts in current locale; fall back per BLOG_FALLBACK map if none exist.
  // displayLocale tracks which locale to render content in (may differ from currentLocale).
  let posts = await getAllPosts(currentLocale)
  let displayLocale = currentLocale
  if (posts.length === 0) {
    const fallback = BLOG_FALLBACK[currentLocale]
    if (fallback !== currentLocale) {
      posts = await getAllPosts(fallback)
      displayLocale = fallback
    }
  }

  return (
    <main className="container section">
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '0.25rem',
      }}>
        {t('title')}
      </h1>
      <p style={{
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
        marginBottom: '2rem',
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
          {t('empty')}
        </p>
      )}
    </main>
  )
}
