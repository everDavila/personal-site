'use client'

import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import type { ComponentProps } from 'react'

type Href = ComponentProps<typeof Link>['href']

type Props = {
  href: Href
  label: string
}

export function NavLink({ href, label }: Props) {
  const pathname = usePathname()
  const hrefStr = typeof href === 'string' ? href : (href as { pathname?: string }).pathname ?? ''
  const isActive = pathname === hrefStr || (hrefStr !== '/' && pathname.startsWith(hrefStr))

  return (
    <Link
      href={href}
      className="link-accent"
      style={{
        fontSize: 'var(--text-small)',
        fontWeight: 500,
        color: isActive ? 'var(--color-accent)' : undefined,
        textDecoration: 'none',
      }}
    >
      {label}
    </Link>
  )
}
