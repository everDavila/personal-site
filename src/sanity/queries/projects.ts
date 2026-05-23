import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

type LocalizedString = Partial<Record<Locale, string>>

export type ProjectSummary = {
  _id: string
  slug: string
  title: LocalizedString
  client: string
  role: LocalizedString
  year: number | null
  summary: LocalizedString
  tags: string[]
  featured: boolean
  mainImage: { asset: { url: string }; alt: LocalizedString } | null
}

export type ProjectFull = ProjectSummary & {
  body: Partial<Record<Locale, unknown[]>>
  gallery: { asset: { url: string }; alt: LocalizedString; caption: LocalizedString }[]
}

export async function getFeaturedProjects(): Promise<ProjectSummary[]> {
  return client.fetch(
    `*[_type == "project" && featured == true] | order(year desc) [0...4] {
      _id,
      "slug": slug.current,
      title, client, role, year, summary, tags, featured,
      mainImage { asset->{ url }, alt }
    }`,
    {},
    { next: { tags: ['project'] } }
  )
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  return client.fetch(
    `*[_type == "project"] | order(year desc, _createdAt desc) {
      _id,
      "slug": slug.current,
      title, client, role, year, summary, tags, featured,
      mainImage { asset->{ url }, alt }
    }`,
    {},
    { next: { tags: ['project'] } }
  )
}

export async function getProjectBySlug(slug: string): Promise<ProjectFull | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      title, client, role, year, summary, tags, featured,
      mainImage { asset->{ url }, alt },
      gallery[] { asset->{ url }, alt, caption },
      body
    }`,
    { slug },
    { next: { tags: ['project'] } }
  )
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await client.fetch(`*[_type == "project"]{ "slug": slug.current }`)
  return projects.map((p: { slug: string }) => p.slug)
}
