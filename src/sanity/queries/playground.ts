import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

type LocalizedString = Partial<Record<Locale, string>>

export type LogTag = {
  _id:      string
  name:     LocalizedString
  slug:     string
  colorKey: string
}

export type Dimension = {
  _id:       string
  name:      LocalizedString
  slug:      string
  icon:      string
  whenToUse: string | null
}

export type LogEntry = {
  _key:      string
  date:      string
  time:      string | null
  dimension: Dimension | null
  tag:       LogTag | null
  description: LocalizedString | null
  images: Array<{
    _key:    string
    asset:   { url: string }
    caption: LocalizedString | null
  }> | null
}

export type PlaygroundItem = {
  _id: string
  slugs: { es: string; en: string }
  title: LocalizedString
  category: string
  status: string
  year: number
  description: LocalizedString | null
  image: { asset: { url: string }; alt: LocalizedString } | null
  repoUrl: string | null
  demoUrl: string | null
  lastEntryDate: string | null
}

export type PlaygroundItemFull = PlaygroundItem & {
  body:       Partial<Record<Locale, unknown[]>> | null
  idea:       Partial<Record<Locale, unknown[]>> | null
  why:        Partial<Record<Locale, unknown[]>> | null
  logEntries: LogEntry[] | null
}

// en → localizedSlug.en, everything else → es
const SLUG_PROJECTION = `
  "slugs": {
    "es": coalesce(localizedSlug.es.current, slug.current),
    "en": coalesce(localizedSlug.en.current, slug.current),
  }
`

const ITEM_FIELDS = `
  _id,
  ${SLUG_PROJECTION},
  title, category, status, year, description,
  image { asset->{ url }, alt },
  repoUrl, demoUrl
`

function sortByActivity(raw: PlaygroundItem[]): PlaygroundItem[] {
  return raw.sort((a, b) =>
    (b.lastEntryDate ?? '').localeCompare(a.lastEntryDate ?? '')
  )
}

const ITEM_FIELDS_WITH_SORT = `
  ${ITEM_FIELDS},
  "lastEntryDate": (logEntries | order(date desc))[0].date
`

export async function getFeaturedPlaygroundItems(count = 3): Promise<PlaygroundItem[]> {
  const raw = await client.fetch(
    `*[_type == "playgroundItem" && hidden != true] { ${ITEM_FIELDS_WITH_SORT} }`,
    {},
    { next: { tags: ['playgroundItem'] } }
  )
  return sortByActivity(raw).slice(0, count)
}

export async function getAllPlaygroundItems(): Promise<PlaygroundItem[]> {
  const raw = await client.fetch(
    `*[_type == "playgroundItem" && hidden != true] { ${ITEM_FIELDS_WITH_SORT} }`,
    {},
    { next: { tags: ['playgroundItem'] } }
  )
  return sortByActivity(raw)
}

const LOG_ENTRY_FIELDS = `
  _key, date, time, description,
  dimension->{ _id, name, "slug": slug.current, icon, whenToUse },
  tag->{ _id, name, "slug": slug.current, colorKey },
  images[]{ _key, asset->{ url }, caption }
`

export async function getPlaygroundItemBySlug(slug: string, locale: Locale): Promise<PlaygroundItemFull | null> {
  const effectiveLocale = locale === 'en' ? 'en' : 'es'
  return client.fetch(
    `*[_type == "playgroundItem" && hidden != true && (
      localizedSlug[$effectiveLocale].current == $slug ||
      slug.current == $slug
    )][0] {
      ${ITEM_FIELDS},
      body,
      idea, why,
      logEntries[]{ ${LOG_ENTRY_FIELDS} }
    }`,
    { slug, effectiveLocale },
    { next: { tags: ['playgroundItem', 'logTag'] } }
  )
}

export async function getAllPlaygroundSlugs(): Promise<string[]> {
  const items = await client.fetch(`*[_type == "playgroundItem" && hidden != true && defined(slug.current)]{ "slug": slug.current }`)
  return items.map((i: { slug: string }) => i.slug)
}
