import type { Metadata } from 'next'
import { Inter, Manrope, Source_Serif_4 } from 'next/font/google'
import { cookies } from 'next/headers'
import { ModeChooser } from '@/components/ui/ModeChooser'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
})

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ever Davila',
  description: 'Diseñador UI/UX y consultor de gobierno. Sistemas digitales para el sector público peruano.',
  openGraph: {
    title:       'Ever Davila',
    description: 'Diseñador UI/UX y consultor de gobierno. Sistemas digitales para el sector público peruano.',
    url:         'https://davila.uno',
    siteName:    'Ever Davila',
    images: [{ url: 'https://davila.uno/og-home.png', width: 1200, height: 630, alt: 'Ever Davila' }],
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Ever Davila',
    description: 'Diseñador UI/UX y consultor de gobierno.',
    images:      ['https://davila.uno/og-home.png'],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies()
  const cookieVal = jar.get('narrative-mode')?.value
  const mode = cookieVal === 'light' ? 'light' : 'dark'
  const hasMode = !!cookieVal

  return (
    <html
      data-mode={mode}
      className={`${inter.variable} ${manrope.variable} ${sourceSerif4.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ModeChooser hasMode={hasMode} />
        {children}
      </body>
    </html>
  )
}
