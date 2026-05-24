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

  // Shared props for the open-arc phases (0 and 1)
  const openStyle = {
    transition: 'stroke-dasharray 500ms ease, opacity 350ms ease',
    opacity: phase === 2 ? 0 : 1,
  }
  const openAttrs = {
    stroke: 'currentColor' as const,
    strokeWidth: '3',
    strokeLinecap: 'square' as const,
    strokeDasharray: phase === 0 ? '200 0' : '8 5',
    style: openStyle,
  }

  return (
    <svg
      viewBox="0 0 32 46"
      width="20"
      height="29"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/*
        Open-arc D (phases 0 & 1) — three separate paths so natural
        gaps exist between the stubs and the arc.

        Top stub  : shorter, aligns left at x=5
        Arc       : M 14 5 → A → 14 38  (rx=13 ry=16.5)
        Bottom stub: longer (x 3→16), sits 4 px below arc end → visible gap
      */}
      <path d="M 5 5 H 14"  {...openAttrs} />
      <path d="M 14 5 A 13 16.5 0 0 1 14 38" {...openAttrs} />
      <path d="M 3 43 H 16" {...openAttrs} />

      {/* Closed arc D (phase 2) — same curve, closed with left bar */}
      <path
        d="M 5 5 L 14 5 A 13 16.5 0 0 1 14 38 L 5 38 Z"
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
