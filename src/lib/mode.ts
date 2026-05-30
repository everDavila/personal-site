import { cache } from 'react'
import { cookies } from 'next/headers'

export type NarrativeMode = 'dark' | 'light'

export const getMode = cache(async (): Promise<NarrativeMode> => {
  const jar = await cookies()
  const val = jar.get('narrative-mode')?.value
  return val === 'light' ? 'light' : 'dark'
})
