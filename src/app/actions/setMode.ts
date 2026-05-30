'use server'
import { cookies } from 'next/headers'
import type { NarrativeMode } from '@/lib/mode'

export async function setNarrativeMode(mode: NarrativeMode) {
  const jar = await cookies()
  jar.set('narrative-mode', mode, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  })
}
