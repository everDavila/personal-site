import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Apuntes'
  const date  = searchParams.get('date')  ?? ''

  const truncated = title.length > 90 ? title.slice(0, 90) + '…' : title

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F0F0D',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px 72px',
        }}
      >
        {/* Top: site label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: 11,
            color: '#7A7975',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}>
            Ever Dávila
          </span>
          <span style={{ color: '#2E2E2B', fontSize: 11, fontFamily: 'monospace' }}>—</span>
          <span style={{
            fontSize: 11,
            color: '#5A7C94',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}>
            Apuntes
          </span>
        </div>

        {/* Center: title */}
        <div style={{
          fontSize: 70,
          fontWeight: 400,
          color: '#F0EFEC',
          fontFamily: 'Georgia, "Times New Roman", serif',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          maxWidth: '88%',
        }}>
          {truncated}
        </div>

        {/* Bottom: date + domain */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {date && (
            <span style={{
              fontSize: 11,
              color: '#7A7975',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              {date}
            </span>
          )}
          <span style={{
            fontSize: 11,
            color: '#3A3A37',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            davila.uno
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
