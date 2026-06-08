import { getLocale } from 'next-intl/server'
import { Hero } from '@/components/home/Hero'
import { SelectedWork } from '@/components/home/SelectedWork'
import { Philosophy } from '@/components/home/Philosophy'
import { Writing } from '@/components/home/Writing'
import { AboutSection } from '@/components/home/AboutSection'
import { LabSection } from '@/components/home/LabSection'
import { getSiteSettings, narrativeText, NARRATIVE_FALLBACK } from '@/sanity/queries/siteSettings'
import { getFeaturedProjects } from '@/sanity/queries/projects'
import { getLatestPosts } from '@/sanity/queries/posts'
import { getFeaturedPlaygroundItems } from '@/sanity/queries/playground'
import { getPageSubtitleData } from '@/sanity/queries/editorialSubtitle'
import { getMode } from '@/lib/mode'
import type { Locale } from '@/lib/i18n'
import { BLOG_FALLBACK } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const locale = await getLocale() as Locale
  const mode   = await getMode()

  const settings = await getSiteSettings()

  const [projects, labItems, posts, homeSubtitleData] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedPlaygroundItems(settings?.labCount ?? 3),
    getLatestPosts(locale),
    getPageSubtitleData('home', locale, mode),
  ])

  const fallbackLocale = BLOG_FALLBACK[locale]
  const displayPosts        = posts.length > 0 ? posts : await getLatestPosts(fallbackLocale)
  const postsDisplayLocale: Locale = posts.length > 0 ? locale : fallbackLocale

  const philosophyDark  = narrativeText(settings?.philosophy, 'dark',  locale, NARRATIVE_FALLBACK.dark.philosophy)
  const philosophyLight = narrativeText(settings?.philosophy, 'light', locale, NARRATIVE_FALLBACK.light.philosophy)

  return (
    <>
      <Hero settings={settings} initialSub={homeSubtitleData.initial} subtitlePool={homeSubtitleData.pool} />
      <SelectedWork projects={projects} settings={settings} />
      <LabSection items={labItems} />
      {/* Philosophy oculta temporalmente */}
      <Writing posts={displayPosts} displayLocale={postsDisplayLocale} settings={settings} />
      <AboutSection settings={settings} mode={mode} />
    </>
  )
}
