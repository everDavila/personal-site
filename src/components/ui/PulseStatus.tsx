import { MoonStar, Footprints, type LucideProps } from 'lucide-react'
import type { Pulse, PulsePage } from '@/sanity/queries/pulse'

type Props = {
  pulse: Pulse | null
  page: PulsePage
  style?: React.CSSProperties
}

const lineStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  letterSpacing: '0.02em',
  lineHeight: 1.7,
  color: 'var(--color-muted)',
  margin: 0,
}

const SEP = ' · '

const fill = (template: string, value: string) => template.replace('{v}', value)

type Icon = (props: LucideProps) => React.ReactNode

function Line({ icon: Icon, head, phrase, style }: {
  icon: Icon
  head: string
  phrase: { dark: string | null; light: string | null }
  style?: React.CSSProperties
}) {
  return (
    <p style={{ ...lineStyle, ...style }}>
      {/* Centrado con la primera línea aunque el texto se parta en mobile */}
      <Icon size={12} strokeWidth={1.5} aria-hidden style={{ flexShrink: 0, marginTop: '0.25rem' }} />
      <span className="n-slot">
        <span className="n-d">{head}{phrase.dark && SEP + phrase.dark}</span>
        <span className="n-l">{head}{phrase.light && SEP + phrase.light}</span>
      </span>
    </p>
  )
}

/** Parte del humor del día: sueño (y pasos en el home). Sin datos frescos, no dice nada. */
export function PulseStatus({ pulse, page, style }: Props) {
  if (!pulse) return null
  const { sleep, steps, labels } = pulse

  if (page === 'contact') {
    if (!sleep) return null
    return <Line icon={MoonStar} head={labels.beforeWriting + SEP + fill(labels.slept, sleep.value)} phrase={sleep.phrase} style={style} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', ...style }}>
      {sleep && <Line icon={MoonStar} head={fill(labels.slept, sleep.value)} phrase={sleep.phrase} />}
      {steps && <Line icon={Footprints} head={fill(labels.walked, steps.value)} phrase={steps.phrase} />}
    </div>
  )
}
