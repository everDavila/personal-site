'use client'

import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

type Props = { value: PortableTextBlock[] }

export function PostBody({ value }: Props) {
  return (
    <div style={{
      fontFamily: 'var(--font-serif)',
      fontSize: 'var(--text-body)',
      lineHeight: 1.8,
      color: 'var(--color-text)',
    }}>
      <PortableText
        value={value}
        components={{
          block: {
            normal: ({ children }) => (
              <p style={{ margin: '0 0 1.25rem' }}>{children}</p>
            ),
            h2: ({ children }) => (
              <h2 style={{
                fontSize: 'var(--text-section)',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                margin: '2.5rem 0 0.75rem',
                color: 'var(--color-text)',
              }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{
                fontSize: 'var(--text-body)',
                fontWeight: 600,
                margin: '2rem 0 0.5rem',
                color: 'var(--color-text)',
              }}>{children}</h3>
            ),
            blockquote: ({ children }) => (
              <blockquote style={{
                borderLeft: '3px solid var(--color-accent)',
                paddingLeft: '1.25rem',
                margin: '1.5rem 0',
                color: 'var(--color-muted)',
                fontStyle: 'italic',
              }}>{children}</blockquote>
            ),
          },
          marks: {
            strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
            em: ({ children }) => <em>{children}</em>,
            code: ({ children }) => (
              <code style={{
                fontFamily: 'monospace',
                fontSize: '0.875em',
                background: 'var(--color-surface)',
                padding: '0.1em 0.35em',
                borderRadius: 'var(--radius)',
              }}>{children}</code>
            ),
            link: ({ value, children }) => (
              <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-accent"
              >
                {children}
              </a>
            ),
          },
          list: {
            bullet: ({ children }) => (
              <ul style={{ paddingLeft: '1.5rem', margin: '0 0 1.25rem' }}>{children}</ul>
            ),
            number: ({ children }) => (
              <ol style={{ paddingLeft: '1.5rem', margin: '0 0 1.25rem' }}>{children}</ol>
            ),
          },
          listItem: {
            bullet: ({ children }) => <li style={{ marginBottom: '0.4rem' }}>{children}</li>,
            number: ({ children }) => <li style={{ marginBottom: '0.4rem' }}>{children}</li>,
          },
        }}
      />
    </div>
  )
}
