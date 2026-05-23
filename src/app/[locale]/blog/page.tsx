import { getAllPosts } from '@/sanity/queries/posts'
import { PostCard } from '@/components/blog/PostCard'
import { getTranslations, getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'

export default async function BlogPage() {
  const [posts, t, locale] = await Promise.all([
    getAllPosts(),
    getTranslations('blog'),
    getLocale(),
  ])

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
        {posts.length} {t('count', { count: posts.length })}
      </p>

      <div>
        {posts.map(post => (
          <PostCard key={post._id} post={post} locale={locale as Locale} />
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
