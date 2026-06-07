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
        @keyframes body-breathe {
          0%, 100% { transform: scaleX(1)    scaleY(1); }
          40%, 60% { transform: scaleX(1.012) scaleY(1.018); }
        }
        #body-frame {
          animation: body-breathe 5s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center 30%;
        }
        @keyframes head-look {
          0%,  25% { transform: rotateZ(0deg); }
          35%, 48% { transform: rotateZ(-10deg); }
          58%, 70% { transform: rotateZ(8deg); }
          82%, 100%{ transform: rotateZ(0deg); }
        }
        #head-frame {
          animation: head-look 16s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center bottom;
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
          style={{
            position: 'fixed',
            insetInline: 0,
            top: 0,
            zIndex: 50,
            background: '#0F0F0D',
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
              <svg
                width="404" height="349" viewBox="0 -12 404 349" fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ maxWidth: '72%', height: 'auto' }}
                aria-hidden="true"
              >
                <g id="personaje-mantenimiento">
                  <g id="ground-frame">
                    <g id="Group 1">
                      <path d="M0.879234 307.933C3.27923 308.2 7.5459 308.2 10.2126 307.933C13.0126 307.667 11.1459 307.4 5.9459 307.4C0.879234 307.4 -1.38743 307.667 0.879234 307.933Z" fill="white"/>
                      <path d="M331.679 307.933C334.746 308.2 339.546 308.2 342.346 307.933C345.013 307.667 342.479 307.4 336.613 307.4C330.746 307.4 328.479 307.667 331.679 307.933Z" fill="white"/>
                      <path d="M397.013 307.933C398.613 308.2 401.279 308.2 403.013 307.933C404.613 307.667 403.279 307.4 399.946 307.4C396.613 307.4 395.279 307.667 397.013 307.933Z" fill="white"/>
                      <path d="M54.8792 329.267C52.4792 330.2 54.3459 332.333 57.4126 332.333C59.0126 332.333 59.9459 331.667 59.6792 330.733C59.0126 328.867 57.2792 328.333 54.8792 329.267Z" fill="white"/>
                      <path d="M370.613 335C370.613 335.667 372.479 336.333 374.613 336.333C376.879 336.333 378.613 335.667 378.613 335C378.613 334.2 376.879 333.667 374.613 333.667C372.479 333.667 370.613 334.2 370.613 335Z" fill="white"/>
                    </g>
                  </g>
                  <g id="head-frame">
                    <path id="head" d="M225.064 1.50091C243.598 -2.63243 265.598 1.90091 281.731 13.5009C299.865 26.3009 310.931 45.2341 314.531 68.8339C315.331 73.6339 316.131 79.6346 316.531 82.1679C317.064 85.7676 316.531 88.0339 313.864 91.9003C311.998 94.7002 310.398 97.6338 310.397 98.5673C310.397 101.234 303.998 114.034 299.731 120.034C295.865 125.367 279.998 139.501 273.864 143.101C272.264 144.034 269.731 144.701 268.131 144.834C266.531 144.834 264.531 146.034 263.731 147.501C262.531 149.768 260.931 150.168 254.131 150.168H246.131L246.397 151.368C231.728 146.835 218.875 139.638 207.18 131.396C207.687 131.383 207.731 131.03 207.731 130.435C207.731 129.768 203.065 125.9 197.465 121.9C188.749 115.712 185.559 113.512 184.395 113.364C182.787 111.987 181.193 110.613 179.615 109.245L179.731 109.101L175.731 101.367C170.531 91.2338 167.331 76.1671 168.531 67.1005C172.798 33.634 194.398 8.43427 225.064 1.50091ZM259.731 6.1679C248.931 3.10124 240.931 2.30092 232.265 3.50091C205.331 7.36757 184.665 24.9676 175.731 51.5009C173.331 58.7009 172.931 62.4346 173.331 74.1679C173.731 86.4339 174.265 89.1008 177.598 95.9003C181.731 103.9 191.464 114.301 200.397 120.435C203.331 122.301 209.464 127.368 213.864 131.501C223.464 140.434 231.064 144.3 241.064 145.634L248.265 146.567L242.665 140.168C233.598 129.768 232.532 120.834 238.932 108.701C245.332 96.4344 246.398 94.967 252.665 89.9003C270.532 74.9673 293.332 70.968 306.932 80.1679C313.064 84.3009 313.331 84.3007 312.798 79.7675C312.531 76.7008 311.331 75.767 305.731 73.9003C290.798 68.8337 271.865 72.3007 257.465 82.8339C252.798 86.1671 249.065 88.3006 249.064 87.5009C249.064 85.6342 259.331 78.3007 267.331 74.5673C280.131 68.7007 297.331 67.6347 308.131 72.1679C309.997 72.9679 310.397 72.434 310.397 68.5673C310.397 60.5673 305.597 46.4337 299.864 37.6337C289.731 22.1674 275.064 10.7013 259.731 6.1679ZM275.064 80.8339C277.731 76.5675 261.865 84.5677 254.265 91.2343C239.998 104.034 233.731 121.101 239.465 132.435C243.065 139.501 250.798 146.168 255.465 146.168C258.665 146.168 258.531 145.9 253.331 143.367C245.465 139.5 240.798 132.967 239.998 124.834C239.465 119.501 240.131 116.7 243.331 109.9C245.464 105.234 248.931 99.5005 251.064 97.1005C255.065 92.4338 269.731 82.1679 272.531 82.1679C273.465 82.1679 274.664 81.5006 275.064 80.8339ZM309.064 88.4345C309.064 83.2346 306.665 86.7007 305.998 92.8339C304.798 102.434 297.598 116.168 289.331 124.435C281.731 132.034 275.198 136.034 263.731 139.634C256.665 141.767 256.665 141.901 261.198 142.034C271.865 142.3 292.798 126.567 301.198 111.9C305.198 104.967 309.064 93.5012 309.064 88.4345ZM251.198 105.367C254.798 99.2341 255.065 96.3013 251.465 100.435C248.398 104.168 245.064 109.901 245.064 111.501C245.064 114.034 247.598 111.5 251.198 105.367ZM301.598 90.1679C300.531 90.168 299.731 90.9676 299.731 91.7675C299.731 92.7009 299.332 94.8345 298.932 96.4345C297.598 101.501 300.531 99.9005 301.998 94.8339C303.198 90.9675 303.198 90.1679 301.598 90.1679Z" fill="white"/>
                  </g>
                  <g id="body-frame">
                    <path id="body" d="M178.576 106.312C180.54 108.216 182.594 110.106 184.742 111.979C187.241 115.723 195.117 122.029 200.879 124.467C200.951 124.498 201.024 124.528 201.095 124.559C204.262 126.713 207.581 128.825 211.058 130.89C209.742 130.32 208.579 129.892 207.679 129.667C199.412 127.4 191.679 122.6 185.546 115.667C182.613 112.334 179.945 109.667 179.412 109.667C179.012 109.668 178.612 111.801 178.612 114.333C178.612 117.933 177.546 119.933 174.346 123L169.946 127.134L173.946 126.866C180.212 126.6 181.545 126.867 180.612 128.333C180.212 129 178.346 129.667 176.479 129.667C168.479 129.667 164.346 135.934 159.946 153.934C156.346 169 155.012 198.999 157.679 206.333C159.545 211.533 159.812 211.667 167.412 212.733C172.212 213.267 176.479 213.133 178.346 212.333C180.079 211.666 182.613 211 183.946 211C185.413 211 186.612 210.866 186.612 210.6C186.746 210.462 187.28 200.73 187.946 189C188.88 170.201 190.746 158.734 192.612 160.6C193.012 160.866 192.613 166.2 191.946 172.467C191.28 178.6 190.612 189 190.612 195.4C190.612 203.267 189.946 208.467 188.612 211C186.746 214.6 186.746 215.4 188.612 219C191.679 225 191.146 230.6 187.279 233.134C185.413 234.334 183.946 236.334 183.946 237.667C183.946 241.267 179.546 244.333 174.346 244.333H169.546L170.213 261.267C170.613 270.733 171.546 279.399 172.213 280.6C172.879 282.066 172.879 283.933 171.946 285.533C170.88 287.533 171.146 288.734 172.879 290.467C174.879 292.333 177.012 292.6 188.612 291.8C205.811 290.6 215.144 288.334 215.679 285.134C215.945 283.8 215.679 282.333 215.013 281.8C214.479 281.4 214.212 271.533 214.612 259.8L215.279 238.6L219.679 238.333C224.612 237.933 225.145 239.267 221.145 241.934C218.612 243.534 218.212 245.401 217.546 257.267C217.279 264.6 217.413 274.733 217.946 279.533L218.879 288.333H226.346C230.479 288.333 236.212 287.533 239.145 286.467L244.213 284.733L244.079 256.866C243.946 240.6 243.279 228.467 242.479 227.533C241.546 226.333 241.679 224.067 242.612 220.2C244.612 213.134 245.013 192.333 243.546 172.6C242.746 162.333 242.879 157.667 243.812 157.667C244.612 157.667 245.279 158.6 245.279 159.934C245.279 161.133 245.679 161.8 246.079 161.267C247.054 160.291 243.459 148.059 241.715 145.97C243.404 146.654 245.12 147.328 246.862 147.991L247.145 149.267C251.145 167.667 254.479 208.734 252.079 210.2C251.013 210.867 250.746 213.667 251.412 218.866C252.079 225 251.679 227.533 249.679 231.8C247.412 236.466 247.145 239.8 247.145 262.866L247.279 288.6L252.213 291.134C257.946 294.067 261.279 298.333 261.279 302.6C261.279 305.266 262.079 305.666 266.346 305.8C269.012 305.933 281.146 306.467 293.279 307L315.279 307.8L287.546 308.066C270.881 308.2 260.081 308.867 260.612 309.533C261.946 311.667 256.213 312.6 242.213 312.2C231.413 312.067 227.679 312.467 224.213 314.333C220.346 316.333 217.812 316.467 206.879 315.667C199.679 315.134 189.812 314.867 184.612 315C179.546 315.133 171.412 314.734 166.612 314.2C158.079 313.267 157.946 313.267 161.946 311.533C165.412 310.067 160.211 309.8 126.079 309.667C104.082 309.667 86.4844 309.4 86.746 309.134C87.0127 308.867 105.546 308.2 127.812 307.8C150.212 307.266 168.879 306.6 169.279 306.333C170.746 305.399 170.745 293.4 169.145 291.533C168.346 290.6 167.946 288.2 168.079 286.066C168.346 284.066 168.079 273.8 167.412 263.267C166.345 244.867 166.212 244.2 162.612 241.267C156.612 236.2 155.546 232.866 156.479 222.866C157.013 216.467 156.746 212.6 155.279 209.134C150.346 197.534 154.213 153.933 161.279 138.733C166.879 127 170.346 120.867 172.479 119.134C173.679 118.2 174.612 115.933 174.612 114.333C174.612 112.733 175.813 109.8 177.279 107.934L178.576 106.312ZM207.013 292.467C205.679 292.6 197.679 293.4 189.279 294.2L173.946 295.667L173.546 301.267C172.879 309.8 173.012 309.8 207.679 310.2C221.279 310.334 223.013 310.066 224.746 307.8C227.413 304.2 227.145 303.4 222.612 298.733C219.279 295.4 217.679 294.867 213.946 295.267C210.746 295.667 209.279 295.266 209.279 294.066C209.279 293.133 208.212 292.467 207.013 292.467ZM217.946 291L223.013 295.134C225.679 297.4 228.346 301 229.013 303.4L230.079 307.667H241.013C250.346 307.667 252.213 307.266 254.746 304.866C258.746 300.866 257.012 296.734 250.213 293.667C246.08 291.8 244.079 291.533 242.079 292.6C240.079 293.666 239.279 293.667 238.879 292.467C238.612 291.533 234.613 291 228.213 291H217.946ZM181.412 215.267C180.211 215.4 175.146 215.8 169.946 216.2L160.612 217L160.213 224.6C159.946 230.866 160.213 232.333 161.946 232.333C163.013 232.333 163.946 233.533 163.946 234.866C163.946 237.933 166.079 239.667 167.279 237.667C167.946 236.734 168.879 237 170.079 238.6C171.546 240.599 172.079 240.733 173.145 239.134C174.212 237.534 174.746 237.533 176.479 238.866C179.546 241.4 181.279 239.533 181.279 233.533C181.279 228.6 181.412 228.334 184.612 229.134C187.412 229.8 187.946 229.533 187.946 227.134C187.946 225.667 186.879 222.334 185.679 219.667C184.345 217 182.612 215.133 181.412 215.267ZM247.946 219.667C247.146 219.134 246.612 220.734 246.612 223.667C246.612 226.6 247.146 228.2 247.946 227.667C248.746 227.267 249.279 225.4 249.279 223.667C249.279 221.934 248.746 220.067 247.946 219.667ZM248.079 196.866C247.946 205.133 248.346 208.467 249.279 207.533C250.212 206.6 250.346 202.6 249.546 195.533L248.346 185L248.079 196.866ZM183.812 123.267C184.612 123 188.079 125 191.412 127.667C194.879 130.2 199.279 132.733 201.145 133.267C207.145 134.733 222.613 141.4 226.479 144.333C231.013 147.533 233.279 147.8 233.279 145C233.279 143.934 232.746 143 232.213 143C231.546 143 227.146 140.334 222.213 137.134C222.056 137.025 221.896 136.918 221.735 136.81C227.758 139.927 234.193 142.902 241.065 145.707C240.448 145.922 239.756 147.007 239.279 148.2C237.813 152.867 233.812 152.333 224.479 146.2C219.679 143 211.412 139 206.079 137.4C197.012 134.467 180.746 124.333 183.812 123.267Z" fill="white"/>
                  </g>
                </g>
              </svg>
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
