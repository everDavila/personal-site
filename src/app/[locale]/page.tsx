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
import { BLOG_FALLBACK } from '@/lib/i18n'

export default async function Home() {
  const locale = await getLocale() as Locale

  const [settings, projects, experience, posts] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getExperience(),
    getLatestPosts(locale),
  ])

  // Fall back per BLOG_FALLBACK (qu → es, zh → en) if current locale has no posts.
  // Also track which locale to render the post content in.
  const fallbackLocale = BLOG_FALLBACK[locale]
  const displayPosts      = posts.length > 0 ? posts : await getLatestPosts(fallbackLocale)
  const postsDisplayLocale: Locale = posts.length > 0 ? locale : fallbackLocale
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
      <Writing posts={displayPosts} displayLocale={postsDisplayLocale} />
    </>
  )
}
