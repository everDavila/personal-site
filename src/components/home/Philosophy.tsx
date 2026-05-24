import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

type Props = { text: string }

export async function Philosophy({ text }: Props) {
  const t = await getTranslations('home')

  // Split on blank lines for multiple editorial paragraphs
  const paragraphs = text.split(/\n\n+/).filter(Boolean)

  return (
    <section
      className="container section"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <p className="text-label" style={{ marginBottom: '2rem' }}>{t('philosophy_label')}</p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '3rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: '1 1 32ch' }}>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                lineHeight: 1.55,
                color: 'var(--color-text)',
                margin: i < paragraphs.length - 1 ? '0 0 1.25rem' : '0',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              {para}
            </p>
          ))}
        </div>

        <div style={{ paddingTop: '0.25rem', flexShrink: 0 }}>
          <Link
            href={{ pathname: '/about' }}
            className="link-accent"
            style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-muted)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {t('more_about')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
