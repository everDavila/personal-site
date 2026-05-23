import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

export type PostSummary = {
  _id: string
  slug: string
  originalLanguage: Locale
  publishedAt: string
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  mainImage: { asset: { url: string }; alt: Record<Locale, string> } | null
  categories: { title: Record<Locale, string>; slug: string }[]
}

export type PostFull = PostSummary & {
  body: Record<Locale, unknown[]>
}

export async function getAllPosts(): Promise<PostSummary[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id,
      "slug": slug.current,
      originalLanguage,
      publishedAt,
      title,
      excerpt,
      mainImage { asset->{ url }, alt },
      categories[]->{ title, "slug": slug.current }
    }`,
    {},
    { next: { tags: ['post'] } }
  )
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      originalLanguage,
      publishedAt,
      title,
      excerpt,
      mainImage { asset->{ url }, alt },
      categories[]->{ title, "slug": slug.current },
      body
    }`,
    { slug },
    { next: { tags: ['post'] } }
  )
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`)
  return posts.map((p: { slug: string }) => p.slug)
}
