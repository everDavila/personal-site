import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { PostSummary } from '@/sanity/queries/posts'
import type { Locale } from '@/lib/i18n'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { lbl } from '@/sanity/queries/siteSettings'
import { PostCard } from '@/components/blog/PostCard'

type Props = { posts: PostSummary[]; displayLocale?: Locale; settings?: SiteSettings | null }

export async function Writing({ posts, displayLocale, settings }: Props) {
  if (!posts.length) return null

  const locale = (displayLocale ?? await getLocale()) as Locale
  const tn = await getTranslations('nav')
  const tb = await getTranslations('blog')

  const n = settings?.labels?.nav
  const b = settings?.labels?.blog
  const sectionLabel = lbl(n?.blog,  locale, tn('blog'))
  const blogTitle    = lbl(b?.title, locale, tb('title'))

  return (
    <section
      className="container section-inner"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '0.5rem',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <p className="text-label" style={{ margin: 0 }}>{sectionLabel}</p>
        <Link
          href={{ pathname: '/blog' }}
          className="link-accent"
          style={{ fontSize: 'var(--text-label)', color: 'var(--color-muted)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          {sectionLabel} →
        </Link>
      </div>

      <div>
        {posts.map(post => (
          <PostCard key={post._id} post={post} locale={locale} />
        ))}
      </div>
    </section>
  )
}
