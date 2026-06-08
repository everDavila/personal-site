'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { LogEntry } from '@/sanity/queries/playground'
import type { Locale } from '@/lib/i18n'
import { DimensionIcon, DIMENSION_LABELS } from './DimensionIcon'

type LightboxImage = { src: string; caption: string }
type LightboxState = { open: boolean; images: LightboxImage[]; index: number }

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace('.', '')
}

export function LabTimeline({ entries, locale, totalLabel }: {
  entries: LogEntry[]
  locale: Locale
  totalLabel?: string
}) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [panelOpen, setPanelOpen]       = useState(false)
  const [lb, setLb] = useState<LightboxState>({ open: false, images: [], index: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  // Unique tags from entries
  const tags = Array.from(
    new Map(
      entries
        .filter(e => e.tag)
        .map(e => [e.tag!.slug, { slug: e.tag!.slug, name: e.tag!.name[locale] ?? e.tag!.name.es ?? e.tag!.slug }])
    ).values()
  )

  const filtered = activeFilter ? entries.filter(e => e.tag?.slug === activeFilter) : entries

  // Close panel on outside click
  useEffect(() => {
    if (!panelOpen) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [panelOpen])

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
        caption: img.caption?.[locale] ?? img.caption?.es ?? '',
      })),
    })
  }, [locale])

  const closeLightbox = () => setLb(p => ({ ...p, open: false }))

  const activeTag = tags.find(t => t.slug === activeFilter)

  return (
    <>
      {/* ── Header con contador y filtro ── */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <span className="lab-section-num">03</span>
        <h2 className="lab-section-title">Bitácora</h2>
        <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '0.625rem', color: 'var(--color-muted)', opacity: 0.5, letterSpacing: '0.08em' }}>
          {totalLabel ?? `${entries.length} entradas`}
        </span>
        <div ref={panelRef} style={{ marginLeft: 'auto', position: 'relative' }}>
          <button
            className={`lab-filter-btn${activeFilter ? ' active' : ''}`}
            onClick={() => setPanelOpen(p => !p)}
          >
            {activeFilter ? `${activeTag?.name} ✕` : 'Filtrar ▾'}
          </button>
          {panelOpen && (
            <div className="lab-filter-panel">
              <button
                className={`lab-filter-pill${!activeFilter ? ' selected' : ''}`}
                onClick={() => { setActiveFilter(null); setPanelOpen(false) }}
              >
                Todas
              </button>
              {tags.map(tag => (
                <button
                  key={tag.slug}
                  className={`lab-filter-pill${activeFilter === tag.slug ? ' selected' : ''}`}
                  onClick={() => { setActiveFilter(tag.slug); setPanelOpen(false) }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="lab-timeline">
        {filtered.map(entry => {
          const desc   = entry.description?.[locale] ?? entry.description?.es ?? null
          const dimLabel = DIMENSION_LABELS[entry.dimension] ?? entry.dimension
          const tagName  = entry.tag?.name[locale] ?? entry.tag?.name.es ?? null
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
                      const caption = img.caption?.[locale] ?? img.caption?.es ?? `Imagen ${i + 1}`
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
