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

export type UILabels = {
  nav?: {
    home?: LocalizedString; about?: LocalizedString; work?: LocalizedString
    experience?: LocalizedString; blog?: LocalizedString; contact?: LocalizedString
    playground?: LocalizedString
  }
  home?: {
    philosophyLabel?: LocalizedString; competenciesLabel?: LocalizedString
    projectsLabel?: LocalizedString; postsLabel?: LocalizedString
    moreAbout?: LocalizedString; viewExperience?: LocalizedString; ctaBlog?: LocalizedString
  }
  work?: {
    title?: LocalizedString; empty?: LocalizedString; back?: LocalizedString
    clientLabel?: LocalizedString; roleLabel?: LocalizedString
    yearLabel?: LocalizedString; noContent?: LocalizedString
  }
  playground?: {
    title?: LocalizedString; statsLabel?: LocalizedString; filterLabel?: LocalizedString
    filterAll?: LocalizedString; empty?: LocalizedString
  }
  about?: {
    title?: LocalizedString; connect?: LocalizedString; seeExperience?: LocalizedString
  }
  experience?: {
    title?: LocalizedString; workLabel?: LocalizedString; eduLabel?: LocalizedString
    current?: LocalizedString; empty?: LocalizedString; downloadCv?: LocalizedString
    featuredLabel?: LocalizedString; previousLabel?: LocalizedString
  }
  contact?: {
    title?: LocalizedString; emailLabel?: LocalizedString
  }
  blog?: {
    title?: LocalizedString; empty?: LocalizedString; back?: LocalizedString
    noContent?: LocalizedString
  }
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
    email?: string
  }
  labels?: UILabels
}

// Helper: resolve a localized string with fallback to JSON t() value
export function lbl(ls: LocalizedString | undefined, locale: string, fallback: string): string {
  return ls?.[locale as keyof LocalizedString] || fallback
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{
      hero { roleLabel, headline, sub, ctaWork, ctaCV, heroImage { asset->{ url } } },
      cvUrl,
      philosophy,
      footerText,
      competencies[] { title, description },
      funFacts[] { value, label },
      about,
      social,
      labels {
        nav { home, about, work, experience, blog, contact, playground },
        home { philosophyLabel, competenciesLabel, projectsLabel, postsLabel, moreAbout, viewExperience, ctaBlog },
        work { title, empty, back, clientLabel, roleLabel, yearLabel, noContent },
        playground { title, statsLabel, filterLabel, filterAll, empty },
        about { title, connect, seeExperience },
        experience { title, workLabel, eduLabel, current, empty, downloadCv, featuredLabel, previousLabel },
        contact { title, emailLabel },
        blog { title, empty, back, noContent },
      },
    }`,
    {},
    { next: { revalidate: 0 } }
  )
}
