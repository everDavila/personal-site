import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('home')

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">{t('greeting')}</h1>
      <p className="mt-4 text-lg text-zinc-600">{t('tagline')}</p>
    </main>
  )
}
