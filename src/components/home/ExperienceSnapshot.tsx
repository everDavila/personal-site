import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { WorkEntry } from '@/sanity/queries/experience'
import type { Locale } from '@/lib/i18n'

type Props = { entries: WorkEntry[] }

export async function ExperienceSnapshot({ entries }: Props) {
  if (!entries.length) return null

  const locale = await getLocale() as Locale
  const t = await getTranslations('experience')

  const recent = entries.slice(0, 3)

  return (
    <section
      className="container section"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '2rem',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <p className="text-label" style={{ margin: 0 }}>{t('work_label')}</p>
        <Link
          href={{ pathname: '/experience' }}
          className="link-accent"
          style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-muted)',
            textDecoration: 'none',
          }}
        >
          {t('title')} →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {recent.map((entry, i) => {
          const role = entry.role?.[locale] || entry.role?.es || entry.role?.en || ''

          return (
            <div
              key={entry._key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '1rem',
                paddingBlock: '1rem',
                borderBottom: i < recent.length - 1
                  ? 'var(--border-width) solid var(--color-border)'
                  : 'none',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 500, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>
                  {role}
                </span>
                <span style={{ color: 'var(--color-border)' }}>·</span>
                <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>
                  {entry.company}
                </span>
              </div>
              <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                {entry.period}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
