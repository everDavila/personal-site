/**
 * Patch script — Nimbus: que la app sepa dónde está (sistema de lugares)
 * 19/09/2026
 *
 * Uso:
 *   node scripts/patch-nimbus-lugares-2026-09-19.mjs
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
  const exploracion = await getTagRef('exploracion')

  const now  = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const entry = {
    _key: 'entry-19',
    date: '2026-09-19',
    time,
    dimension: { _type: 'reference', _ref: 'dim-target' },
    tag: exploracion,
    description: {
      es: 'Nimbus lleva un tiempo viviendo sobre un fondo bastante genérico.\n\nCumple.\n\nPero también podría estar en Lima, Tokio o Ciudad Gótica y probablemente nadie notaría demasiada diferencia.\n\nAsí que apareció otra pregunta: ¿cuánto debería saber Nimbus sobre el lugar donde está?\n\nNo quiero intentar representar cada ciudad del planeta. Ese camino termina rápido en una carpeta con 847 fondos y alguien preguntándose por qué estamos dibujando una plaza de Moldavia a las tres de la mañana.\n\nLa idea es empezar por algo más estructural.\n\nPrimero detectar qué tipo de lugar es:\n\nciudad, costa, sierra, selva, campo, playa.\n\nEso ya permitiría que el entorno acompañe mejor al clima.\n\nY luego, encima de ese sistema, algunas ciudades podrían tener identidad propia.\n\nLima puede tener una silueta reconocible.\n\nArequipa puede insinuar al Misti.\n\nCusco puede utilizar elementos propios de su paisaje y arquitectura.\n\nSin convertir Nimbus en una postal turística con un widget meteorológico pegado encima.\n\nLa intención no es representar literalmente el lugar.\n\nEs hacer que la aplicación sepa dónde está.\n\nPorque 12 °C no se sienten igual en todos lados.\n\nY una app que pretende interpretar el clima debería entender algo más que latitud, longitud y temperatura.\n\nPor ahora el orden empieza a verse bastante claro:\n\n1. Construir un sistema de lugares y entornos.\n2. Hacer que memoria y humor formen parte del mismo motor.\n3. Convertir las frases actuales en plantillas más flexibles.\n\nNo parece una lista enorme.\n\nPero probablemente ahí esté buena parte de lo que hará que Nimbus deje de sentirse como una app del clima con personaje y empiece a sentirse simplemente como Nimbus.',
      en: 'Nimbus has been living on a fairly generic background for a while.\n\nIt does the job.\n\nBut it could also be in Lima, Tokyo or Gotham City and probably nobody would notice much of a difference.\n\nSo another question came up: how much should Nimbus know about the place it is in?\n\nI don’t want to try to represent every city on the planet. That road quickly ends in a folder with 847 backgrounds and someone wondering why we are drawing a square in Moldova at three in the morning.\n\nThe idea is to start with something more structural.\n\nFirst, detect what kind of place it is:\n\ncity, coast, highlands, jungle, countryside, beach.\n\nThat alone would let the environment go along better with the weather.\n\nAnd then, on top of that system, some cities could have an identity of their own.\n\nLima can have a recognizable skyline.\n\nArequipa can hint at the Misti volcano.\n\nCusco can use elements from its own landscape and architecture.\n\nWithout turning Nimbus into a tourist postcard with a weather widget stuck on top.\n\nThe intention is not to represent the place literally.\n\nIt’s to make the app know where it is.\n\nBecause 12 °C doesn’t feel the same everywhere.\n\nAnd an app that claims to interpret the weather should understand something more than latitude, longitude and temperature.\n\nFor now the order is starting to look pretty clear:\n\n1. Build a system of places and environments.\n2. Make memory and humor part of the same engine.\n3. Turn the current phrases into more flexible templates.\n\nIt doesn’t look like a huge list.\n\nBut that’s probably where a good part of what will make Nimbus stop feeling like a weather app with a character, and start feeling simply like Nimbus, lives.',
    },
  }

  console.log(`Appending entrada a Nimbus (${time})…`)
  await client.patch('nimbus-experiment').append('logEntries', [entry]).commit()
  console.log('\n✅ Entrada agregada correctamente.')
}

await run()
