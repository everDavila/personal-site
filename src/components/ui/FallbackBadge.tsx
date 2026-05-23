import { LOCALE_NAMES, type Locale } from '@/lib/i18n'

type Props = { fallbackLocale: Locale }

export function FallbackBadge({ fallbackLocale }: Props) {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '0.7rem',
      fontWeight: 500,
      color: 'var(--color-muted)',
      border: 'var(--border-width) solid var(--color-border)',
      borderRadius: 'var(--radius)',
      padding: '0.15rem 0.5rem',
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    }}>
      {LOCALE_NAMES[fallbackLocale]}
    </span>
  )
}
