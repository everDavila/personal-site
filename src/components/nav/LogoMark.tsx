'use client'
import { useEffect, useState } from 'react'

export function LogoMark() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setPhase(y < 180 ? 0 : y < 650 ? 1 : 2)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <svg
      viewBox="0 0 32 40"
      width="22"
      height="28"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Arc D — phase 0: solid · phase 1: dashed */}
      <path
        d="M 4 4 L 14 4 A 14 16 0 0 1 14 36 L 4 36"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeDasharray={phase === 0 ? '200 0' : '8 5'}
        style={{
          transition: 'stroke-dasharray 500ms ease, opacity 350ms ease',
          opacity: phase === 2 ? 0 : 1,
        }}
      />
      {/* Rectangle D — phase 2: dotted */}
      <path
        d="M 4 4 L 28 4 L 28 36 L 4 36 L 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeDasharray="2.5 4"
        style={{
          transition: 'opacity 350ms ease',
          opacity: phase === 2 ? 1 : 0,
        }}
      />
    </svg>
  )
}
