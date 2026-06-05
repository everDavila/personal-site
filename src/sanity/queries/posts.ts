import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

export type PostSummary = {
  _id: string
  slug: string
  originalLanguage: Locale
  publishedAt: string
  _updatedAt: string
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  mainImage: { asset: { url: string }; alt: Record<Locale, string> } | null
  categories: { title: Record<Locale, string>; slug: string }[]
}

export type PostFull = PostSummary & {
  body: Record<Locale, unknown[]>
}

const SUMMARY_FIELDS = `
  _id,
  "slug": slug.current,
  originalLanguage,
  publishedAt,
  _updatedAt,
  title,
  excerpt,
  mainImage { asset->{ url }, alt },
  categories[]->{ title, "slug": slug.current }
`

export async function getAllPosts(locale: Locale): Promise<PostSummary[]> {
  return client.fetch(
    `*[_type == "post" && hidden != true && (defined(title[$locale]) || originalLanguage == $locale)] | order(publishedAt desc) { ${SUMMARY_FIELDS} }`,
    { locale },
    { next: { tags: ['post'] } }
  )
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  return client.fetch(
    `*[_type == "post" && hidden != true && slug.current == $slug][0] { ${SUMMARY_FIELDS}, body }`,
    { slug },
    { next: { tags: ['post'] } }
  )
}

export async function getLatestPosts(locale: Locale): Promise<PostSummary[]> {
  return client.fetch(
    `*[_type == "post" && hidden != true && (defined(title[$locale]) || originalLanguage == $locale)] | order(publishedAt desc) [0...3] { ${SUMMARY_FIELDS} }`,
    { locale },
    { next: { tags: ['post'] } }
  )
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await client.fetch(`*[_type == "post" && hidden != true]{ "slug": slug.current }`)
  return posts.map((p: { slug: string }) => p.slug)
}

type PostNav = { slug: string; title: Record<Locale, string>; originalLanguage: Locale }

export async function getAdjacentPosts(publishedAt: string): Promise<{
  prev: PostNav | null
  next: PostNav | null
}> {
  return client.fetch(
    `{
      "prev": *[_type == "post" && hidden != true && publishedAt < $publishedAt] | order(publishedAt desc) [0] {
        "slug": slug.current, title, originalLanguage
      },
      "next": *[_type == "post" && hidden != true && publishedAt > $publishedAt] | order(publishedAt asc) [0] {
        "slug": slug.current, title, originalLanguage
      }
    }`,
    { publishedAt },
    { next: { tags: ['post'] } }
  )
}
