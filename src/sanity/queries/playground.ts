import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

type LocalizedString = Partial<Record<Locale, string>>

export type LogTag = {
  _id:      string
  name:     LocalizedString
  slug:     string
  colorKey: string
}

export type LogEntry = {
  _key:      string
  date:      string
  dimension: string
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
}

export type PlaygroundItemFull = PlaygroundItem & {
  body:       Partial<Record<Locale, unknown[]>> | null
  idea:       LocalizedString | null
  why:        LocalizedString | null
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

export async function getFeaturedPlaygroundItems(count = 3): Promise<PlaygroundItem[]> {
  return client.fetch(
    `*[_type == "playgroundItem" && hidden != true] | order(year desc, _createdAt desc) [0...$count] { ${ITEM_FIELDS} }`,
    { count },
    { next: { tags: ['playgroundItem'] } }
  )
}

export async function getAllPlaygroundItems(): Promise<PlaygroundItem[]> {
  return client.fetch(
    `*[_type == "playgroundItem" && hidden != true] | order(year desc, _createdAt desc) { ${ITEM_FIELDS} }`,
    {},
    { next: { tags: ['playgroundItem'] } }
  )
}

const LOG_ENTRY_FIELDS = `
  _key, date, dimension, description,
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
