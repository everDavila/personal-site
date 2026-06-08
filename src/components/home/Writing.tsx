import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { PostSummary } from '@/sanity/queries/posts'
import type { Locale } from '@/lib/i18n'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { lbl } from '@/sanity/queries/siteSettings'
import { PostCard } from '@/components/blog/PostCard'

const CTA_LABEL: Record<string, { dark: string; light: string }> = {
  es: { dark: 'Ver todos los apuntes', light: 'Ver todos los apuntes' },
  en: { dark: 'See all logs',          light: 'See all notes'         },
  pt: { dark: 'Ver todos os registros',light: 'Ver todos os apuntes'  },
  qu: { dark: 'Llapan bitácora',       light: 'Llapan qillqa'         },
  zh: { dark: '查看所有日志',             light: '查看所有笔记'             },
}

const DARK_LABEL: Record<string, string> = {
  es: 'Apuntes', en: 'Logs', pt: 'Registros', qu: 'Bitácora', zh: '日志',
}

type Props = { posts: PostSummary[]; displayLocale?: Locale; settings?: SiteSettings | null }

export async function Writing({ posts, displayLocale, settings }: Props) {
  if (!posts.length) return null

  const locale = (displayLocale ?? await getLocale()) as Locale
  const tn = await getTranslations('nav')

  const POSTS_DESC_FALLBACK: Record<string, string> = {
    es: 'Reflexiones sobre diseño, sistemas y todo lo que no cabe en un brief.',
    en: 'Thoughts on design, systems, and everything that doesn\'t fit in a brief.',
    pt: 'Reflexões sobre design, sistemas e tudo o que não cabe num briefing.',
    qu: 'Yuyaykuna diseño, sistemas ukumanta.',
    zh: '关于设计、系统以及一切不适合写在简报里的思考。',
  }

  const n = settings?.labels?.nav
  const sectionLabel = lbl(n?.blog, locale, tn('blog'))
  const sectionDesc  = lbl(settings?.labels?.home?.postsDesc, locale, POSTS_DESC_FALLBACK[locale] ?? POSTS_DESC_FALLBACK.en)
  const darkLabel    = DARK_LABEL[locale] ?? DARK_LABEL.en
  const cta          = CTA_LABEL[locale]  ?? CTA_LABEL.en

  return (
    <section
      className="container section-inner"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div className="section-cols">

        {/* Sidebar izquierda */}
        <div className="section-cols-sidebar">
          <p className="text-label" style={{ margin: 0 }}>
            <span className="n-slot">
              <span className="n-d">{darkLabel}</span>
              <span className="n-l">{sectionLabel}</span>
            </span>
          </p>
          <div className="section-cols-rule" />
          <p className="section-cols-desc">{sectionDesc}</p>
          <Link href={{ pathname: '/blog' }} className="section-cols-cta link-accent">
            <span className="n-slot">
              <span className="n-d">{cta.dark}</span>
              <span className="n-l">{cta.light}</span>
            </span>
            {' →'}
          </Link>
        </div>

        {/* Lista de posts */}
        <div>
          {posts.map(post => (
            <PostCard key={post._id} post={post} locale={locale} />
          ))}
        </div>

      </div>
    </section>
  )
}
