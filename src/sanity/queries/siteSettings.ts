import { client } from '../lib/client'

export type LocalizedString = {
  es?: string; en?: string; pt?: string; qu?: string; zh?: string
}

export type Competency = {
  title: LocalizedString
  description: LocalizedString
}

export type FunFact = {
  value: string
  label: LocalizedString
}

export type SiteSettings = {
  hero: {
    roleLabel: LocalizedString
    headline: LocalizedString
    sub: LocalizedString
    ctaWork: LocalizedString
    ctaCV: LocalizedString
    heroImage: { asset: { url: string } } | null
  }
  cvUrl?: string | null
  philosophy?: LocalizedString | null
  footerText?: LocalizedString | null
  competencies: Competency[]
  funFacts: FunFact[]
  about: LocalizedString
  social: {
    linkedin?: string
    github?: string
    twitter?: string
    email?: string
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings"][0]{
      hero { roleLabel, headline, sub, ctaWork, ctaCV, heroImage { asset->{ url } } },
      cvUrl,
      philosophy,
      footerText,
      competencies[] { title, description },
      funFacts[] { value, label },
      about,
      social
    }`,
    {},
    { next: { tags: ['siteSettings'] } }
  )
}
