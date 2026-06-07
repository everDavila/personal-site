import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

type Props = { dark: string; light: string }

export async function Philosophy({ dark, light }: Props) {
  const t = await getTranslations('home')

  function Paragraphs({ text, className }: { text: string; className: string }) {
    const paras = text.split(/\n\n+/).filter(Boolean)
    return (
      <div className={className}>
        {paras.map((para, i) => (
          <p key={i} className="philosophy-para" style={{ whiteSpace: 'pre-line' }}>{para}</p>
        ))}
      </div>
    )
  }

  return (
    <Link href={{ pathname: '/about' }} className="philosophy-link">
      <section className="container philosophy-section">
        <div className="philosophy-grid">

          <div className="philosophy-label-col">
            <p className="text-label" style={{ margin: 0 }}>{t('philosophy_label')}</p>
          </div>

          <div className="philosophy-text-col">
            <div className="n-slot">
              <Paragraphs text={dark}  className="n-d" />
              <Paragraphs text={light} className="n-l" />
            </div>
          </div>

        </div>
      </section>
    </Link>
  )
}
