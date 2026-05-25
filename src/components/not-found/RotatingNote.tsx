'use client'

import { useState, useEffect } from 'react'

type Props = { notes: string[]; label: string }

export function RotatingNote({ notes, label }: Props) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * Math.max(notes.length, 1)))

  useEffect(() => {
    if (notes.length <= 1) return
    const id = setInterval(() => setIndex(i => (i + 1) % notes.length), 4500)
    return () => clearInterval(id)
  }, [notes.length])

  const note = notes[index] ?? ''

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      padding: '0.875rem clamp(1.5rem, 5vw, 3rem)',
      borderTop: '1px solid #272522',
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: '0.6875rem',
        color: '#5A7C94',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexShrink: 0,
        fontFamily: 'ui-monospace, monospace',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5A7C94', display: 'inline-block', flexShrink: 0 }} />
        {label}
      </span>

      <span style={{ color: '#272522', fontSize: '0.75rem', flexShrink: 0 }}>"</span>

      <span style={{
        fontSize: '0.8125rem',
        color: '#7A7975',
        fontStyle: 'italic',
        flex: 1,
        minWidth: 0,
      }}>
        {note}
      </span>

      <span style={{
        fontSize: '0.6875rem',
        color: '#3A3835',
        fontFamily: 'ui-monospace, monospace',
        letterSpacing: '0.06em',
        marginLeft: 'auto',
        flexShrink: 0,
      }}>
        {index + 1} / {notes.length}
      </span>
    </div>
  )
}
