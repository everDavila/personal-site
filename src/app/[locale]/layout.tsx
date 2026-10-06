import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav/Nav'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings, resolveSeo } from '@/sanity/queries/siteSettings'

import { pageMetadata, ogImageUrl } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params
  const settings   = await getSiteSettings()
  const ogUrl      = ogImageUrl(settings?.ogImage?.asset?.url)

  const { title, description } = resolveSeo(settings?.seoHome, locale as 'es' | 'en' | 'pt' | 'qu' | 'zh', {
    title:       'Ever Davila',
    description: 'Diseñador UI/UX y consultor de gobierno. Sistemas digitales para el sector público peruano.',
  })
  // Valores de la home; cada página interna sobrescribe con su propio pageMetadata()
  return pageMetadata({ locale: locale as Locale, href: '/', title, description, image: ogUrl })
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

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Nav />
      <main style={{ flex: 1, paddingTop: '3.5rem' }}>
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  )
}
