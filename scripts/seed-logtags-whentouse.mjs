/**
 * Migración — agrega campo whenToUse a los 13 logTags existentes.
 *
 * Uso:
 *   node scripts/seed-logtags-whentouse.mjs
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

const WHEN_TO_USE = {
  hipotesis:  'El "¿y si…?" sin confirmar todavía',
  decision:   'Una elección tomada que cambió el rumbo',
  exploracion:'Investigación, referencias, pruebas abiertas',
  avance:     'Progreso notable, algo que funcionó',
  completado: 'Algo definitivamente cerrado y terminado',
  leccion:    'Algo aprendido — de un error o de un acierto',
  hito:       'Milestone alcanzado, momento que merece destacarse',
  fallo:      'Intenté algo, no funcionó — es información, no vergüenza',
  pivote:     'Cambié de dirección significativa, implica descartar lo anterior',
  insight:    'Revelación repentina — distinto de Lección, que es reflexiva',
  duda:       'Pregunta abierta sin resolver, bloqueo intelectual',
  pausa:      'El proyecto se detiene — explica silencios en el timeline',
  validacion: 'Confirmado con usuarios reales o datos',
}

const tags = await client.fetch(`*[_type == "logTag"]{ _id, "slug": slug.current }`)

console.log(`Actualizando ${tags.length} tags…`)
for (const tag of tags) {
  const whenToUse = WHEN_TO_USE[tag.slug]
  if (!whenToUse) {
    console.log(`  ⚠ sin definición para: ${tag.slug}`)
    continue
  }
  await client.patch(tag._id).set({ whenToUse }).commit()
  console.log(`  ✓ ${tag.slug} — ${whenToUse}`)
}

console.log('\n✅ Listo.')
