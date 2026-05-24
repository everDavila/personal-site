import { getLocale } from 'next-intl/server'
import type { FunFact } from '@/sanity/queries/siteSettings'

type Props = { funFacts: FunFact[] }

export async function FunFacts({ funFacts }: Props) {
  const locale = await getLocale() as 'es' | 'en' | 'pt' | 'qu' | 'zh'

  if (!funFacts?.length) return null

  return (
    <section className="container section" style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(10rem, 45%), 1fr))',
        gap: '2rem',
      }}>
        {funFacts.map((f, i) => (
          <div key={i}>
            <span style={{
              display: 'block',
              fontSize: 'var(--text-section)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-accent)',
              lineHeight: 1,
              marginBottom: '0.375rem',
            }}>
              {f.value}
            </span>
            <span style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-muted)',
              lineHeight: 1.4,
            }}>
              {f.label?.[locale]}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
