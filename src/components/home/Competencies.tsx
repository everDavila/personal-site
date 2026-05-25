import { getLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import type { Competency } from '@/sanity/queries/siteSettings'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { lbl } from '@/sanity/queries/siteSettings'

type Props = { competencies: Competency[]; settings?: SiteSettings | null }

export async function Competencies({ competencies, settings }: Props) {
  const locale = await getLocale() as 'es' | 'en' | 'pt' | 'qu' | 'zh'
  const t = await getTranslations('home')

  if (!competencies?.length) return null

  const h = settings?.labels?.home
  const sectionLabel = lbl(h?.competenciesLabel, locale, t('competencies_label'))

  return (
    <section className="container section" style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}>
      <p className="text-label" style={{ marginBottom: '2.5rem' }}>{sectionLabel}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(18rem, 100%), 1fr))', gap: '2.5rem' }}>
        {competencies.map((c, i) => (
          <div key={i}>
            <h3 style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              {c.title?.[locale]}
            </h3>
            <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', lineHeight: 'var(--leading-body)' }}>
              {c.description?.[locale]}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
