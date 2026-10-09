import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { fetchPulseFromSource } from '@/lib/pulse/source'

// Lo llama Vercel Cron una vez al día. Vercel manda `Authorization: Bearer $CRON_SECRET`.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }

  const snapshot = await fetchPulseFromSource()
  if (!snapshot) {
    return Response.json({ ok: false, reason: 'no-source' }, { status: 503 })
  }

  // Token de escritura propio, separado del SANITY_TOKEN de los scripts de seed
  const token = process.env.SANITY_PULSE_TOKEN
  if (!token) {
    return Response.json({ ok: false, reason: 'no-write-token', snapshot }, { status: 500 })
  }

  const writer = createClient({ projectId, dataset, apiVersion, token, useCdn: false })
  await writer.createOrReplace({ _id: 'pulseSnapshot', _type: 'pulseSnapshot', ...snapshot })

  return Response.json({ ok: true, snapshot })
}
