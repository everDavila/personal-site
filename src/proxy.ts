import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/maintenance')) {
    return NextResponse.next()
  }

  if (
    process.env.MAINTENANCE_MODE === 'true' &&
    !pathname.startsWith('/api')
  ) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|studio|.*\\..*).*)']
}
