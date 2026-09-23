'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { LogEntry } from '@/sanity/queries/playground'
import type { Locale } from '@/lib/i18n'
import { useTranslations } from 'next-intl'
import { DimensionIcon } from './DimensionIcon'

type LightboxItem = { src: string; caption: string; isVideo: boolean; mimeType: string | null }
type LightboxState = { open: boolean; items: LightboxItem[]; index: number }

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

export function LabTimeline({ entries, locale, totalLabel, defaultOrder = 'asc' }: {
  entries: LogEntry[]
  locale: Locale
  totalLabel?: string
  defaultOrder?: 'asc' | 'desc'
}) {
  const t = useTranslations('lab')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [sortOrder, setSortOrder]       = useState<'asc' | 'desc'>(defaultOrder)
  const [lb, setLb] = useState<LightboxState>({ open: false, items: [], index: 0 })

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

  const dialogRef  = useRef<HTMLDivElement>(null)
  const closeRef   = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Lightbox: keyboard nav, focus trap, restore focus on close
  useEffect(() => {
    if (!lb.open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     setLb(p => ({ ...p, open: false }))
      if (e.key === 'ArrowLeft')  setLb(p => ({ ...p, index: Math.max(0, p.index - 1) }))
      if (e.key === 'ArrowRight') setLb(p => ({ ...p, index: Math.min(p.items.length - 1, p.index + 1) }))
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, video[controls]')
        if (!focusables.length) return
        const first = focusables[0]
        const last  = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    window.addEventListener('keydown', handler)
    const trigger = triggerRef.current
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
      trigger?.focus()
    }
  }, [lb.open])

  const openLightbox = useCallback((images: LogEntry['images'], startIndex: number) => {
    if (!images?.length) return
    triggerRef.current = document.activeElement as HTMLElement | null
    setLb({
      open: true,
      index: startIndex,
      items: images.map(img => ({
        src:      img.asset.url,
        caption:  img.caption?.[locale] ?? img.caption?.es ?? img.caption?.en ?? '',
        isVideo:  img._type === 'file',
        mimeType: img.asset.mimeType,
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
          aria-label={t('sort_label')}
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="asc">{t('sort_oldest')}</option>
          <option value="desc">{t('sort_newest')}</option>
        </select>
        <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '0.625rem', color: 'var(--color-muted)', opacity: 0.5, letterSpacing: '0.08em' }}>
          {totalLabel ?? t('entries', { count: entries.length })}
        </span>

        {/* Zona derecha: filtro por tipo de momento (tag) */}
        {tags.length > 0 && (
          <select
            className="lab-filter-select"
            aria-label={t('filter_tag_label')}
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
          const dimLabel = entry.dimension?.name[locale] ?? entry.dimension?.name.es ?? entry.dimension?.name.en ?? ''
          const tagName  = entry.tag?.name[locale] ?? entry.tag?.name.es ?? entry.tag?.name.en ?? null
          const colorKey = entry.tag?.colorKey ?? null
          const isHito   = entry.tag?.slug === 'hito'

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
                      <DimensionIcon icon={entry.dimension?.icon ?? 'lightbulb'} size={15} />
                    </div>
                    <span className="lab-entry-dim-label">{dimLabel}</span>
                  </div>
                  {tagName && colorKey && (
                    <span className={`lab-tag lab-tag--${colorKey}`}>{tagName}</span>
                  )}
                </div>

                {desc && (
                  <div className="lab-entry-desc">
                    {desc.split(/\n{2,}/).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}

                {entry.images && entry.images.length > 0 && (
                  <div className="lab-img-links">
                    {entry.images.map((img, i) => {
                      const isVideo = img._type === 'file'
                      const caption = img.caption?.[locale] ?? img.caption?.es ?? img.caption?.en ?? `${isVideo ? t('media_video') : t('media_image')} ${i + 1}`
                      return (
                        <button
                          key={img._key}
                          className="lab-img-link"
                          onClick={() => openLightbox(entry.images, i)}
                        >
                          {isVideo ? '▶' : '↗'} {caption}
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
        <div
          ref={dialogRef}
          className="lab-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t('lightbox_label')}
          onClick={closeLightbox}
        >
          <button ref={closeRef} className="lab-lightbox-close" aria-label={t('lightbox_close')} onClick={closeLightbox}>✕</button>

          {lb.index > 0 && (
            <button className="lab-lightbox-nav lab-lightbox-prev" aria-label={t('lightbox_prev')} onClick={e => { e.stopPropagation(); setLb(p => ({ ...p, index: p.index - 1 })) }}>←</button>
          )}
          {lb.index < lb.items.length - 1 && (
            <button className="lab-lightbox-nav lab-lightbox-next" aria-label={t('lightbox_next')} onClick={e => { e.stopPropagation(); setLb(p => ({ ...p, index: p.index + 1 })) }}>→</button>
          )}

          <div className="lab-lightbox-inner" onClick={e => e.stopPropagation()}>
            {lb.items[lb.index].isVideo ? (
              <video
                key={lb.items[lb.index].src}
                className="lab-lightbox-img"
                controls
                playsInline
              >
                <source src={lb.items[lb.index].src} type={lb.items[lb.index].mimeType ?? undefined} />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lb.items[lb.index].src}
                alt={lb.items[lb.index].caption || `${t('media_image')} ${lb.index + 1}`}
                className="lab-lightbox-img"
              />
            )}
            {lb.items[lb.index].caption && (
              <p className="lab-lightbox-caption">{lb.items[lb.index].caption}</p>
            )}
            {lb.items.length > 1 && (
              <p className="lab-lightbox-counter">{lb.index + 1} / {lb.items.length}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
