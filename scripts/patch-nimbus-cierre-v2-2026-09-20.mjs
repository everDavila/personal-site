/**
 * Patch script — Nimbus 20/09/2026 22:30: reescribe el cierre de v2 estable en tono narrativo
 *
 * Uso:
 *   node scripts/patch-nimbus-cierre-v2-2026-09-20.mjs
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

await client
  .patch('nimbus-experiment')
  .set({
    'logEntries[_key=="entry-38"].description': {
      es: 'Nimbus llegó a una versión que por fin puedo llamar estable. No porque esté terminado, sino porque ya puedo tocar algo sin preguntarme qué otra cosa acabo de romper.\n\nEn el camino terminé con dos carpetas, dos ramas y dos Claude trabajando cada uno donde mejor le parecía. Funcionó sorprendentemente bien hasta que dejó de hacerlo. Así que ordené la casa, arreglé un par de cosas que venía arrastrando y dejé una sola forma de trabajar.\n\nAhora puedo volver a lo importante: terminar de darle una cara propia a Nimbus. Lima, la playa, sus poses y todo eso que todavía no sale de una prueba automática.\n\nEso me toca dibujarlo a mí.',
      en: 'Nimbus reached a version I can finally call stable. Not because it’s finished, but because I can touch something without wondering what else I just broke.\n\nAlong the way I ended up with two folders, two branches and two Claudes, each working wherever it saw fit. It worked surprisingly well until it stopped working. So I tidied the house, fixed a couple of things I’d been dragging along and left a single way of working.\n\nNow I can go back to what matters: finishing giving Nimbus a face of its own. Lima, the beach, its poses and everything that still doesn’t come out of an automated test.\n\nThose are mine to draw.',
    },
  })
  .commit()

console.log('✅ Entrada de las 22:30 actualizada.')
