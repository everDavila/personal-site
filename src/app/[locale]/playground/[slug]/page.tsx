import { notFound } from 'next/navigation'
import { getPlaygroundItemBySlug } from '@/sanity/queries/playground'
import { PostBody } from '@/components/blog/PostBody'
import { localized } from '@/lib/i18n'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n'
import type { PortableTextBlock } from '@portabletext/types'

type Props = { params: Promise<{ slug: string; locale: string }> }

const STATUS_COLORS: Record<string, string> = {
  en_proceso: 'var(--color-accent)',
  prototipo:  'var(--color-text)',
  archivado:  'var(--color-muted)',
  fallido:    'var(--color-muted)',
}


export default async function PlaygroundItemPage({ params }: Props) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const [item, t] = await Promise.all([
    getPlaygroundItemBySlug(slug),
    getTranslations('playground'),
  ])

  if (!item) notFound()

  const currentLocale = locale as Locale
  const locales: Locale[] = ['es', 'en', 'pt', 'qu', 'zh']

  const title       = localized(item.title, currentLocale)
  const description = item.description ? localized(item.description, currentLocale) : null

  const bodyBlocks = item.body as Record<Locale, PortableTextBlock[]> | null
  const bodyValue: PortableTextBlock[] | null = bodyBlocks
    ? (bodyBlocks[currentLocale] ?? locales.map(l => bodyBlocks[l]).find(v => v?.length) ?? null)
    : null

  return (
    <main className="container section prose">
      <Link
        href={{ pathname: '/playground' }}
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
        ← {t('title')}
      </Link>

      <article>
        <header style={{ marginBottom: '2.5rem' }}>
          {/* Category + Status */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontSize: 'var(--text-label)',
              fontWeight: 500,
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
            }}>
              {t(`category.${item.category}`)}
            </span>
            <span style={{ color: 'var(--color-border)' }}>·</span>
            <span style={{
              fontSize: 'var(--text-label)',
              fontWeight: 500,
              color: STATUS_COLORS[item.status] ?? 'var(--color-muted)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
            }}>
              {t(`status.${item.status}`)}
            </span>
            <span style={{ color: 'var(--color-border)' }}>·</span>
            <span style={{
              fontSize: 'var(--text-label)',
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
            }}>
              {item.year}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'var(--text-section)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: '0 0 0.75rem',
            lineHeight: 1.3,
          }}>
            {title.value || '—'}
          </h1>

          {/* Description */}
          {description?.value && (
            <p style={{
              fontSize: 'var(--text-body)',
              color: 'var(--color-muted)',
              lineHeight: 1.6,
              margin: '0 0 1.5rem',
              maxWidth: '52ch',
            }}>
              {description.value}
            </p>
          )}

          {/* Links */}
          {(item.repoUrl || item.demoUrl) && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              paddingTop: '1.25rem',
              borderTop: 'var(--border-width) solid var(--color-border)',
            }}>
              {item.repoUrl && (
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent"
                  style={{ fontSize: 'var(--text-small)', fontWeight: 500 }}
                >
                  Repositorio ↗
                </a>
              )}
              {item.demoUrl && (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent"
                  style={{ fontSize: 'var(--text-small)', fontWeight: 500 }}
                >
                  Demo ↗
                </a>
              )}
            </div>
          )}
        </header>

        {/* Main image */}
        {item.image?.asset?.url && (
          <div style={{
            marginBottom: '2.5rem',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            background: 'var(--color-surface)',
          }}>
            <Image
              src={item.image.asset.url}
              alt={localized(item.image.alt ?? {}, currentLocale).value ?? ''}
              width={1200}
              height={900}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        {/* Body */}
        {bodyValue?.length ? (
          <PostBody value={bodyValue} />
        ) : (
          <p style={{ color: 'var(--color-muted)' }}>{t('empty')}</p>
        )}
      </article>
    </main>
  )
}
