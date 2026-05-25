'use client'

import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

type Props = { value: PortableTextBlock[] }

export function PostBody({ value }: Props) {
  return (
    <div className="post-body">
      <PortableText
        value={value}
        components={{
          block: {
            normal: ({ children }) => (
              <p style={{ margin: '0 0 1.5rem', lineHeight: 1.8 }}>{children}</p>
            ),
            h2: ({ children }) => (
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                margin: '3rem 0 1rem',
                color: 'var(--color-text)',
              }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-small)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '2.5rem 0 0.75rem',
                color: 'var(--color-muted)',
              }}>{children}</h3>
            ),
            blockquote: ({ children }) => (
              <blockquote style={{
                borderLeft: '2px solid var(--color-accent)',
                paddingLeft: '1.5rem',
                margin: '2rem 0',
                color: 'var(--color-muted)',
                fontStyle: 'italic',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.125rem',
                lineHeight: 1.7,
              }}>{children}</blockquote>
            ),
          },
          marks: {
            strong: ({ children }) => (
              <strong style={{ fontWeight: 600, color: 'var(--color-text)' }}>{children}</strong>
            ),
            em: ({ children }) => (
              <em style={{ fontStyle: 'italic' }}>{children}</em>
            ),
            code: ({ children }) => (
              <code style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85em',
                background: 'var(--color-surface)',
                padding: '0.15em 0.4em',
                borderRadius: 'var(--radius)',
                letterSpacing: '0',
              }}>{children}</code>
            ),
            link: ({ value, children }) => (
              <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
                style={{ textDecoration: 'underline', textDecorationColor: 'var(--color-border)' }}
              >
                {children}
              </a>
            ),
          },
          list: {
            bullet: ({ children }) => (
              <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.5rem', listStyleType: 'disc' }}>{children}</ul>
            ),
            number: ({ children }) => (
              <ol style={{ paddingLeft: '1.25rem', margin: '0 0 1.5rem' }}>{children}</ol>
            ),
          },
          listItem: {
            bullet: ({ children }) => (
              <li style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>{children}</li>
            ),
            number: ({ children }) => (
              <li style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>{children}</li>
            ),
          },
        }}
      />
    </div>
  )
}
