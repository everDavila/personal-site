import { getLocale } from 'next-intl/server'
import { Hero } from '@/components/home/Hero'
import { SelectedWork } from '@/components/home/SelectedWork'
import { Philosophy } from '@/components/home/Philosophy'
import { ExperienceSnapshot } from '@/components/home/ExperienceSnapshot'
import { Writing } from '@/components/home/Writing'
import { getSiteSettings, narrativeText, NARRATIVE_FALLBACK } from '@/sanity/queries/siteSettings'
import { getFeaturedProjects } from '@/sanity/queries/projects'
import { getExperience } from '@/sanity/queries/experience'
import { getLatestPosts } from '@/sanity/queries/posts'
import { getPageSubtitleData } from '@/sanity/queries/editorialSubtitle'
import { getMode } from '@/lib/mode'
import type { Locale } from '@/lib/i18n'
import { BLOG_FALLBACK } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [locale, mode] = await Promise.all([
    getLocale() as Promise<Locale>,
    getMode(),
  ])

  const [settings, projects, experience, posts, homeSubtitleData] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getExperience(),
    getLatestPosts(locale),
    getPageSubtitleData('home', locale),
  ])

  const fallbackLocale = BLOG_FALLBACK[locale]
  const displayPosts        = posts.length > 0 ? posts : await getLatestPosts(fallbackLocale)
  const postsDisplayLocale: Locale = posts.length > 0 ? locale : fallbackLocale

  const philosophy = narrativeText(
    settings?.philosophy,
    mode,
    locale,
    NARRATIVE_FALLBACK[mode].philosophy,
  )

  return (
    <>
      <Hero settings={settings} cvUrl={settings?.cvUrl} mode={mode} initialSub={homeSubtitleData.initial} subtitlePool={homeSubtitleData.pool} />
      <SelectedWork projects={projects} settings={settings} />
      {philosophy && <Philosophy text={philosophy} />}
      <ExperienceSnapshot
        workEntries={experience?.workExperience ?? []}
        eduEntries={experience?.education ?? []}
        cvUrl={experience?.cvUrl ?? settings?.cvUrl}
        settings={settings}
      />
      <Writing posts={displayPosts} displayLocale={postsDisplayLocale} settings={settings} />
    </>
  )
}
