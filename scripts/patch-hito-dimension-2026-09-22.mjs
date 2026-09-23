/**
 * Patch script — reasigna la dimensión de las 7 entradas que usaban "Hito" (dim-zap)
 * como dimensión, ahora que el tag Hito ya cumple ese rol. Ver bitácora del 21-22/09.
 *
 * Uso:
 *   node scripts/patch-hito-dimension-2026-09-22.mjs
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

// docId, entryKey, nueva dimensión, motivo (solo para el log)
const changes = [
  ['diseno-con-contexto-experiment', '4351630d48aa', dim('target'),        'Producto — decisiones de alcance y dirección'],
  ['invitaciones-digitales-express', 'inv-9',        dim('flask-conical'), 'Testing — primera prueba con gente real'],
  ['living-music-experiment',        'entry-10',     dim('code-2'),        'Implementación — primer código funcionando'],
  ['nimbus-experiment',              'entry-7',      dim('target'),        'Producto — capacidad completa del MVP'],
  ['nimbus-experiment',              'entry-8',      dim('cloud'),         'Infraestructura — publicación en URL pública'],
  ['nimbus-experiment',              'entry-23',     dim('target'),        'Producto — resumen del día, toca varias áreas'],
  ['nimbus-experiment',              'entry-38',     dim('route'),         'Proceso — la lección es sobre cómo trabajar'],
]

async function run() {
  for (const [docId, key, dimension, why] of changes) {
    await client
      .patch(docId)
      .set({ [`logEntries[_key=="${key}"].dimension`]: dimension })
      .commit()
    console.log(`✓ ${docId} / ${key} → ${dimension._ref} (${why})`)
  }
  console.log('\n✅ Listo. Las 7 entradas conservan su tag Hito; solo cambió su dimensión.')
}

await run()
