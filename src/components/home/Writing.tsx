import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { PostSummary } from '@/sanity/queries/posts'
import type { Locale } from '@/lib/i18n'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { lbl } from '@/sanity/queries/siteSettings'
import { PostCard } from '@/components/blog/PostCard'

const DARK_LABEL: Record<string, string> = {
  es: 'Apuntes', en: 'Logs', pt: 'Registros', qu: 'Bitácora', zh: '日志',
}

type Props = { posts: PostSummary[]; displayLocale?: Locale; settings?: SiteSettings | null }

export async function Writing({ posts, displayLocale, settings }: Props) {
  if (!posts.length) return null

  const locale = (displayLocale ?? await getLocale()) as Locale
  const tn = await getTranslations('nav')
  const tb = await getTranslations('blog')

  const POSTS_DESC_FALLBACK: Record<string, string> = {
    es: 'Reflexiones sobre diseño, sistemas y todo lo que no cabe en un brief.',
    en: 'Thoughts on design, systems, and everything that doesn\'t fit in a brief.',
    pt: 'Reflexões sobre design, sistemas e tudo o que não cabe num briefing.',
    qu: 'Yuyaykuna diseño, sistemas ukumanta.',
    zh: '关于设计、系统以及一切不适合写在简报里的思考。',
  }

  const n = settings?.labels?.nav
  const b = settings?.labels?.blog
  const sectionLabel = lbl(n?.blog,  locale, tn('blog'))
  const sectionDesc  = lbl(settings?.labels?.home?.postsDesc, locale, POSTS_DESC_FALLBACK[locale] ?? POSTS_DESC_FALLBACK.en)
  const blogTitle    = lbl(b?.title, locale, tb('title'))
  const darkLabel    = DARK_LABEL[locale] ?? DARK_LABEL.en

  return (
    <section
      className="container section-inner"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
          <p className="text-label" style={{ margin: 0 }}>{sectionLabel}</p>
          <Link
            href={{ pathname: '/blog' }}
            className="link-accent"
            style={{ fontSize: 'var(--text-label)', color: 'var(--color-muted)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            <span className="n-slot">
              <span className="n-d">{darkLabel}</span>
              <span className="n-l">{blogTitle}</span>
            </span>
            {' →'}
          </Link>
        </div>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-muted)', margin: 0, maxWidth: '52ch', lineHeight: 1.6 }}>
          {sectionDesc}
        </p>
      </div>

      <div>
        {posts.map(post => (
          <PostCard key={post._id} post={post} locale={locale} />
        ))}
      </div>
    </section>
  )
}
