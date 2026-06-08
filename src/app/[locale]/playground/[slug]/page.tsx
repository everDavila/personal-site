import { notFound } from 'next/navigation'
import { getPlaygroundItemBySlug } from '@/sanity/queries/playground'
import { PostBody } from '@/components/blog/PostBody'
import { FallbackBadge } from '@/components/ui/FallbackBadge'
import { localized, LOCALE_NAMES } from '@/lib/i18n'
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
    getPlaygroundItemBySlug(slug, locale as Locale),
    getTranslations('playground'),
  ])

  if (!item) notFound()

  const currentLocale = locale as Locale
  const locales: Locale[] = ['es', 'en', 'pt', 'qu', 'zh']

  const title       = localized(item.title,       currentLocale, 'es')
  const description = item.description ? localized(item.description, currentLocale, 'es') : null

  const availableLocales = locales.filter(l => l !== currentLocale && item.title?.[l])

  const bodyBlocks = item.body as Record<Locale, PortableTextBlock[]> | null
  const bodyValue: PortableTextBlock[] | null = bodyBlocks
    ? (bodyBlocks[currentLocale] ?? bodyBlocks['es'] ?? locales.map(l => bodyBlocks[l]).find(v => v?.length) ?? null)
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
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}>
            {title.value || '—'}
            {title.isFallback && title.fallbackLocale && (
              <FallbackBadge fallbackLocale={title.fallbackLocale} />
            )}
          </h1>

          {/* Language switcher */}
          {availableLocales.length > 0 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {availableLocales.map(l => (
                <Link
                  key={l}
                  href={{ pathname: '/playground/[slug]', params: { slug: item.slugs[l === 'en' ? 'en' : 'es'] } }}
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
