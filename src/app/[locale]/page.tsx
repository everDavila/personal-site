import { Hero } from '@/components/home/Hero'
import { Competencies } from '@/components/home/Competencies'
import { FunFacts } from '@/components/home/FunFacts'
import { getSiteSettings } from '@/sanity/queries/siteSettings'

export default async function Home() {
  const settings = await getSiteSettings()

  return (
    <>
      <Hero settings={settings} />
      <Competencies competencies={settings?.competencies ?? []} />
      <FunFacts funFacts={settings?.funFacts ?? []} />
    </>
  )
}
