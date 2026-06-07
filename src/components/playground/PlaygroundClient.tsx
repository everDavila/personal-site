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

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-body)' }}>{t.empty}</p>
      ) : (
        <div className="projects-grid">
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
      href={{ pathname: '/playground/[slug]', params: { slug: item.slug } }}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      className="card-hover"
    >
    <article style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      height: '100%',
    }}>
      {/* Image */}
      {item.image?.asset?.url ? (
        <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-border)' }}>
          <Image
            src={item.image.asset.url}
            alt={localized(item.image.alt ?? {}, locale).value ?? ''}
            width={600}
            height={450}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div style={{
          aspectRatio: '4/3',
          background: 'var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '2rem', opacity: 0.3 }}>◌</span>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
        {/* Status + category */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: 'var(--text-label)',
            fontWeight: 500,
            color: STATUS_COLORS[statusKey],
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-label)',
          }}>
            {t.status[statusKey] ?? item.status}
          </span>
          <span style={{
            fontSize: 'var(--text-label)',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-label)',
          }}>
            {t.category[item.category] ?? item.category}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 'var(--text-body)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: 0,
          lineHeight: 1.3,
        }}>
          {title.value || '—'}
        </h3>

        {/* Description */}
        {description?.value && (
          <p style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-muted)',
            lineHeight: 1.6,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {description.value}
          </p>
        )}

        {/* Links */}
        {(item.repoUrl || item.demoUrl) && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '0.75rem' }}>
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
    </article>
    </Link>
  )
}
