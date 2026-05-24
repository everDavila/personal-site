import type { Metadata } from 'next'
import { Inter, Manrope, Source_Serif_4 } from 'next/font/google'
import Script from 'next/script'
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
  description: 'Portfolio personal',
}

const themeScript = `
  (function() {
    var stored = localStorage.getItem('theme');
    var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', stored || preferred);
  })()
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${inter.variable} ${manrope.variable} ${sourceSerif4.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        {children}
      </body>
    </html>
  )
}
