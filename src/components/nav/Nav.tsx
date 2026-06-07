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

const DARK_NAV: Record<Locale, Record<string, string>> = {
  es: { work: 'Misiones', playground: 'Laboratorio', blog: 'Bitácora', about: 'Readme', contact: 'Señal'  },
  en: { work: 'Missions', playground: 'Lab',         blog: 'Logs',     about: 'Readme', contact: 'Signal' },
  pt: { work: 'Missões',  playground: 'Laboratório', blog: 'Registros',about: 'Readme', contact: 'Sinal'  },
  qu: { work: 'Misiones', playground: 'Pukllay',     blog: 'Bitácora', about: 'Readme', contact: 'Señal'  },
  zh: { work: '使命',      playground: '实验室',       blog: '日志',      about: '说明',   contact: '信号'   },
}

export async function Nav() {
  const locale = await getLocale() as Locale
  const [t, settings] = await Promise.all([
    getTranslations('nav'),
    getSiteSettings(),
  ])

  const nav  = settings?.labels?.nav
  const dark = DARK_NAV[locale] ?? DARK_NAV.en
  const links = [
    { href: '/work',       labelDark: dark.work,       labelLight: lbl(nav?.work,       locale, t('work'))       },
    { href: '/playground', labelDark: dark.playground, labelLight: lbl(nav?.playground, locale, t('playground')) },
    { href: '/blog',       labelDark: dark.blog,       labelLight: lbl(nav?.blog,       locale, t('blog'))       },
    { href: '/about',      labelDark: dark.about,      labelLight: lbl(nav?.about,      locale, t('about'))      },
    { href: '/contact',    labelDark: dark.contact,    labelLight: lbl(nav?.contact,    locale, t('contact'))    },
  ]

  return (
    <header
      className="nav-glass"
      style={{
        position: 'fixed',
        insetInline: 0,
        top: 0,
        zIndex: 50,
        transition: 'background-color var(--transition)',
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
          {links.map(({ href, labelDark, labelLight }) => (
            <NavLink key={href} href={{ pathname: href } as ComponentProps<typeof Link>['href']} labelDark={labelDark} labelLight={labelLight} />
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
          <MobileMenu links={links.map(l => ({ href: l.href, labelDark: l.labelDark, labelLight: l.labelLight }))} />
        </div>
      </nav>
    </header>
  )
}
