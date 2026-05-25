export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Georgia, serif', background: '#F5F5F2', color: '#111' }}>
        <main style={{
          padding: '4rem 2rem',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '64rem',
          marginInline: 'auto',
        }}>
          <span style={{
            fontSize: 'clamp(5rem, 15vw, 10rem)',
            fontWeight: 400,
            lineHeight: 1,
            color: '#D8D8D8',
            letterSpacing: '-0.04em',
            display: 'block',
            marginBottom: '1.5rem',
            userSelect: 'none',
          }}>
            404
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 400, margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
            Page not found
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6B6B6B', margin: '0 0 2.5rem', lineHeight: 1.6 }}>
            The address you&apos;re looking for doesn&apos;t exist or was moved.
          </p>
          <a href="/" style={{ fontSize: '0.6875rem', color: '#6B6B6B', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ← Back to home
          </a>
        </main>
      </body>
    </html>
  )
}
