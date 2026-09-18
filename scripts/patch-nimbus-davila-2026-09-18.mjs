/**
 * Patch script — Nimbus v1.0 pública + davila.uno soporte video en bitácora
 * 18/09/2026
 *
 * Uso:
 *   node scripts/patch-nimbus-davila-2026-09-18.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const envPath = resolve(process.cwd(), '.env.local')
const envVars = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#') && l.trim())
    .map(l => {
      const idx = l.indexOf('=')
      const key = l.slice(0, idx).trim()
      const val = l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
      return [key, val]
    })
)

const client = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'n69em314',
  dataset:   envVars.NEXT_PUBLIC_SANITY_DATASET   ?? 'production',
  token:     envVars.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const dim = (icon) => ({ _type: 'reference', _ref: `dim-${icon}` })

async function getTagRef(slug) {
  const id = await client.fetch(
    `*[_type == "logTag" && slug.current == $slug][0]._id`, { slug }
  )
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

async function run() {
  const [hito, completado] = await Promise.all([
    getTagRef('hito'),
    getTagRef('completado'),
  ])

  console.log('Appending entrada a Nimbus…')
  await client
    .patch('nimbus-experiment')
    .append('logEntries', [{
      _key: 'entry-8',
      date: '2026-09-18',
      time: '01:15',
      dimension: dim('zap'),
      tag: hito,
      description: {
        es: 'Primera publicación en una URL pública — v1.0 de Nimbus ya está disponible para cualquiera que quiera probarlo.',
        en: 'First publication on a public URL — Nimbus v1.0 is now available for anyone to try.',
      },
    }])
    .commit()

  console.log('Appending entrada a davila.uno…')
  await client
    .patch('davila-uno-site')
    .append('logEntries', [{
      _key: 'duno-9',
      date: '2026-09-18',
      time: '01:15',
      dimension: dim('code-2'),
      tag: completado,
      description: {
        es: 'Agregamos soporte para adjuntar capturas de pantalla y videos cortos en las entradas de la bitácora — el mismo lightbox ahora reproduce video con controles nativos además de mostrar imágenes.',
        en: 'Added support for attaching screenshots and short videos to log entries — the same lightbox now plays video with native controls in addition to showing images.',
      },
    }])
    .commit()

  console.log('\n✅ Entradas agregadas correctamente.')
}

await run()
