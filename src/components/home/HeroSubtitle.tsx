'use client'

import { useState, useEffect, useRef } from 'react'

type Props = {
  initial: string
  pool: string[]
  style?: React.CSSProperties
}

export function HeroSubtitle({ initial, pool, style }: Props) {
  const [text, setText] = useState(initial)
  const [opacity, setOpacity] = useState(1)

  const poolRef = useRef(pool)
  const currentRef = useRef(initial)
  currentRef.current = text

  useEffect(() => {
    if (poolRef.current.length <= 1) return

    let t: ReturnType<typeof setTimeout>

    const schedule = () => {
      // Random visible time between 40s and 90s
      const visibleMs = 40_000 + Math.random() * 50_000

      t = setTimeout(() => {
        // Fade out — 300ms
        setOpacity(0)

        t = setTimeout(() => {
          // Swap text — pick anything except current
          const others = poolRef.current.filter(s => s !== currentRef.current)
          const src = others.length > 0 ? others : poolRef.current
          const next = src[Math.floor(Math.random() * src.length)]
          setText(next)

          // Micro pause — 200ms, then fade in
          t = setTimeout(() => {
            setOpacity(1)
            schedule()
          }, 200)
        }, 300)
      }, visibleMs)
    }

    schedule()
    return () => clearTimeout(t)
  }, []) // pool is stable for the component's lifetime

  return (
    <p style={{ ...style, opacity, transition: 'opacity 300ms ease' }}>
      {text}
    </p>
  )
}
