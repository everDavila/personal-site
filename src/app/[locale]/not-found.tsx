import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'

const COPY: Record<Locale, { code: string; title: string; body: string; back: string }> = {
  es: { code: '404', title: 'Página no encontrada', body: 'La dirección que buscas no existe o fue movida.', back: 'Volver al inicio' },
  en: { code: '404', title: 'Page not found',       body: 'The address you\'re looking for doesn\'t exist or was moved.', back: 'Back to home' },
  pt: { code: '404', title: 'Página não encontrada', body: 'O endereço que você procura não existe ou foi movido.', back: 'Voltar ao início' },
  qu: { code: '404', title: 'Mana taripasqa',        body: 'Mañasqayki mana kanchu.', back: 'Qallariypi kutiy' },
  zh: { code: '404', title: '页面未找到',              body: '您访问的页面不存在或已移动。', back: '返回首页' },
}

export default async function NotFound() {
  const locale = await getLocale() as Locale
  const c = COPY[locale] ?? COPY.en

  return (
    <main className="container" style={{
      paddingBlock: 'var(--spacing-section)',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(5rem, 15vw, 10rem)',
        fontWeight: 400,
        lineHeight: 1,
        color: 'var(--color-border)',
        letterSpacing: '-0.04em',
        display: 'block',
        marginBottom: '1.5rem',
        userSelect: 'none',
      }}>
        {c.code}
      </span>

      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        color: 'var(--color-text)',
        margin: '0 0 0.75rem',
      }}>
        {c.title}
      </h1>

      <p style={{
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
        lineHeight: 1.6,
        margin: '0 0 2.5rem',
        maxWidth: '44ch',
      }}>
        {c.body}
      </p>

      <Link
        href={{ pathname: '/' }}
        style={{
          fontSize: 'var(--text-label)',
          color: 'var(--color-muted)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          transition: 'color var(--transition)',
        }}
        className="link-accent"
      >
        ← {c.back}
      </Link>
    </main>
  )
}
