import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

type Props = { dark: string; light: string }

export async function Philosophy({ dark, light }: Props) {
  const t = await getTranslations('home')

  function Paragraphs({ text, className }: { text: string; className: string }) {
    const paras = text.split(/\n\n+/).filter(Boolean)
    return (
      <div className={className}>
        {paras.map((para, i) => (
          <p
            key={i}
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              lineHeight: 1.55,
              color: 'var(--color-text)',
              margin: i < paras.length - 1 ? '0 0 1.25rem' : '0',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            {para}
          </p>
        ))}
      </div>
    )
  }

  return (
    <section
      className="container section-inner"
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
          <Paragraphs text={dark}  className="n-d" />
          <Paragraphs text={light} className="n-l" />
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
