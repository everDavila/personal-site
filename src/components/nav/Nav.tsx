import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from './ThemeToggle'
import { LocaleSwitcher } from './LocaleSwitcher'

const NAV_LINKS = [
  { href: '/work',       key: 'work' },
  { href: '/blog',       key: 'blog' },
  { href: '/about',      key: 'about' },
  { href: '/playground', key: 'playground' },
] as const

export function Nav() {
  const t = useTranslations('nav')

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

        {/* Links + controles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {NAV_LINKS.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className="link-accent"
              style={{
                fontSize: 'var(--text-small)',
                fontWeight: 500,
              }}
            >
              {t(key)}
            </Link>
          ))}

          <div
            style={{
              width: 'var(--border-width)',
              height: '1rem',
              backgroundColor: 'var(--color-border)',
            }}
          />

          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
