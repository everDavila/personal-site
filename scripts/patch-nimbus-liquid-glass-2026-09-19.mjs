/**
 * Patch script — Nimbus: cambio visual a liquid glass
 * 19/09/2026
 *
 * Uso:
 *   node scripts/patch-nimbus-liquid-glass-2026-09-19.mjs
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

async function getTagRef(slug) {
  const id = await client.fetch(
    `*[_type == "logTag" && slug.current == $slug][0]._id`, { slug }
  )
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

async function run() {
  const avance = await getTagRef('avance')

  const now  = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const entry = {
    _key: 'entry-21',
    date: '2026-09-19',
    time,
    dimension: { _type: 'reference', _ref: 'dim-layers' },
    tag: avance,
    description: {
      es: 'Nimbus cambió de piel: liquid glass.\n\nActualicé la interfaz en lo visual. Superficies translúcidas que dejan ver el cielo y el clima de fondo, en lugar de tarjetas que compiten con ellos.\n\nSi el clima es la materia prima, lo mínimo es que la interfaz no lo tape.',
      en: 'Nimbus changed its skin: liquid glass.\n\nI updated the interface visually. Translucent surfaces that let the sky and the weather show through, instead of cards competing with them.\n\nIf the weather is the raw material, the least the interface can do is not cover it up.',
    },
  }

  console.log(`Appending entrada a Nimbus (${time})…`)
  await client.patch('nimbus-experiment').append('logEntries', [entry]).commit()
  console.log('\n✅ Entrada agregada correctamente.')
}

await run()
