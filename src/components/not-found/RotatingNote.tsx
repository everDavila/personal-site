'use client'

import { useState, useEffect } from 'react'

type Props = { notes: string[] }

export function RotatingNote({ notes }: Props) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * Math.max(notes.length, 1)))

  useEffect(() => {
    if (notes.length <= 1) return
    const id = setInterval(() => setIndex(i => (i + 1) % notes.length), 4500)
    return () => clearInterval(id)
  }, [notes.length])

  const note = notes[index] ?? ''
  if (!note) return null

  return (
    <p style={{
      fontSize: '0.8125rem',
      color: '#4A4845',
      fontStyle: 'italic',
      lineHeight: 1.6,
      margin: 0,
      borderLeft: '1px solid #272522',
      paddingLeft: '1rem',
    }}>
      {note}
    </p>
  )
}
