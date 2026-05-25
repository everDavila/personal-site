import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'

export type EditorialSubtitle = {
  _id: string
  text: string | null
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
    language == $language &&
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

function selectFromPool(pool: EditorialSubtitle[]): string | null {
  if (pool.length === 0) return null

  // 1. Manual (pinned): first active manual entry wins
  const manual = pool.find(s => s.rotation === 'manual')
  if (manual) return manual.text ?? null

  // 2. Daily: deterministic selection seeded by day-of-year (same all day)
  const dailyPool = pool.filter(s => s.rotation === 'daily')
  if (dailyPool.length > 0) {
    const start = new Date(new Date().getFullYear(), 0, 0).getTime()
    const dayOfYear = Math.floor((Date.now() - start) / 86_400_000)
    const pick = dailyPool[dayOfYear % dailyPool.length]
    return pick.text ?? null
  }

  // 3. Weighted random from random + weighted pool
  const randomPool = pool.filter(s => s.rotation === 'random' || s.rotation === 'weighted')
  if (randomPool.length === 0) return null

  const totalWeight = randomPool.reduce((sum, s) => sum + s.weight, 0)
  if (totalWeight <= 0) return null

  let rand = Math.random() * totalWeight
  for (const sub of randomPool) {
    rand -= sub.weight
    if (rand <= 0) return sub.text ?? null
  }

  return randomPool[randomPool.length - 1].text ?? null
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function getPageSubtitle(page: string, language: string): Promise<string | null> {
  const pool: EditorialSubtitle[] = await client.fetch(
    subtitlePoolQuery,
    { page, language },
    { next: { revalidate: 0 } },
  )
  const eligible = applyContext(pool)
  const text = selectFromPool(eligible)
  // Empty string = intentional silent state
  return text && text.trim().length > 0 ? text.trim() : null
}

export async function getPageSubtitleData(
  page: string,
  language: string,
): Promise<{ initial: string | null; pool: string[] }> {
  const raw: EditorialSubtitle[] = await client.fetch(
    subtitlePoolQuery,
    { page, language },
    { next: { revalidate: 0 } },
  )
  const eligible = applyContext(raw)
  const pool = eligible.map(s => s.text?.trim() ?? '').filter(s => s.length > 0)
  const initial = selectFromPool(eligible)
  return { initial: initial?.trim() || null, pool }
}
