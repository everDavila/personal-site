import { getTranslations, getLocale } from 'next-intl/server'
import { getAllPlaygroundItems } from '@/sanity/queries/playground'
import { PlaygroundClient } from '@/components/playground/PlaygroundClient'
import type { Locale } from '@/lib/i18n'
import { getPageSubtitle } from '@/sanity/queries/editorialSubtitle'
import { getSiteSettings, lbl, pageImage } from '@/sanity/queries/siteSettings'
import { getMode } from '@/lib/mode'
import { PageHeader } from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['interfaces', 'motion', 'systems', 'ai', 'experiments', 'tools']

export default async function PlaygroundPage() {
  const [locale, mode] = await Promise.all([
    getLocale() as Promise<Locale>,
    getMode(),
  ])
  const [t, items, subtitle, settings] = await Promise.all([
    getTranslations('playground'),
    getAllPlaygroundItems(),
    getPageSubtitle('playground', locale),
    getSiteSettings(),
  ])

  const pg     = settings?.labels?.playground
  const title  = lbl(pg?.title, locale, t('title'))
  const imgUrl = pageImage(settings?.pageImages?.playground, mode)

  const translations = {
    filter_all:   lbl(pg?.filterAll,   locale, t('filter_all')),
    filter_label: lbl(pg?.filterLabel, locale, t('filter_label')),
    stats_label:  lbl(pg?.statsLabel,  locale, t('stats_label')),
    empty:        lbl(pg?.empty,       locale, t('empty')),
    status: {
      en_proceso: t('status.en_proceso'),
      prototipo:  t('status.prototipo'),
      archivado:  t('status.archivado'),
      fallido:    t('status.fallido'),
    },
    category: Object.fromEntries(CATEGORIES.map(c => [c, t(`category.${c}`)])),
  }

  const activeCategories = CATEGORIES.filter(c => items.some(i => i.category === c))

  return (
    <main className="container section">
      <PageHeader imageUrl={imgUrl}>
        <h1 style={{
          fontSize: 'var(--text-section)',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '0.25rem',
        }}>
          {title}
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
      </PageHeader>

      <PlaygroundClient
        items={items}
        locale={locale}
        t={translations}
        categories={activeCategories}
      />
    </main>
  )
}
