type Props = { text: string }

export function Philosophy({ text }: Props) {
  return (
    <section
      className="container section"
      style={{ borderTop: 'var(--border-width) solid var(--color-border)' }}
    >
      <p style={{
        fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
        lineHeight: 1.6,
        color: 'var(--color-text)',
        maxWidth: '40ch',
        margin: 0,
        fontWeight: 400,
        letterSpacing: '-0.01em',
      }}>
        {text}
      </p>
    </section>
  )
}
