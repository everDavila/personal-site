'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { PlaygroundItem } from '@/sanity/queries/playground'
import type { Locale } from '@/lib/i18n'
import { localized } from '@/lib/i18n'

type StatusKey = 'en_proceso' | 'prototipo' | 'archivado' | 'fallido'

type Translations = {
  filter_all: string
  filter_label: string
  stats_label: string
  empty: string
  status: Record<StatusKey, string>
  category: Record<string, string>
}

type Props = {
  items: PlaygroundItem[]
  locale: Locale
  t: Translations
  categories: string[]
}

const STATUS_COLORS: Record<StatusKey, string> = {
  en_proceso:  'var(--color-accent)',
  prototipo:   'var(--color-text)',
  archivado:   'var(--color-muted)',
  fallido:     'var(--color-muted)',
}

const STATUS_COUNTS: StatusKey[] = ['en_proceso', 'prototipo', 'archivado', 'fallido']

function formatShortDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr.slice(0, 10) + 'T00:00:00')
  return d.toLocaleDateString(locale === 'en' ? 'en-GB' : 'es-PE', { day: '2-digit', month: 'short' })
    .replace('.', '')
}

const STATUS_ICONS: Record<StatusKey, string> = {
  en_proceso: '◌',
  prototipo:  '◻',
  archivado:  '◫',
  fallido:    '◪',
}

export function PlaygroundClient({ items, locale, t, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filtered = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory)

  const counts = STATUS_COUNTS.reduce((acc, s) => {
    acc[s] = items.filter(i => i.status === s).length
    return acc
  }, {} as Record<StatusKey, number>)

  return (
    <>
      {/* Stats */}
      <div style={{
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: 'var(--border-width) solid var(--color-border)',
      }}>
        <p className="text-label" style={{ marginBottom: '1.25rem' }}>{t.stats_label}</p>
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          flexWrap: 'wrap',
        }}>
          {STATUS_COUNTS.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: STATUS_COLORS[s],
                lineHeight: 1,
              }}>
                {counts[s]}
              </span>
              <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>
                {STATUS_ICONS[s]} {t.status[s]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p className="text-label" style={{ marginBottom: '1rem' }}>{t.filter_label}</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <FilterPill
            label={t.filter_all}
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {categories.map(cat => (
            <FilterPill
              key={cat}
              label={t.category[cat] ?? cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Lista editorial */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-body)' }}>{t.empty}</p>
      ) : (
        <div className="lab-list">
          {filtered.map(item => (
            <PlaygroundCard key={item._id} item={item} locale={locale} t={t} />
          ))}
        </div>
      )}
    </>
  )
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 'var(--text-small)',
        fontWeight: active ? 600 : 400,
        color: active ? 'var(--color-bg)' : 'var(--color-text)',
        background: active ? 'var(--color-text)' : 'transparent',
        border: 'var(--border-width) solid var(--color-border)',
        borderRadius: 'var(--radius)',
        padding: '0.4rem 1rem',
        cursor: 'pointer',
        transition: 'background var(--transition), color var(--transition)',
      }}
    >
      {label}
    </button>
  )
}

function PlaygroundCard({ item, locale, t }: { item: PlaygroundItem; locale: Locale; t: Translations }) {
  const title = localized(item.title, locale, 'es')
  const description = item.description ? localized(item.description, locale, 'es') : null
  const statusKey = item.status as StatusKey

  return (
    <Link
      href={{ pathname: '/playground/[slug]', params: { slug: item.slugs[locale === 'en' ? 'en' : 'es'] } }}
      className="lab-row"
    >
      {/* Imagen izquierda */}
      <div className="lab-row-image">
        {item.image?.asset?.url ? (
          <Image
            src={item.image.asset.url}
            alt={localized(item.image.alt ?? {}, locale).value ?? ''}
            width={240}
            height={160}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '1.5rem', opacity: 0.25 }}>◌</span>
        )}
      </div>

      {/* Contenido derecha */}
      <div className="lab-row-body">
        <div className="lab-row-meta">
          <span style={{ color: STATUS_COLORS[statusKey] }}>
            {STATUS_ICONS[statusKey]} {t.status[statusKey] ?? item.status}
          </span>
          <span style={{ color: 'var(--color-muted)' }}>
            {t.category[item.category] ?? item.category}
          </span>
          {item.lastEntryDate && (
            <span style={{
              fontFamily: 'ui-monospace,monospace',
              fontSize: '0.625rem',
              color: 'var(--color-muted)',
              opacity: 0.6,
              marginLeft: 'auto',
            }}>
              {formatShortDate(item.lastEntryDate, locale)}
            </span>
          )}
        </div>

        <h3 className="lab-row-title">{title.value || '—'}</h3>

        {description?.value && (
          <p className="lab-row-desc">{description.value}</p>
        )}

        {(item.repoUrl || item.demoUrl) && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
            {item.repoUrl && (
              <a
                href={item.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
                style={{ fontSize: 'var(--text-small)' }}
                onClick={e => e.stopPropagation()}
              >
                Repo ↗
              </a>
            )}
            {item.demoUrl && (
              <a
                href={item.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
                style={{ fontSize: 'var(--text-small)' }}
                onClick={e => e.stopPropagation()}
              >
                Demo ↗
              </a>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
