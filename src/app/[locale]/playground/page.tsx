import { getTranslations } from 'next-intl/server'

export default async function PlaygroundPage() {
  const t = await getTranslations('playground')

  return (
    <main className="container section">
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '0.75rem',
      }}>
        {t('title')}
      </h1>
      <p style={{
        fontSize: 'var(--text-body)',
        color: 'var(--color-muted)',
        lineHeight: 1.7,
      }}>
        {t('subtitle')}
      </p>
    </main>
  )
}
