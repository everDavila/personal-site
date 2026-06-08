import { getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { PlaygroundItem } from '@/sanity/queries/playground'
import type { Locale } from '@/lib/i18n'
import { localized } from '@/lib/i18n'

const SECTION_DESC: Record<string, { dark: string; light: string }> = {
  es: { dark: 'Experimentos e ideas en construcción.', light: 'Cosas que estoy probando.'   },
  en: { dark: 'Experiments and ideas in progress.',   light: 'Things I\'m trying out.'     },
  pt: { dark: 'Experimentos e ideias em construção.', light: 'Coisas que estou testando.'  },
  qu: { dark: 'Experimentos ukumanta.',               light: 'Ruwasqaykuna.'               },
  zh: { dark: '实验和正在进行的想法。',                   light: '我正在尝试的事物。'              },
}

const VIEW_ALL_LABEL: Record<string, { dark: string; light: string }> = {
  es: { dark: 'Ver todos', light: 'Ver todos' },
  en: { dark: 'View all',  light: 'View all'  },
  pt: { dark: 'Ver todos', light: 'Ver todos' },
  qu: { dark: 'Ver todos', light: 'Ver todos' },
  zh: { dark: '查看全部',    light: '查看全部'   },
}

type Props = { items: PlaygroundItem[] }

export async function LabSection({ items }: Props) {
  if (!items.length) return null

  const locale = await getLocale() as Locale
  const desc    = SECTION_DESC[locale]  ?? SECTION_DESC.en
  const viewAll = VIEW_ALL_LABEL[locale] ?? VIEW_ALL_LABEL.en

  return (
    <section
      className="container section-inner"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <div className="section-cols">

        {/* Sidebar */}
        <div className="section-cols-sidebar">
          <p className="text-label" style={{ margin: 0 }}>Lab</p>
          <div className="section-cols-rule" />
          <p className="section-cols-desc">
            <span className="n-slot">
              <span className="n-d">{desc.dark}</span>
              <span className="n-l">{desc.light}</span>
            </span>
          </p>
          <Link href={{ pathname: '/playground' }} className="section-cols-cta link-accent">
            <span className="n-slot">
              <span className="n-d">{viewAll.dark}</span>
              <span className="n-l">{viewAll.light}</span>
            </span>
            {' →'}
          </Link>
        </div>

        {/* Lista de experimentos */}
        <div className="projects-list">
          {items.map((item, idx) => {
            const title = localized(item.title, locale, 'es')
            const desc  = item.description ? localized(item.description, locale, 'es') : null

            return (
              <Link
                key={item._id}
                href={{ pathname: '/playground/[slug]', params: { slug: item.slugs[locale === 'en' ? 'en' : 'es'] } }}
                className="project-row"
                style={{ display: 'grid', gridTemplateColumns: '2.5rem 1fr auto', alignItems: 'center', gap: '1rem' }}
              >
                <span className="project-row-index" style={{ margin: 0 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div>
                  <p className="project-row-headline" style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: 0 }}>
                    {title.value || '—'}
                  </p>
                  {desc?.value && (
                    <p className="project-row-desc">{desc.value}</p>
                  )}
                </div>

                <span className="project-row-cta-arrow">→</span>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
