import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'

const NAV_LINKS = [
  { href: '/about',      key: 'about' },
  { href: '/work',       key: 'work' },
  { href: '/experience', key: 'experience' },
  { href: '/blog',       key: 'blog' },
  { href: '/contact',    key: 'contact' },
  { href: '/playground', key: 'playground' },
] as const

export function Nav() {
  const t = useTranslations('nav')

  const links = NAV_LINKS.map(({ href, key }) => ({
    href,
    label: t(key),
  }))

  return (
    <header
      style={{
        position: 'sticky',
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
            fontWeight: 600,
            fontSize: 'var(--text-body)',
            color: 'var(--color-text)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            transition: 'color var(--transition)',
          }}
        >
          ever davila
        </Link>

        {/* Desktop: links + controles */}
        <div className="nav-desktop" style={{ alignItems: 'center', gap: '1.5rem' }}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="link-accent"
              style={{ fontSize: 'var(--text-small)', fontWeight: 500 }}
            >
              {label}
            </Link>
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
