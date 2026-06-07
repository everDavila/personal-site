import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSiteSettings } from '@/sanity/queries/siteSettings'
import type { Locale } from '@/lib/i18n'

function LogoStatic() {
  return (
    <svg
      viewBox="0 0 32 43"
      width="16"
      height="21"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', color: 'var(--color-text)', flexShrink: 0, marginTop: '0.1rem' }}
    >
      <path d="M 5 5 H 13"                   stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M 14 5 A 13 16.5 0 0 1 14 38" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
      <path d="M 3 38 H 13"                   stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  )
}

const LINK_STYLE = {
  fontSize: '0.8125rem',
  color: 'var(--color-muted)',
  textDecoration: 'none',
} as const

/* Column headers por locale */
const HEADERS: Record<Locale, { col1: string; col2: string; col3: string }> = {
  es: { col1: 'Trabajo',    col2: 'Explorar',  col3: 'Encontrarme' },
  en: { col1: 'Work',       col2: 'Explore',   col3: 'Find me'     },
  pt: { col1: 'Trabalho',   col2: 'Explorar',  col3: 'Encontre-me' },
  qu: { col1: 'Llank\'ay',  col2: 'Maskay',    col3: 'Taripaway'   },
  zh: { col1: '工作',        col2: '探索',       col3: '联系'         },
}

/* Links modo oscuro por locale */
const DARK_LINKS: Record<Locale, { work: string; experience: string; blog: string; about: string; playground: string }> = {
  es: { work: 'Misiones',  experience: 'Experiencia', blog: 'Apuntes',   about: 'Operador',    playground: 'Laboratorio'  },
  en: { work: 'Missions',  experience: 'Experience',  blog: 'Logs',      about: 'Readme',      playground: 'Lab'          },
  pt: { work: 'Missões',   experience: 'Experiência', blog: 'Registros', about: 'Readme',      playground: 'Laboratório'  },
  qu: { work: 'Misiones',  experience: 'Experiencia', blog: 'Bitácora',  about: 'Readme',      playground: 'Pukllay'      },
  zh: { work: '使命',       experience: '经历',         blog: '日志',       about: '说明',         playground: '实验室'        },
}

/* Links modo claro por locale */
const LIGHT_LINKS: Record<Locale, { work: string; experience: string; blog: string; about: string; playground: string }> = {
  es: { work: 'Proyectos', experience: 'Experiencia', blog: 'Apuntes',   about: 'Perfil',      playground: 'Laboratorio'  },
  en: { work: 'Work',      experience: 'Experience',  blog: 'Notes',     about: 'About',       playground: 'Lab'          },
  pt: { work: 'Projetos',  experience: 'Experiência', blog: 'Apuntes',   about: 'Perfil',      playground: 'Laboratório'  },
  qu: { work: 'Ruray',     experience: 'Experiencia', blog: 'Qillqa',    about: 'Perfil',      playground: 'Pukllay'      },
  zh: { work: '项目',       experience: '经历',         blog: '笔记',       about: '关于',         playground: '实验室'        },
}

function ModeLink({
  href,
  dark,
  light,
}: {
  href: Parameters<typeof Link>[0]['href']
  dark: string
  light: string
}) {
  return (
    <Link href={href} className="link-accent" style={LINK_STYLE}>
      <span className="n-slot">
        <span className="n-d">{dark}</span>
        <span className="n-l">{light}</span>
      </span>
    </Link>
  )
}

export async function Footer() {
  const [settings, , locale] = await Promise.all([
    getSiteSettings(),
    getTranslations('nav'),
    getLocale() as Promise<Locale>,
  ])

  const text   = settings?.footerText?.[locale] || settings?.footerText?.es || null
  const social = settings?.social
  const year   = new Date().getFullYear()
  const h      = HEADERS[locale]    ?? HEADERS.en
  const dark   = DARK_LINKS[locale] ?? DARK_LINKS.en
  const light  = LIGHT_LINKS[locale] ?? LIGHT_LINKS.en

  return (
    <footer style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}>

      {/* ── Main row ── */}
      <div className="container footer-top" style={{ paddingBlock: '1.5rem' }}>

        {/* Col 1 — Logo + tagline */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <LogoStatic />
          {text && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.55, maxWidth: '22ch' }}>
              {text}
            </p>
          )}
        </div>

        {/* Col 2 — TRABAJO */}
        <div>
          <p className="text-label" style={{ marginBottom: '0.75rem' }}>{h.col1}</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <ModeLink href={{ pathname: '/work' }}       dark={dark.work}       light={light.work}       />
            <ModeLink href={{ pathname: '/experience' }} dark={dark.experience} light={light.experience} />
            <ModeLink href={{ pathname: '/blog' }}       dark={dark.blog}       light={light.blog}       />
          </nav>
        </div>

        {/* Col 3 — EXPLORAR */}
        <div>
          <p className="text-label" style={{ marginBottom: '0.75rem' }}>{h.col2}</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <ModeLink href={{ pathname: '/about' }}      dark={dark.about}      light={light.about}      />
            <ModeLink href={{ pathname: '/playground' }} dark={dark.playground} light={light.playground} />
          </nav>
        </div>

        {/* Col 4 — ENCONTRARME */}
        {social && (
          <div>
            <p className="text-label" style={{ marginBottom: '0.75rem' }}>{h.col3}</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="link-accent" style={LINK_STYLE}>
                  LinkedIn ↗
                </a>
              )}
              {social.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer" className="link-accent" style={LINK_STYLE}>
                  GitHub ↗
                </a>
              )}
              {social.email && (
                <a href={`mailto:${social.email}`} className="link-accent" style={LINK_STYLE}>
                  Correo
                </a>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="container"
        style={{ paddingBlock: '0.75rem', borderTop: 'var(--border-width) solid var(--color-border)' }}
      >
        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', margin: 0 }}>
          © {year} Ever Dávila. All lefts reserved.
        </p>
      </div>
    </footer>
  )
}
