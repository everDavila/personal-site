'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { LogoMark } from '@/components/nav/LogoMark'

const content = {
  en: {
    nav: 'UX/UI & Digital Systems',
    headline: 'Currently\nuntangling things.',
    body: [
      'The site is being rebuilt.',
      'Some systems are being simplified.\nOthers are being questioned.',
      'Back soon.',
    ],
    contactPrefix: "If it matters, find me on",
    contactMid: 'or email me to',
    footer: 'Designing systems with intention.',
  },
  es: {
    nav: 'UX/UI & Sistemas Digitales',
    headline: 'Ordenando\nel caos.',
    body: [
      'El sitio está siendo reconstruido.',
      'Algunos sistemas están siendo simplificados.\nOtros están siendo cuestionados.',
      'Vuelvo pronto.',
    ],
    contactPrefix: 'Si realmente importa, puedes encontrarme en',
    contactMid: 'o escribir a',
    footer: 'Diseñando sistemas con intención.',
  },
} as const

type Lang = keyof typeof content

export default function MaintenancePage() {
  const [lang, setLang] = useState<Lang>('es')

  useEffect(() => {
    const detected = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
    setLang(detected)
  }, [])

  const t = content[lang]
  const other: Lang = lang === 'es' ? 'en' : 'es'

  return (
    <>
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .m-cursor {
          display: inline-block;
          width: 2px;
          height: 0.82em;
          background: currentColor;
          margin-left: 3px;
          vertical-align: text-bottom;
          animation: cursor-blink 1.1s step-end infinite;
        }
        .m-link {
          color: inherit;
          text-decoration-color: rgba(232,229,223,0.3);
          text-underline-offset: 3px;
          transition: opacity 200ms;
        }
        .m-link:hover { opacity: 0.65; }
        .m-lang-btn { transition: opacity 200ms; }
        .m-lang-btn:hover { opacity: 1 !important; }
        @media (max-width: 768px) {
          .m-grid { grid-template-columns: 1fr !important; }
          .m-image { display: none !important; }
          .m-image-mobile { display: flex !important; }
        }
        .m-image-mobile { display: none; }
      `}</style>

      <div style={{
        background: '#0F0F0D',
        color: '#E8E5DF',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-inter, system-ui, sans-serif)',
      }}>

        {/* Header */}
        <header
          className="nav-glass"
          style={{
            position: 'fixed',
            insetInline: 0,
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBlock: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <LogoMark />
              <span style={{ opacity: 0.3 }}>•</span>
              <span style={{ opacity: 0.55 }}>{t.nav}</span>
            </div>
            <button
              className="m-lang-btn"
              onClick={() => setLang(other)}
              style={{
                background: 'none',
                border: 'none',
                color: '#E8E5DF',
                opacity: 0.35,
                cursor: 'pointer',
                fontSize: '0.6875rem',
                fontFamily: 'ui-monospace, monospace',
                letterSpacing: '0.1em',
                padding: '0.25rem 0.5rem',
              }}
            >
              {other.toUpperCase()}
            </button>
          </div>
        </header>

        {/* Content */}
        <main
          className="m-grid"
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            padding: 'clamp(3rem, 8vw, 6rem) 3rem',
            paddingTop: 'calc(3.5rem + clamp(3rem, 8vw, 6rem))',
            maxWidth: '82rem',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            alignItems: 'center',
          }}
        >
          {/* Left: text */}
          <div>
            <div className="m-image-mobile" style={{
              justifyContent: 'center',
              marginBottom: '2rem',
            }}>
              <Image
                src="/mantenimiento-mobile.jpg"
                alt=""
                width={400}
                height={300}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  filter: 'invert(1)',
                  mixBlendMode: 'screen',
                  opacity: 0.9,
                }}
                priority
              />
            </div>

            <h1 style={{
              fontFamily: 'var(--font-source-serif, Georgia, serif)',
              fontSize: 'clamp(2.75rem, 5vw, 4.5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '2.5rem',
              whiteSpace: 'pre-line',
            }}>
              {t.headline}<span className="m-cursor" />
            </h1>

            <div style={{
              width: '2rem',
              height: '1px',
              background: '#5A7C94',
              marginBottom: '2.5rem',
            }} />

            <div style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.875rem',
              lineHeight: 1.9,
              opacity: 0.7,
            }}>
              {t.body.map((para, i) => (
                <p key={i} style={{ marginBottom: '1.25rem', whiteSpace: 'pre-line' }}>
                  {para}
                </p>
              ))}
            </div>

            <div style={{
              borderTop: '1px dashed rgba(232,229,223,0.12)',
              paddingTop: '2rem',
              marginTop: '0.75rem',
              display: 'flex',
              gap: '0.875rem',
              alignItems: 'flex-start',
            }}>
              <svg
                width="15" height="15" viewBox="0 0 16 16" fill="none"
                style={{ opacity: 0.45, marginTop: '0.3rem', flexShrink: 0 }}
                aria-hidden="true"
              >
                <circle cx="8" cy="12.5" r="1.5" fill="currentColor" />
                <path d="M4.5 9a4.95 4.95 0 0 1 7 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                <path d="M1.5 6a8.485 8.485 0 0 1 13 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              <p style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.8125rem',
                lineHeight: 1.9,
                opacity: 0.6,
                margin: 0,
              }}>
                {t.contactPrefix}{' '}
                <a
                  href="https://www.linkedin.com/in/ever-davila/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m-link"
                >
                  LinkedIn
                </a>
                <br />
                {t.contactMid}{' '}
                <a href="mailto:hello@davila.uno" className="m-link">
                  hello@davila.uno
                </a>
                .
              </p>
            </div>
          </div>

          {/* Right: image — reemplazar src con la ilustración final */}
          <div
            className="m-image"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/mantenimiento.jpg"
              alt=""
              width={500}
              height={600}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                height: 'auto',
                width: 'auto',
                filter: 'invert(1)',
                mixBlendMode: 'screen',
                opacity: 0.9,
              }}
              priority
            />
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          padding: '1.25rem 3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.6875rem',
          fontFamily: 'ui-monospace, monospace',
          opacity: 0.35,
          borderTop: '1px solid rgba(232,229,223,0.06)',
          letterSpacing: '0.02em',
        }}>
          <span>© 2026 Ever Dávila</span>
          <span>•</span>
          <span>{t.footer}</span>
        </footer>
      </div>
    </>
  )
}
