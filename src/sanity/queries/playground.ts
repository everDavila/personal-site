import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

type LocalizedString = Partial<Record<Locale, string>>

export type PlaygroundItem = {
  _id: string
  title: LocalizedString
  category: string
  status: string
  year: number
  description: LocalizedString | null
  image: { asset: { url: string }; alt: LocalizedString } | null
  repoUrl: string | null
  demoUrl: string | null
}

export async function getAllPlaygroundItems(): Promise<PlaygroundItem[]> {
  return client.fetch(
    `*[_type == "playgroundItem"] | order(year desc, _createdAt desc) {
      _id,
      title,
      category,
      status,
      year,
      description,
      image { asset->{ url }, alt },
      repoUrl,
      demoUrl
    }`,
    {},
    { next: { tags: ['playgroundItem'] } }
  )
}
