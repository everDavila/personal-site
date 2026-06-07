'use client'

import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import type { ComponentProps } from 'react'

type Href = ComponentProps<typeof Link>['href']

type Props = {
  href: Href
  labelDark: string
  labelLight: string
}

export function NavLink({ href, labelDark, labelLight }: Props) {
  const pathname = usePathname()
  const hrefStr = typeof href === 'string' ? href : (href as { pathname?: string }).pathname ?? ''
  const isActive = pathname === hrefStr || (hrefStr !== '/' && pathname.startsWith(hrefStr))

  return (
    <Link
      href={href}
      className={`nav-link${isActive ? ' nav-link--active' : ''}`}
    >
      <span className="n-slot">
        <span className="n-d">{labelDark}</span>
        <span className="n-l">{labelLight}</span>
      </span>
    </Link>
  )
}
