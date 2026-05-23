import { client } from '../lib/client'
import type { Locale } from '@/lib/i18n'

type LocalizedString = Partial<Record<Locale, string>>

export type WorkEntry = {
  _key: string
  company: string
  role: LocalizedString
  period: string
  current: boolean
  description: LocalizedString
}

export type EducationEntry = {
  _key: string
  institution: string
  degree: LocalizedString
  period: string
  description: LocalizedString
}

export type ExperienceData = {
  workExperience: WorkEntry[]
  education: EducationEntry[]
}

export async function getExperience(): Promise<ExperienceData | null> {
  return client.fetch(
    `*[_type == "experience" && _id == "experience"][0]{
      workExperience[] { _key, company, role, period, current, description },
      education[]      { _key, institution, degree, period, description }
    }`,
    {},
    { next: { tags: ['experience'] } }
  )
}
