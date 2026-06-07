import { notFound } from 'next/navigation'
import { getProjectBySlug } from '@/sanity/queries/projects'
import { PostBody } from '@/components/blog/PostBody'
import { FallbackBadge } from '@/components/ui/FallbackBadge'
import { localized, LOCALE_NAMES } from '@/lib/i18n'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'
import type { PortableTextBlock } from '@portabletext/types'

type Props = { params: Promise<{ slug: string; locale: string }> }


export default async function ProjectPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const [project, t] = await Promise.all([
    getProjectBySlug(slug),
    getTranslations('work'),
  ])

  if (!project) notFound()

  const currentLocale = locale as Locale
  const locales: Locale[] = ['es', 'en', 'pt', 'qu', 'zh']

  const title   = localized(project.title,   currentLocale, 'es')
  const role    = localized(project.role,    currentLocale, 'es')
  const summary = localized(project.summary, currentLocale, 'es')

  const availableLocales = locales.filter(l => l !== currentLocale && project.title?.[l])

  const bodyBlocks = project.body as Record<Locale, PortableTextBlock[]>
  const bodyValue: PortableTextBlock[] | null =
    bodyBlocks?.[currentLocale] ??
    bodyBlocks?.['es'] ??
    locales.map(l => bodyBlocks?.[l]).find(v => v?.length) ??
    null

  return (
    <main className="container section">
      <Link
        href={{ pathname: '/work' }}
        style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          marginBottom: '2rem',
        }}
      >
        ← {t('back')}
      </Link>

      <article>
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
            fontWeight: 400,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            color: 'var(--color-text)',
            margin: '0 0 0.5rem',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}>
            {title.value || project.client}
            {title.isFallback && title.fallbackLocale && (
              <FallbackBadge fallbackLocale={title.fallbackLocale} />
            )}
          </h1>

          {summary.value && (
            <p style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-muted)',
              lineHeight: 1.6,
              margin: '0.75rem 0 0',
            }}>
              {summary.value}
            </p>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(10rem, 100%), 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: 'var(--border-width) solid var(--color-border)',
          }}>
            <MetaItem label={t('client_label')} value={project.client} />
            {role.value && <MetaItem label={t('role_label')} value={role.value} />}
            {project.year && <MetaItem label={t('year_label')} value={String(project.year)} />}
            {availableLocales.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {availableLocales.map(l => (
                  <Link
                    key={l}
                    href={{ pathname: '/work/[slug]', params: { slug: project.slug } }}
                    locale={l}
                    style={{
                      fontSize: 'var(--text-label)',
                      color: 'var(--color-muted)',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      transition: 'color var(--transition)',
                    }}
                    className="link-accent"
                  >
                    {LOCALE_NAMES[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="prose">
          {bodyValue?.length ? (
            <PostBody value={bodyValue} />
          ) : (
            <p style={{ color: 'var(--color-muted)' }}>{t('no_content')}</p>
          )}
        </div>
      </article>
    </main>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-muted)' }}>
        {label}
      </span>
      <span style={{ fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>
        {value}
      </span>
    </div>
  )
}
