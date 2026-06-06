'use client'

import { useState, useEffect } from 'react'

type Props = { notes: string[] }

export function RotatingNote({ notes }: Props) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const initial = Math.floor(Math.random() * Math.max(notes.length, 1))
    setIndex(initial)
    if (notes.length <= 1) return
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % notes.length)
        setVisible(true)
      }, 400)
    }, 9000)
    return () => clearInterval(id)
  }, [notes.length])

  const note = notes[index] ?? ''
  if (!note) return null

  return (
    <p style={{
      fontSize: '0.8125rem',
      color: '#7A7775',
      fontStyle: 'italic',
      lineHeight: 1.6,
      margin: 0,
      borderLeft: '1px solid #3A3835',
      paddingLeft: '1rem',
      opacity: visible ? 1 : 0,
      transition: 'opacity 400ms ease',
    }}>
      {note}
    </p>
  )
}
