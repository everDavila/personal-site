import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'

type LocalizedText = {
  es?: string
  en?: string
  pt?: string
  qu?: string
  zh?: string
}

export type EditorialSubtitle = {
  _id: string
  text: LocalizedText
  weight: number
  rotation: 'random' | 'weighted' | 'daily' | 'manual'
  time: string[]
  season: string[]
  startDate: string | null
  endDate: string | null
}

const subtitlePoolQuery = groq`
  *[
    _type == "editorialSubtitle" &&
    page == $page &&
    active == true &&
    archived != true
  ] {
    _id,
    text,
    "weight": coalesce(weight, 1),
    "rotation": coalesce(rotation, "random"),
    "time": coalesce(time, []),
    "season": coalesce(season, []),
    startDate,
    endDate,
  }
`

// ── Locale fallback chain ──────────────────────────────────────────────────
// qu → es → en, zh → en → es, pt → es → en, es → en, en → es

const FALLBACK: Record<string, string[]> = {
  qu: ['es', 'en', 'pt'],
  zh: ['en', 'es', 'pt'],
  pt: ['es', 'en'],
  es: ['en', 'pt'],
  en: ['es', 'pt'],
}

function resolveText(text: LocalizedText, locale: string): string | null {
  const locales = [locale, ...(FALLBACK[locale] ?? [])]
  for (const l of locales) {
    const v = text[l as keyof LocalizedText]?.trim()
    if (v) return v
  }
  return null
}

// ── Context helpers ────────────────────────────────────────────────────────

function getTimeSlot(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  if (h >= 18 && h < 22) return 'evening'
  return 'night'
}

// Southern hemisphere seasons (Lima, Peru)
function getSeason(): string {
  const m = new Date().getMonth()
  if (m === 11 || m <= 1) return 'summer'
  if (m >= 2 && m <= 4) return 'autumn'
  if (m >= 5 && m <= 7) return 'winter'
  return 'spring'
}

function inDateRange(sub: EditorialSubtitle): boolean {
  const today = new Date().toISOString().split('T')[0]
  if (sub.startDate && today < sub.startDate) return false
  if (sub.endDate && today > sub.endDate) return false
  return true
}

function applyContext(pool: EditorialSubtitle[]): EditorialSubtitle[] {
  const timeSlot = getTimeSlot()
  const season = getSeason()
  return pool.filter(sub => {
    if (!inDateRange(sub)) return false
    if (sub.time.length > 0 && !sub.time.includes(timeSlot)) return false
    if (sub.season.length > 0 && !sub.season.includes(season)) return false
    return true
  })
}

// ── Selection algorithm ────────────────────────────────────────────────────

function selectSubtitle(pool: EditorialSubtitle[]): EditorialSubtitle | null {
  if (pool.length === 0) return null

  // 1. Manual (pinned): first active manual entry wins
  const manual = pool.find(s => s.rotation === 'manual')
  if (manual) return manual

  // 2. Daily: deterministic selection seeded by day-of-year
  const dailyPool = pool.filter(s => s.rotation === 'daily')
  if (dailyPool.length > 0) {
    const start = new Date(new Date().getFullYear(), 0, 0).getTime()
    const dayOfYear = Math.floor((Date.now() - start) / 86_400_000)
    return dailyPool[dayOfYear % dailyPool.length]
  }

  // 3. Weighted random from random + weighted pool
  const randomPool = pool.filter(s => s.rotation === 'random' || s.rotation === 'weighted')
  if (randomPool.length === 0) return null

  const totalWeight = randomPool.reduce((sum, s) => sum + s.weight, 0)
  if (totalWeight <= 0) return null

  let rand = Math.random() * totalWeight
  for (const sub of randomPool) {
    rand -= sub.weight
    if (rand <= 0) return sub
  }
  return randomPool[randomPool.length - 1]
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function getPageSubtitle(page: string, locale: string): Promise<string | null> {
  const pool: EditorialSubtitle[] = await client.fetch(
    subtitlePoolQuery,
    { page },
    { next: { revalidate: 0 } },
  )
  const eligible = applyContext(pool)
  const selected = selectSubtitle(eligible)
  if (!selected) return null
  return resolveText(selected.text, locale)
}

export async function getPageSubtitleData(
  page: string,
  locale: string,
): Promise<{ initial: string | null; pool: string[] }> {
  const raw: EditorialSubtitle[] = await client.fetch(
    subtitlePoolQuery,
    { page },
    { next: { revalidate: 0 } },
  )
  const eligible = applyContext(raw)
  // Resolve all subtitles to current locale (for client-side rotation pool)
  const pool = eligible
    .map(s => resolveText(s.text, locale))
    .filter((t): t is string => !!t)
  const selected = selectSubtitle(eligible)
  const initial = selected ? resolveText(selected.text, locale) : null
  return { initial, pool }
}
