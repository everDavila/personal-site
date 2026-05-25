'use client'

import { useEffect } from 'react'

type Props = { error: Error & { digest?: string }; reset: () => void }

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main style={{
      padding: 'var(--spacing-section) var(--spacing-container)',
      maxWidth: 'var(--max-width)',
      marginInline: 'auto',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <span style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(5rem, 15vw, 10rem)',
        fontWeight: 400,
        lineHeight: 1,
        color: 'var(--color-border)',
        letterSpacing: '-0.04em',
        display: 'block',
        marginBottom: '1.5rem',
        userSelect: 'none',
      }}>
        500
      </span>

      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        color: 'var(--color-text)',
        margin: '0 0 0.75rem',
      }}>
        Something went wrong
      </h1>

      <p style={{
        fontSize: 'var(--text-small)',
        color: 'var(--color-muted)',
        lineHeight: 1.6,
        margin: '0 0 2.5rem',
        maxWidth: '44ch',
      }}>
        An unexpected error occurred. You can try again or go back home.
        {error.digest && (
          <span style={{ display: 'block', marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', opacity: 0.5 }}>
            ref: {error.digest}
          </span>
        )}
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={reset}
          style={{
            fontSize: 'var(--text-label)',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            background: 'none',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            transition: 'border-color var(--transition), color var(--transition)',
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            fontSize: 'var(--text-label)',
            color: 'var(--color-muted)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          ← Home
        </a>
      </div>
    </main>
  )
}
