'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const LOCALE_LABELS: Record<string, string> = {
  es: 'ES',
  en: 'EN',
  pt: 'PT',
  qu: 'QU',
  zh: '中',
}

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.replace(pathname, { locale: e.target.value })
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      aria-label="Cambiar idioma"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-muted)',
        fontSize: 'var(--text-small)',
        fontFamily: 'var(--font-sans)',
        padding: '0.25rem',
        transition: 'color var(--transition)',
        outline: 'none',
        appearance: 'none',
      }}
    >
      {routing.locales.map((loc) => (
        <option
          key={loc}
          value={loc}
          style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
          {LOCALE_LABELS[loc]}
        </option>
      ))}
    </select>
  )
}
