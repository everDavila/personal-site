import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/i18n'
import type { SiteSettings } from '@/sanity/queries/siteSettings'
import { narrativeText, NARRATIVE_FALLBACK } from '@/sanity/queries/siteSettings'

const SECTION_LABEL: Record<string, { dark: string; light: string }> = {
  es: { dark: 'Operador', light: 'Sobre mí'  },
  en: { dark: 'Operator', light: 'About'     },
  pt: { dark: 'Operador', light: 'Sobre mim' },
  qu: { dark: 'Operador', light: 'Noqamanta' },
  zh: { dark: '操作员',    light: '关于'       },
}

const SECTION_DESC: Record<string, { dark: string; light: string }> = {
  es: { dark: 'El humano detrás del sistema.',     light: 'Quién diseña esto.'     },
  en: { dark: 'The human behind the system.',      light: 'Who designs this.'      },
  pt: { dark: 'O humano por trás do sistema.',     light: 'Quem projeta isso.'     },
  qu: { dark: 'Runap sistema ukumanta.',            light: 'Pi kay ruwan.'          },
  zh: { dark: '系统背后的人。',                        light: '谁在设计这个。'           },
}

const CTA_LABEL: Record<string, { dark: string; light: string }> = {
  es: { dark: 'Leer el readme',  light: 'Conocer más'    },
  en: { dark: 'Read the readme', light: 'Learn more'     },
  pt: { dark: 'Ler o readme',    light: 'Saiba mais'     },
  qu: { dark: 'Leer readme',     light: 'Más información' },
  zh: { dark: '阅读说明',           light: '了解更多'         },
}

type Props = { settings?: SiteSettings | null; mode: 'dark' | 'light' }

export async function AboutSection({ settings, mode }: Props) {
  const locale = await getLocale() as Locale

  const summaryText = narrativeText(
    settings?.homeAbout,
    mode,
    locale,
    NARRATIVE_FALLBACK[mode].homeAbout
  )

  if (!summaryText) return null

  const label = SECTION_LABEL[locale] ?? SECTION_LABEL.en
  const desc  = SECTION_DESC[locale]  ?? SECTION_DESC.en
  const cta   = CTA_LABEL[locale]     ?? CTA_LABEL.en

  return (
    <section
      className="container section-inner"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div className="section-cols">

        {/* Sidebar */}
        <div className="section-cols-sidebar">
          <p className="text-label" style={{ margin: 0 }}>{label[mode]}</p>
          <div className="section-cols-rule" />
          <p className="section-cols-desc">{desc[mode]}</p>
          <Link href={{ pathname: '/about' }} className="section-cols-cta link-accent">
            {cta[mode]} →
          </Link>
        </div>

        {/* Contenido */}
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          lineHeight: 1.7,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          {summaryText}
        </p>

      </div>
    </section>
  )
}
