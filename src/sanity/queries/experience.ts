import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

type LocalizedString = Partial<Record<Locale, string>>

export type WorkEntry = {
  _key: string
  company: string
  logo: { asset: { url: string } } | null
  role: LocalizedString
  period: string
  current: boolean
  description: LocalizedString
  tags: string[] | null
}

export type EducationEntry = {
  _key: string
  institution: string
  logo: { asset: { url: string } } | null
  degree: LocalizedString
  period: string
  description: LocalizedString
  tags: string[] | null
}

export type ExperienceData = {
  cvUrl?: string | null
  workExperience: WorkEntry[]
  education: EducationEntry[]
}

export async function getExperience(): Promise<ExperienceData | null> {
  return client.fetch(
    `*[_type == "experience" && _id == "experience"][0]{
      cvUrl,
      workExperience[] { _key, company, logo { asset->{ url } }, role, period, current, description, tags },
      education[]      { _key, institution, logo { asset->{ url } }, degree, period, description, tags }
    }`,
    {},
    { next: { tags: ['experience'] } }
  )
}
