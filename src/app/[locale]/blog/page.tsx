import type { Metadata } from 'next'
import { getAllPosts } from '@/sanity/queries/posts'
import { PostCard } from '@/components/blog/PostCard'
import { getTranslations, getLocale } from 'next-intl/server'
import type { Locale } from '@/lib/i18n'
import { BLOG_FALLBACK } from '@/lib/i18n'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { getMode } from '@/lib/mode'
import { getSiteSettings, lbl, narrativeText, NARRATIVE_FALLBACK, resolveSeo } from '@/sanity/queries/siteSettings'
import { PageHeader } from '@/components/ui/PageHeader'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings()
  const { title, description } = resolveSeo(settings?.seoPages?.blog, locale as Locale, {
    title: 'Apuntes — Ever Davila',
    description: 'Notas sobre diseño, sistemas complejos y tecnología.',
  })
  return { title, description, openGraph: { title, description }, twitter: { title, description } }
}

export const dynamic = 'force-dynamic'

const COUNT_LABEL: Record<Locale, (n: number) => string> = {
  es: (n) => `${n} nota${n !== 1 ? 's' : ''}`,
  en: (n) => `${n} note${n !== 1 ? 's' : ''}`,
  pt: (n) => `${n} nota${n !== 1 ? 's' : ''}`,
  qu: (n) => `${n} willakuy`,
  zh: (n) => `${n} 篇`,
}

export default async function BlogPage() {
  const locale = await getLocale() as Locale
  const mode   = await getMode()
  const [t, subtitle, settings] = await Promise.all([
    getTranslations('blog'),
    getPageSubtitle('blog', locale, mode),
    getSiteSettings(),
  ])

  const n          = settings?.labels?.nav
  const b          = settings?.labels?.blog
  const titleDark  = narrativeText(settings?.pageTitles?.blog, 'dark',  locale, NARRATIVE_FALLBACK.dark.pageTitles.blog)  ?? lbl(n?.blog, locale, t('title'))
  const titleLight = narrativeText(settings?.pageTitles?.blog, 'light', locale, NARRATIVE_FALLBACK.light.pageTitles.blog) ?? titleDark
  const emptyMsg   = lbl(b?.empty, locale, t('empty'))

  const imageSet = {
    dark:  settings?.pageImages?.blog?.dark?.asset?.url  ?? null,
    light: settings?.pageImages?.blog?.light?.asset?.url ?? null,
  }

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
    <main className="container section-page">

      {/* ── Editorial header ── */}
      <PageHeader imageSet={imageSet}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '0.5rem',
        }}>
          <h1 className="n-slot page-title" style={{ margin: 0 }}>
            <span className="n-d">{titleDark}</span>
            <span className="n-l">{titleLight}</span>
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

      {/* ── Featured post ── */}
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
