import { getSiteSettings } from '@/sanity/queries/siteSettings'
import { getTranslations } from 'next-intl/server'

export default async function ContactPage() {
  const [settings, t] = await Promise.all([
    getSiteSettings(),
    getTranslations('contact'),
  ])

  const social = settings?.social

  return (
    <main className="container section">
      <h1 style={{
        fontSize: 'var(--text-section)',
        fontFamily: 'var(--font-display)',
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
        marginBottom: '3rem',
        maxWidth: '32rem',
      }}>
        {t('subtitle')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {social?.email && (
          <ContactRow label={t('email_label')}>
            <a href={`mailto:${social.email}`} className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              {social.email}
            </a>
          </ContactRow>
        )}
        {social?.linkedin && (
          <ContactRow label="LinkedIn">
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              {social.linkedin.replace('https://', '')}
            </a>
          </ContactRow>
        )}
        {social?.github && (
          <ContactRow label="GitHub">
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              {social.github.replace('https://', '')}
            </a>
          </ContactRow>
        )}
        {social?.twitter && (
          <ContactRow label="X / Twitter">
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="link-accent" style={{ fontSize: 'var(--text-body)' }}>
              {social.twitter.replace('https://', '')}
            </a>
          </ContactRow>
        )}
      </div>
    </main>
  )
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '7rem 1fr',
      gap: '1rem',
      paddingBlock: '1rem',
      borderBottom: 'var(--border-width) solid var(--color-border)',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', fontWeight: 500 }}>
        {label}
      </span>
      {children}
    </div>
  )
}
