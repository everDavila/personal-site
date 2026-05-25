import { getTranslations, getLocale } from 'next-intl/server'
import { getAllPlaygroundItems } from '@/sanity/queries/playground'
import { PlaygroundClient } from '@/components/playground/PlaygroundClient'
import type { Locale } from '@/lib/i18n'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['interfaces', 'motion', 'systems', 'ai', 'experiments', 'tools']

export default async function PlaygroundPage() {
  const locale = await getLocale() as Locale
  const [t, items, subtitle] = await Promise.all([
    getTranslations('playground'),
    getAllPlaygroundItems(),
    getPageSubtitle('playground', locale),
  ])

  const currentLocale = locale

  const translations = {
    filter_all:  t('filter_all'),
    filter_label: t('filter_label'),
    stats_label: t('stats_label'),
    empty:       t('empty'),
    status: {
      en_proceso: t('status.en_proceso'),
      prototipo:  t('status.prototipo'),
      archivado:  t('status.archivado'),
      fallido:    t('status.fallido'),
    },
    category: Object.fromEntries(
      CATEGORIES.map(c => [c, t(`category.${c}`)])
    ),
  }

  // Only show categories that have at least one item
  const activeCategories = CATEGORIES.filter(c => items.some(i => i.category === c))

  return (
    <main className="container section">
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '0.25rem',
      }}>
        {t('title')}
      </h1>
      {subtitle && (
        <p style={{
          fontSize: 'var(--text-small)',
          color: 'var(--color-muted)',
          marginBottom: '3rem',
          maxWidth: '52ch',
          lineHeight: 1.6,
        }}>
          {subtitle}
        </p>
      )}

      <PlaygroundClient
        items={items}
        locale={currentLocale}
        t={translations}
        categories={activeCategories}
      />
    </main>
  )
}
