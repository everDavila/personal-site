export type Locale = 'es' | 'en' | 'pt' | 'qu' | 'zh'

type LocalizedContent = Partial<Record<Locale, string>>

/**
 * Devuelve el contenido en el locale actual.
 * Si no existe, cae al idioma original del documento.
 * Si tampoco existe, busca cualquier idioma disponible.
 */
export function localized(
  content: LocalizedContent | null | undefined,
  locale: Locale,
  originalLanguage: Locale = 'es'
): { value: string; isFallback: boolean; fallbackLocale: Locale | null } {
  if (!content) return { value: '', isFallback: false, fallbackLocale: null }

  if (content[locale]) {
    return { value: content[locale]!, isFallback: false, fallbackLocale: null }
  }

  if (content[originalLanguage]) {
    return { value: content[originalLanguage]!, isFallback: true, fallbackLocale: originalLanguage }
  }

  const availableLocale = (['es', 'en', 'pt', 'qu', 'zh'] as Locale[]).find(l => content[l])
  if (availableLocale) {
    return { value: content[availableLocale]!, isFallback: true, fallbackLocale: availableLocale }
  }

  return { value: '', isFallback: false, fallbackLocale: null }
}

/** Locale to use when the current locale has no posts. Quechua falls back to Spanish. */
export const BLOG_FALLBACK: Record<Locale, Locale> = {
  es: 'es',
  en: 'en',
  pt: 'pt',
  qu: 'es',
  zh: 'en',
}

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
  qu: 'Quechua',
  zh: '中文',
}
