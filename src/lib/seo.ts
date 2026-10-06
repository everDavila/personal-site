import type { Metadata } from 'next'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/lib/i18n'

export const BASE_URL = 'https://davila.uno'
const SITE_NAME = 'Ever Davila'

type Href = Parameters<typeof getPathname>[0]['href']

/** URL absoluta y localizada: ('es', '/work') → https://davila.uno/es/trabajo */
export function localeUrl(locale: Locale, href: Href): string {
  return BASE_URL + getPathname({ locale, href })
}

/**
 * canonical = la propia página en su idioma; languages = sus equivalentes en cada locale.
 * `href` puede variar por locale (posts con slug traducido).
 */
export function alternatesFor(locale: Locale, href: Href | ((l: Locale) => Href)) {
  const hrefFor = typeof href === 'function' ? href : () => href
  const languages = Object.fromEntries(
    routing.locales.map(l => [l, localeUrl(l, hrefFor(l))])
  ) as Record<Locale, string>
  return {
    canonical: languages[locale],
    languages: { ...languages, 'x-default': languages[routing.defaultLocale] },
  }
}

/** Recorte 1200×630 en JPG: WhatsApp y otros ignoran imágenes pesadas (>~300 KB) */
export function ogImageUrl(sanityUrl: string | null | undefined): string | null {
  return sanityUrl ? `${sanityUrl}?w=1200&h=630&fit=crop&fm=jpg&q=80` : null
}

type PageMetaInput = {
  locale:         Locale
  href:           Href | ((l: Locale) => Href)
  title:          string
  description?:   string
  image?:         string | null
  publishedTime?: string
}

/** Metadata completa por página: canonical, hreflang, Open Graph y Twitter */
export function pageMetadata({ locale, href, title, description, image, publishedTime }: PageMetaInput): Metadata {
  const alternates = alternatesFor(locale, href)
  const images     = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined
  const og = { title, description, url: alternates.canonical, siteName: SITE_NAME, locale, images }

  return {
    title,
    description,
    alternates,
    openGraph: publishedTime
      ? { ...og, type: 'article', publishedTime }
      : { ...og, type: 'website' },
    twitter: {
      card:   images ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
