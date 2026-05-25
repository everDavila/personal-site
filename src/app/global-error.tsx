'use client'

import { useEffect } from 'react'

type Props = { error: Error & { digest?: string }; reset: () => void }

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

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
            500
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 400, margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#6B6B6B', margin: '0 0 2.5rem', lineHeight: 1.6 }}>
            An unexpected error occurred with the application.
            {error.digest && (
              <span style={{ display: 'block', marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.5 }}>
                ref: {error.digest}
              </span>
            )}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button
              onClick={reset}
              style={{
                fontSize: '0.6875rem',
                color: '#6B6B6B',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: 'none',
                border: '1px solid #D8D8D8',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a href="/" style={{ fontSize: '0.6875rem', color: '#6B6B6B', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ← Home
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
