import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav/Nav'
import { Footer } from '@/components/layout/Footer'
import { ModeChooser } from '@/components/ui/ModeChooser'
import { getSiteSettings, resolveSeo } from '@/sanity/queries/siteSettings'

const BASE = 'https://davila.uno'

// Localized home URLs for hreflang — mirrors routing.ts
const LOCALE_URLS: Record<string, string> = {
  es: `${BASE}/es`,
  en: `${BASE}/en`,
  pt: `${BASE}/pt`,
  qu: `${BASE}/qu`,
  zh: `${BASE}/zh`,
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const settings   = await getSiteSettings()
  const ogUrl      = settings?.ogImage?.asset?.url ?? null

  const { title, description } = resolveSeo(settings?.seoHome, locale as 'es' | 'en' | 'pt' | 'qu' | 'zh', {
    title:       'Ever Davila',
    description: 'Diseñador UI/UX y consultor de gobierno. Sistemas digitales para el sector público peruano.',
  })
  const images = ogUrl ? [{ url: ogUrl, width: 1200, height: 630, alt: title }] : []
  const canonical   = LOCALE_URLS[locale] ?? `${BASE}/${locale}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: LOCALE_URLS,
    },
    openGraph: {
      title,
      description,
      url:      canonical,
      siteName: 'Ever Davila',
      type:     'website',
      locale:   locale,
      ...(images.length ? { images } : {}),
    },
    twitter: {
      card:  images.length ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(images.length ? { images: [ogUrl!] } : {}),
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'es' | 'en' | 'pt' | 'qu' | 'zh')) {
    notFound()
  }

  setRequestLocale(locale)

  const [messages, t, jar] = await Promise.all([
    getMessages(),
    getTranslations('modeChooser'),
    cookies(),
  ])

  const hasMode = !!jar.get('narrative-mode')?.value

  return (
    <NextIntlClientProvider messages={messages}>
      <ModeChooser
        hasMode={hasMode}
        question={t('question')}
        darkLabel={t('darkLabel')}
        darkDesc={t('darkDesc')}
        lightLabel={t('lightLabel')}
        lightDesc={t('lightDesc')}
        footer={t('footer')}
      />
      <Nav />
      <main style={{ flex: 1, paddingTop: '3.5rem' }}>
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  )
}
