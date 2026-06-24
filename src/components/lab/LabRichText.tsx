'use client'

import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

export function LabRichText({ value }: { value: PortableTextBlock[] }) {
  return (
    <PortableText
      value={value}
      components={{
        block: {
          normal: ({ children }) => (
            <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--color-text)', opacity: 0.8, margin: '0 0 1rem' }}>{children}</p>
          ),
          h2: ({ children }) => (
            <h3 style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.625rem',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              margin: '2rem 0 0.75rem',
            }}>{children}</h3>
          ),
        },
        marks: {
          strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
          em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
        },
        list: {
          bullet: ({ children }) => (
            <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.25rem', listStyleType: 'disc' }}>{children}</ul>
          ),
          number: ({ children }) => (
            <ol style={{ paddingLeft: '1.25rem', margin: '0 0 1.25rem' }}>{children}</ol>
          ),
        },
        listItem: {
          bullet: ({ children }) => (
            <li style={{ marginBottom: '0.375rem', lineHeight: 1.75, fontSize: '1rem', color: 'var(--color-text)', opacity: 0.8 }}>{children}</li>
          ),
          number: ({ children }) => (
            <li style={{ marginBottom: '0.375rem', lineHeight: 1.75, fontSize: '1rem', color: 'var(--color-text)', opacity: 0.8 }}>{children}</li>
          ),
        },
      }}
    />
  )
}
