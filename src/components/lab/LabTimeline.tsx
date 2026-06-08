'use client'

import { useState, useEffect, useCallback } from 'react'
import type { LogEntry } from '@/sanity/queries/playground'
import type { Locale } from '@/lib/i18n'
import { useTranslations } from 'next-intl'
import { DimensionIcon, DIMENSION_MSG_KEY } from './DimensionIcon'

type LightboxImage = { src: string; caption: string }
type LightboxState = { open: boolean; images: LightboxImage[]; index: number }

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace('.', '')
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':')
  return `${h.padStart(2, '0')}:${(m ?? '00').padStart(2, '0')}`
}

function sortKey(e: LogEntry): string {
  return `${e.date ?? '0000-00-00'}T${e.time ?? '00:00'}`
}

export function LabTimeline({ entries, locale, totalLabel }: {
  entries: LogEntry[]
  locale: Locale
  totalLabel?: string
}) {
  const t = useTranslations('lab')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [sortOrder, setSortOrder]       = useState<'asc' | 'desc'>('asc')
  const [lb, setLb] = useState<LightboxState>({ open: false, images: [], index: 0 })

  // Unique tags sorted by first appearance (ascending)
  const tags = Array.from(
    new Map(
      [...entries]
        .sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
        .filter(e => e.tag)
        .map(e => [e.tag!.slug, { slug: e.tag!.slug, name: e.tag!.name[locale] ?? e.tag!.name.es ?? e.tag!.name.en ?? e.tag!.slug }])
    ).values()
  )

  const sorted = [...entries].sort((a, b) => {
    const cmp = sortKey(a).localeCompare(sortKey(b))
    return sortOrder === 'asc' ? cmp : -cmp
  })

  const filtered = activeFilter === 'all' ? sorted : sorted.filter(e => e.tag?.slug === activeFilter)

  // Lightbox keyboard nav
  useEffect(() => {
    if (!lb.open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setLb(p => ({ ...p, open: false }))
      if (e.key === 'ArrowLeft')  setLb(p => ({ ...p, index: Math.max(0, p.index - 1) }))
      if (e.key === 'ArrowRight') setLb(p => ({ ...p, index: Math.min(p.images.length - 1, p.index + 1) }))
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [lb.open])

  const openLightbox = useCallback((images: LogEntry['images'], startIndex: number) => {
    if (!images?.length) return
    setLb({
      open: true,
      index: startIndex,
      images: images.map(img => ({
        src:     img.asset.url,
        caption: img.caption?.[locale] ?? img.caption?.es ?? img.caption?.en ?? '',
      })),
    })
  }, [locale])

  const closeLightbox = () => setLb(p => ({ ...p, open: false }))

  return (
    <>
      {/* ── Header con contador, orden y filtro ── */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {/* Zona izquierda: número, título, orden */}
        <span className="lab-section-num">03</span>
        <h2 className="lab-section-title">{t('section_log')}</h2>
        <select
          className="lab-filter-select"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="asc">{t('sort_oldest')}</option>
          <option value="desc">{t('sort_newest')}</option>
        </select>
        <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '0.625rem', color: 'var(--color-muted)', opacity: 0.5, letterSpacing: '0.08em' }}>
          {totalLabel ?? t('entries', { count: entries.length })}
        </span>

        {/* Zona derecha: filtro por etiqueta */}
        {tags.length > 0 && (
          <select
            className="lab-filter-select"
            value={activeFilter}
            onChange={e => setActiveFilter(e.target.value)}
            style={{ marginLeft: 'auto' }}
          >
            <option value="all">{t('filter_all')}</option>
            {tags.map(tag => (
              <option key={tag.slug} value={tag.slug}>{tag.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── Timeline ── */}
      <div className="lab-timeline">
        {filtered.map(entry => {
          const desc     = entry.description?.[locale] ?? entry.description?.es ?? entry.description?.en ?? null
          const dimLabel = t(DIMENSION_MSG_KEY[entry.dimension] ?? 'dim_lightbulb')
          const tagName  = entry.tag?.name[locale] ?? entry.tag?.name.es ?? entry.tag?.name.en ?? null
          const colorKey = entry.tag?.colorKey ?? null
          const isHito   = entry.dimension === 'zap'

          return (
            <div
              key={entry._key}
              className={`lab-entry${isHito ? ' lab-entry--hito' : ''}`}
            >
              {/* Fecha */}
              <div className="lab-entry-date">
                <span className="lab-entry-date-text">
                  {entry.date ? formatDate(entry.date) : '—'}
                </span>
                {entry.time && (
                  <span className="lab-entry-time-text">
                    {formatTime(entry.time)}
                  </span>
                )}
              </div>

              {/* Línea vertical */}
              <div className="lab-entry-line">
                <div className={`lab-entry-dot${isHito ? ' lab-entry-dot--hito' : ''}`} />
              </div>

              {/* Contenido */}
              <div className="lab-entry-content">
                <div className="lab-entry-top">
                  <div className="lab-entry-dim">
                    <div className="lab-dim-icon">
                      <DimensionIcon dimension={entry.dimension} size={15} />
                    </div>
                    <span className="lab-entry-dim-label">{dimLabel}</span>
                  </div>
                  {tagName && colorKey && (
                    <span className={`lab-tag lab-tag--${colorKey}`}>{tagName}</span>
                  )}
                </div>

                {desc && (
                  <p className="lab-entry-desc">{desc}</p>
                )}

                {entry.images && entry.images.length > 0 && (
                  <div className="lab-img-links">
                    {entry.images.map((img, i) => {
                      const caption = img.caption?.[locale] ?? img.caption?.es ?? img.caption?.en ?? `Imagen ${i + 1}`
                      return (
                        <button
                          key={img._key}
                          className="lab-img-link"
                          onClick={() => openLightbox(entry.images, i)}
                        >
                          ↗ {caption}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Lightbox ── */}
      {lb.open && (
        <div className="lab-lightbox" onClick={closeLightbox}>
          <button className="lab-lightbox-close" onClick={closeLightbox}>✕</button>

          {lb.index > 0 && (
            <button className="lab-lightbox-nav lab-lightbox-prev" onClick={e => { e.stopPropagation(); setLb(p => ({ ...p, index: p.index - 1 })) }}>←</button>
          )}
          {lb.index < lb.images.length - 1 && (
            <button className="lab-lightbox-nav lab-lightbox-next" onClick={e => { e.stopPropagation(); setLb(p => ({ ...p, index: p.index + 1 })) }}>→</button>
          )}

          <div className="lab-lightbox-inner" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lb.images[lb.index].src}
              alt={lb.images[lb.index].caption}
              className="lab-lightbox-img"
            />
            {lb.images[lb.index].caption && (
              <p className="lab-lightbox-caption">{lb.images[lb.index].caption}</p>
            )}
            {lb.images.length > 1 && (
              <p className="lab-lightbox-counter">{lb.index + 1} / {lb.images.length}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
