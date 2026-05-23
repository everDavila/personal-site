import { getLocale } from 'next-intl/server'
import { Hero } from '@/components/home/Hero'
import { SelectedWork } from '@/components/home/SelectedWork'
import { Philosophy } from '@/components/home/Philosophy'
import { ExperienceSnapshot } from '@/components/home/ExperienceSnapshot'
import { Writing } from '@/components/home/Writing'
import { getSiteSettings } from '@/sanity/queries/siteSettings'
import { getFeaturedProjects } from '@/sanity/queries/projects'
import { getExperience } from '@/sanity/queries/experience'
import { getLatestPosts } from '@/sanity/queries/posts'
import type { Locale } from '@/lib/i18n'

export default async function Home() {
  const [settings, projects, experience, posts] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getExperience(),
    getLatestPosts(),
  ])

  const locale = await getLocale() as Locale
  const philosophy = settings?.philosophy?.[locale]
    || settings?.philosophy?.es
    || null

  return (
    <>
      <Hero settings={settings} cvUrl={settings?.cvUrl} />
      <SelectedWork projects={projects} />
      {philosophy && <Philosophy text={philosophy} />}
      <ExperienceSnapshot
        workEntries={experience?.workExperience ?? []}
        eduEntries={experience?.education ?? []}
        cvUrl={experience?.cvUrl ?? settings?.cvUrl}
      />
      <Writing posts={posts} />
    </>
  )
}
