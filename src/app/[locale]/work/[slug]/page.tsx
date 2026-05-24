import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjectSlugs } from '@/sanity/queries/projects'
import { PostBody } from '@/components/blog/PostBody'
import { localized } from '@/lib/i18n'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'
import type { PortableTextBlock } from '@portabletext/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map(slug => ({ slug }))
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [project, locale, t] = await Promise.all([
    getProjectBySlug(slug),
    getLocale(),
    getTranslations('work'),
  ])

  if (!project) notFound()

  const currentLocale = locale as Locale
  const title = localized(project.title, currentLocale)
  const role = localized(project.role, currentLocale)
  const summary = localized(project.summary, currentLocale)

  const locales: Locale[] = ['es', 'en', 'pt', 'qu', 'zh']
  const bodyBlocks = project.body as Record<Locale, PortableTextBlock[]>
  const bodyValue: PortableTextBlock[] | null =
    bodyBlocks?.[currentLocale] ??
    locales.map(l => bodyBlocks?.[l]).find(v => v?.length) ??
    null

  return (
    <main className="container section prose">
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
            fontSize: 'var(--text-section)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 0.5rem',
            lineHeight: 1.3,
          }}>
            {title.value || project.client}
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
          </div>
        </header>

        {bodyValue?.length ? (
          <PostBody value={bodyValue} />
        ) : (
          <p style={{ color: 'var(--color-muted)' }}>{t('no_content')}</p>
        )}
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
