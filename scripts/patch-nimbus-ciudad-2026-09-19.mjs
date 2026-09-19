/**
 * Patch script — Nimbus: cómo se determina la ciudad (tabla manual vs Open-Meteo)
 * 19/09/2026
 *
 * Uso:
 *   node scripts/patch-nimbus-ciudad-2026-09-19.mjs
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
  const leccion = await getTagRef('leccion')

  const now  = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const entry = {
    _key: 'entry-20',
    date: '2026-09-19',
    time,
    dimension: { _type: 'reference', _ref: 'dim-compass' },
    tag: leccion,
    description: {
      es: 'Para saber en qué tipo de lugar está el usuario, por ahora no uso ninguna API.\n\nEs una tabla escrita a mano en places.ts. Compara el nombre de la ciudad, sin acentos ni mayúsculas, con el que ya entrega OpenWeather. Funciona, pero solo con las ciudades que yo escribí.\n\nLa API gratuita que mencioné antes era una idea de respaldo, no algo implementado. Hoy la verifiqué con llamadas reales: Open-Meteo Geocoding, gratis y sin key. Devuelve elevación, población, tipo de lugar y país. Para Cusco: 3312 m y 428 450 habitantes.\n\nEso serviría para clasificar las ciudades que no estén en mi tabla: población baja, campo; elevación alta, andino. La playa no la detecta.\n\nLo que aprendí en la prueba: también devuelve homónimos. Hay otro Cusco en San Martín, a 262 m y sin población registrada.\n\nUn Cusco a 262 metros de altura es buena razón para no dejar que una API decida sola dónde está Nimbus.',
      en: 'To know what kind of place the user is in, for now I don’t use any API.\n\nIt’s a hand-written table in places.ts. It compares the city name, without accents or capital letters, with the one OpenWeather already provides. It works, but only for the cities I wrote down.\n\nThe free API I mentioned before was a fallback idea, not something implemented. Today I checked it with real calls: Open-Meteo Geocoding, free and no key. It returns elevation, population, place type and country. For Cusco: 3312 m and 428,450 inhabitants.\n\nThat could classify the cities that aren’t in my table: low population, countryside; high elevation, Andean. It doesn’t detect beaches.\n\nWhat I learned from the test: it also returns namesakes. There’s another Cusco in San Martín, at 262 m and with no registered population.\n\nA Cusco at 262 meters is a good reason not to let an API decide on its own where Nimbus is.',
    },
  }

  console.log(`Appending entrada a Nimbus (${time})…`)
  await client.patch('nimbus-experiment').append('logEntries', [entry]).commit()
  console.log('\n✅ Entrada agregada correctamente.')
}

await run()
