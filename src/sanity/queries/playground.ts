import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

type LocalizedString = Partial<Record<Locale, string>>

export type PlaygroundItem = {
  _id: string
  slug: string
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
  body: Partial<Record<Locale, unknown[]>> | null
}

export async function getAllPlaygroundItems(): Promise<PlaygroundItem[]> {
  return client.fetch(
    `*[_type == "playgroundItem" && hidden != true] | order(year desc, _createdAt desc) {
      _id,
      "slug": slug.current,
      title, category, status, year, description,
      image { asset->{ url }, alt },
      repoUrl, demoUrl
    }`,
    {},
    { next: { tags: ['playgroundItem'] } }
  )
}

export async function getPlaygroundItemBySlug(slug: string): Promise<PlaygroundItemFull | null> {
  return client.fetch(
    `*[_type == "playgroundItem" && hidden != true && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      title, category, status, year, description,
      image { asset->{ url }, alt },
      body,
      repoUrl, demoUrl
    }`,
    { slug },
    { next: { tags: ['playgroundItem'] } }
  )
}

export async function getAllPlaygroundSlugs(): Promise<string[]> {
  const items = await client.fetch(`*[_type == "playgroundItem" && hidden != true && defined(slug.current)]{ "slug": slug.current }`)
  return items.map((i: { slug: string }) => i.slug)
}
