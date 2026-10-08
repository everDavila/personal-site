import type { Pulse, PulsePage } from '@/sanity/queries/pulse'

type Props = {
  pulse: Pulse | null
  page: PulsePage
  style?: React.CSSProperties
}

const lineStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  letterSpacing: '0.02em',
  lineHeight: 1.7,
  color: 'var(--color-muted)',
  margin: 0,
}

const SEP = ' · '

function Line({ parts, phrase }: { parts: string[]; phrase: { dark: string | null; light: string | null } }) {
  const head = parts.join(SEP)
  return (
    <span className="n-slot">
      <span className="n-d">{head}{phrase.dark && SEP + phrase.dark}</span>
      <span className="n-l">{head}{phrase.light && SEP + phrase.light}</span>
    </span>
  )
}

/** Parte del humor del día: sueño (y pasos en el home). Sin datos frescos, no dice nada. */
export function PulseStatus({ pulse, page, style }: Props) {
  if (!pulse) return null
  const { sleep, steps, labels } = pulse

  if (page === 'contact') {
    if (!sleep) return null
    return (
      <p style={{ ...lineStyle, ...style }}>
        <Line parts={[labels.beforeWriting, labels.lastNight, sleep.value]} phrase={sleep.phrase} />
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {sleep && (
        <p style={lineStyle}>
          <Line parts={[labels.lastNight, sleep.value]} phrase={sleep.phrase} />
        </p>
      )}
      {steps && (
        <p style={lineStyle}>
          <Line parts={[labels.yesterday, `${steps.value} ${labels.steps}`]} phrase={steps.phrase} />
        </p>
      )}
    </div>
  )
}
