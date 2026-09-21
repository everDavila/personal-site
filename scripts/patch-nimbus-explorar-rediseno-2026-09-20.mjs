/**
 * Patch script — Nimbus 20/09/2026 21:00: texto propio de Ever para el rediseño de Explorar lugares
 *
 * Uso:
 *   node scripts/patch-nimbus-explorar-rediseno-2026-09-20.mjs
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
    'logEntries[_key=="entry-37"].description': {
      es: 'Hoy me di cuenta de que estaba diseñando un buscador cuando en realidad necesitaba ayudar a tomar una decisión.\n\nAsí que cambié la pantalla. Una vez que eliges qué clima quieres y hasta dónde estás dispuesto a ir por él, Nimbus deja de preguntarte cosas y se moja: te recomienda un lugar. Hay una opción principal y un par más por si no confías tanto en una nube con patas. El mapa queda para comprobar que Nimbus no se lo está inventando.\n\nTambién limpié bastante. Distancias, rumbos, aeropuertos y otros datos que técnicamente podían estar ahí, pero que no ayudaban a decidir, se fueron.\n\nTodavía falta verlo funcionando con datos reales y, sobre todo, hacer que las razones suenen realmente a Nimbus. Por ahora sabe encontrar el clima. Falta que aprenda a venderte la escapada.',
      en: 'Today I realized I was designing a search tool when what I actually needed was to help someone make a decision.\n\nSo I changed the screen. Once you choose the weather you want and how far you’re willing to go for it, Nimbus stops asking you things and sticks its neck out: it recommends a place. There’s one main option and a couple more in case you don’t fully trust a cloud with legs. The map is there to check that Nimbus isn’t making it up.\n\nI also cleaned up quite a bit. Distances, headings, airports and other data that technically could be there, but didn’t help anyone decide, are gone.\n\nI still need to see it working with real data and, above all, make the reasons sound truly like Nimbus. For now it knows how to find the weather. It still has to learn to sell you the getaway.',
    },
  })
  .commit()

console.log('✅ Entrada de las 21:00 actualizada.')
