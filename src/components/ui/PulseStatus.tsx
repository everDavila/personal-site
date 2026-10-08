import { Footprints, type LucideProps } from 'lucide-react'
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

// Lucide no trae un "zzz": mismo trazo y grilla 24px para que combine con Footprints
function Zzz({ size = 24, strokeWidth = 2, ...rest }: LucideProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M3 12h7l-7 8h7" />
      <path d="M13 6h5l-5 6h5" />
      <path d="M19 2h3l-3 3.5h3" />
    </svg>
  )
}

// Línea fina entre sueño y pasos
const divider: React.CSSProperties = {
  marginTop: '0.5rem',
  paddingTop: '0.5rem',
  borderTop: 'var(--border-width) solid var(--color-border)',
}

type Icon = (props: LucideProps) => React.ReactNode

function Line({ icon: Icon, parts, phrase, style }: {
  icon: Icon
  parts: string[]
  phrase: { dark: string | null; light: string | null }
  style?: React.CSSProperties
}) {
  const head = parts.join(SEP)
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
    return <Line icon={Zzz} parts={[labels.beforeWriting, labels.lastNight, sleep.value]} phrase={sleep.phrase} style={style} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content', maxWidth: '100%', ...style }}>
      {sleep && <Line icon={Zzz} parts={[labels.lastNight, sleep.value]} phrase={sleep.phrase} />}
      {steps && <Line icon={Footprints} style={sleep ? divider : undefined} parts={[labels.yesterday, `${steps.value} ${labels.steps}`]} phrase={steps.phrase} />}
    </div>
  )
}
