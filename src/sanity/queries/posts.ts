import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'
import { BLOG_FALLBACK } from '@/lib/i18n'

export type PostSummary = {
  _id: string
  slugs: Record<Locale, string>
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

// Resolves localized slug: localizedSlug[locale] → localizedSlug[fallback] → canonical slug.current
const SLUG_PROJECTION = `
  "slugs": {
    "es": coalesce(localizedSlug.es.current, slug.current),
    "en": coalesce(localizedSlug.en.current, slug.current),
    "pt": coalesce(localizedSlug.pt.current, localizedSlug.es.current, slug.current),
    "qu": coalesce(localizedSlug.es.current, slug.current),
    "zh": coalesce(localizedSlug.en.current, slug.current),
  }
`

const SUMMARY_FIELDS = `
  _id,
  ${SLUG_PROJECTION},
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

export async function getPostBySlug(slug: string, locale: Locale): Promise<PostFull | null> {
  // Use BLOG_FALLBACK so qu→es and zh→en at lookup time
  const effectiveLocale = BLOG_FALLBACK[locale]
  return client.fetch(
    `*[_type == "post" && hidden != true && (
      localizedSlug[$effectiveLocale].current == $slug ||
      slug.current == $slug
    )][0] { ${SUMMARY_FIELDS}, body }`,
    { slug, effectiveLocale },
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

/** Returns one slugs map per post — for generateStaticParams and sitemap */
export async function getAllPostSlugsLocalized(): Promise<Array<Record<Locale, string>>> {
  const posts: { slugs: Record<Locale, string> }[] = await client.fetch(
    `*[_type == "post" && hidden != true] { ${SLUG_PROJECTION} }`
  )
  return posts.map(p => p.slugs)
}

/** @deprecated Use getAllPostSlugsLocalized */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await client.fetch(`*[_type == "post" && hidden != true]{ "slug": slug.current }`)
  return posts.map((p: { slug: string }) => p.slug)
}

type PostNav = { slugs: Record<Locale, string>; title: Record<Locale, string>; originalLanguage: Locale }

export async function getAdjacentPosts(publishedAt: string): Promise<{
  prev: PostNav | null
  next: PostNav | null
}> {
  return client.fetch(
    `{
      "prev": *[_type == "post" && hidden != true && publishedAt < $publishedAt] | order(publishedAt desc) [0] {
        ${SLUG_PROJECTION}, title, originalLanguage
      },
      "next": *[_type == "post" && hidden != true && publishedAt > $publishedAt] | order(publishedAt asc) [0] {
        ${SLUG_PROJECTION}, title, originalLanguage
      }
    }`,
    { publishedAt },
    { next: { tags: ['post'] } }
  )
}
