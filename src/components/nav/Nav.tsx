import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { ComponentProps } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'
import { LogoMark } from './LogoMark'
import { NavLink } from './NavLink'
import { getSiteSettings, lbl } from '@/sanity/queries/siteSettings'
import type { Locale } from '@/lib/i18n'

export async function Nav() {
  const locale = await getLocale() as Locale
  const [t, settings] = await Promise.all([
    getTranslations('nav'),
    getSiteSettings(),
  ])

  const nav = settings?.labels?.nav
  const links = [
    { href: '/work',       label: lbl(nav?.work,       locale, t('work'))       },
    { href: '/experience', label: lbl(nav?.experience, locale, t('experience')) },
    { href: '/blog',       label: lbl(nav?.blog,       locale, t('blog'))       },
    { href: '/contact',    label: lbl(nav?.contact,    locale, t('contact'))    },
  ]

  return (
    <header
      style={{
        position: 'fixed',
        insetInline: 0,
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--color-bg)',
        borderBottom: 'var(--border-width) solid var(--color-border)',
        transition: 'background-color var(--transition), border-color var(--transition)',
      }}
    >
      <nav
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBlock: '1rem',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            color: 'var(--color-text)',
            textDecoration: 'none',
            transition: 'color var(--transition)',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="ever dávila — inicio"
        >
          <LogoMark />
        </Link>

        {/* Desktop: links + controles */}
        <div className="nav-desktop" style={{ alignItems: 'center', gap: '1.5rem' }}>
          {links.map(({ href, label }) => (
            <NavLink key={href} href={{ pathname: href } as ComponentProps<typeof Link>['href']} label={label} />
          ))}

          <div style={{
            width: 'var(--border-width)',
            height: '1rem',
            backgroundColor: 'var(--color-border)',
          }} />

          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        {/* Mobile: hamburguesa */}
        <div className="nav-mobile" style={{ alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />
          <MobileMenu links={links} />
        </div>
      </nav>
    </header>
  )
}
