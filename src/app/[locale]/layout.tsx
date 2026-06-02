import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav/Nav'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings } from '@/sanity/queries/siteSettings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const ogUrl = settings?.ogImage?.asset?.url ?? null

  const title       = 'Ever Davila'
  const description = 'Diseñador UI/UX y consultor de gobierno. Sistemas digitales para el sector público peruano.'
  const images      = ogUrl ? [{ url: ogUrl, width: 1200, height: 630, alt: title }] : []

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url:      'https://davila.uno',
      siteName: 'Ever Davila',
      type:     'website',
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
