/**
 * Patch script — Nimbus: la idea de los cerebros (motor de criterio)
 * 19/09/2026
 *
 * Uso:
 *   node scripts/patch-nimbus-cerebros-2026-09-19.mjs
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
  const insight = await getTagRef('insight')

  const entry = {
    _key: 'entry-18',
    date: '2026-09-19',
    time: '01:17',
    dimension: { _type: 'reference', _ref: 'dim-lightbulb' },
    tag: insight,
    description: {
      es: 'Hoy apareció una idea que probablemente termine definiendo bastante cómo funciona Nimbus por dentro: darle cerebros.\n\nNo varios Nimbus ni personalidades intercambiables. Más bien pequeñas capas de criterio.\n\nUna entiende el clima.\n\nOtra sabe algo del contexto.\n\nOtra recuerda ciertas cosas del usuario.\n\nOtra decide el tono.\n\nY alguna tendrá que evitar que Nimbus convierta una ligera llovizna en el apocalipsis climático del siglo.\n\nLa idea nace de un problema bastante simple.\n\nNo quiero terminar con cientos de reglas del tipo: si temperatura < 15 → mostrar frase 37.\n\nEso funcionaría técnicamente, pero después de un tiempo Nimbus sería básicamente una hoja de Excel con ojos.\n\nQuiero que exista un pequeño motor que pueda combinar señales y decidir qué tiene sentido decir en ese momento.\n\nNo solo: "Hace 14 °C."\n\nSino algo más cercano a: "Hace 14 °C, está saliendo temprano, suele sentir frío y hoy Nimbus está particularmente poco impresionado con el clima."\n\nDe ahí debería salir la respuesta.\n\nEsto también permitiría que la memoria y el humor no sean funciones separadas pegadas encima del producto, sino partes de la misma decisión.\n\nLas frases escritas a mano seguirían existiendo. De hecho, quiero conservarlas porque ahí vive buena parte de la voz de Nimbus.\n\nLa diferencia es que dejarían de ser frases rígidas.\n\nPodrían convertirse en plantillas con variables, contexto y pequeñas variaciones.\n\nMenos catálogo de respuestas.\n\nMás máquina de criterio.\n\nTodavía no sé cuántos cerebros terminará teniendo Nimbus.\n\nPero al menos ya sé que uno solo lleno de if probablemente no sea suficiente.',
      en: 'Today an idea showed up that will probably end up defining a lot of how Nimbus works on the inside: giving it brains.\n\nNot several Nimbuses or interchangeable personalities. More like small layers of judgment.\n\nOne understands the weather.\n\nAnother knows something about the context.\n\nAnother remembers certain things about the user.\n\nAnother decides the tone.\n\nAnd one will have to stop Nimbus from turning a light drizzle into the climate apocalypse of the century.\n\nThe idea comes from a fairly simple problem.\n\nI don’t want to end up with hundreds of rules like: if temperature < 15 → show phrase 37.\n\nThat would work technically, but after a while Nimbus would basically be a spreadsheet with eyes.\n\nI want a small engine that can combine signals and decide what makes sense to say at that moment.\n\nNot just: "It’s 14 °C."\n\nBut something closer to: "It’s 14 °C, you’re heading out early, you tend to feel cold, and today Nimbus is particularly unimpressed with the weather."\n\nThe answer should come out of that.\n\nThis would also let memory and humor stop being separate features glued on top of the product, and become parts of the same decision.\n\nThe handwritten phrases would still exist. In fact, I want to keep them, because a good part of Nimbus’s voice lives there.\n\nThe difference is that they would stop being rigid phrases.\n\nThey could become templates with variables, context and small variations.\n\nLess catalog of answers.\n\nMore judgment machine.\n\nI still don’t know how many brains Nimbus will end up having.\n\nBut at least I know that a single one full of ifs probably won’t be enough.',
    },
  }

  console.log('Appending entrada a Nimbus…')
  await client.patch('nimbus-experiment').append('logEntries', [entry]).commit()
  console.log('\n✅ Entrada agregada correctamente.')
}

await run()
