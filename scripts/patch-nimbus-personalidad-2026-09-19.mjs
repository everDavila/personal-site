/**
 * Patch script — Nimbus: qué es el producto + personalidad antes que IA generativa
 * 19/09/2026
 *
 * Uso:
 *   node scripts/patch-nimbus-personalidad-2026-09-19.mjs
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
  const decision = await getTagRef('decision')

  const entries = [
    {
      _key: 'entry-16',
      date: '2026-09-19',
      time: '01:10',
      dimension: dim('target'),
      tag: decision,
      description: {
        es: 'Hoy terminó de cerrar una idea que venía rondando el proyecto desde hace un tiempo: Nimbus no debería ser una app a la que entras solo para revisar si mañana llueve.\n\nPara eso ya existen bastantes aplicaciones. Y, siendo sinceros, varias lo hacen bastante bien.\n\nLo que me interesa es otra cosa: que alguien abra Nimbus pensando "a ver qué dice hoy".\n\nEse pequeño cambio mueve todo el producto.\n\nEl clima sigue siendo útil, obviamente. Nimbus tiene que decir si hace frío, si va a llover o si salir sin bloqueador es una decisión cuestionable. Pero esos datos son la materia prima. La razón para volver debería ser Nimbus interpretándolos.',
        en: 'Today I finished closing an idea that had been circling the project for a while: Nimbus shouldn’t be an app you open just to check whether it will rain tomorrow.\n\nPlenty of apps already do that. And, to be honest, several do it quite well.\n\nWhat interests me is something else: someone opening Nimbus thinking "let’s see what it says today".\n\nThat small change moves the whole product.\n\nWeather is still useful, obviously. Nimbus has to say whether it’s cold, whether it will rain, or whether leaving without sunscreen is a questionable decision. But that data is the raw material. The reason to come back should be Nimbus interpreting it.',
      },
    },
    {
      _key: 'entry-17',
      date: '2026-09-19',
      time: '01:16',
      dimension: dim('code-2'),
      tag: decision,
      description: {
        es: 'Eso también cambia cómo estoy pensando la tecnología.\n\nPodría conectar un LLM desde ahora y hacer que genere comentarios infinitos. Suena bonito hasta que Firebase, APIs y compañía empiezan a enviar facturas con vocación de alquiler.\n\nPor ahora prefiero algo más difícil, pero también más interesante: comprobar si Nimbus puede tener personalidad sin depender de IA generativa.\n\nReglas, contexto, estados de ánimo, variables y frases escritas con intención.\n\nMás adelante seguramente habrá un modelo detrás. Probablemente uno pequeño y barato, porque tampoco necesito que Nimbus descubra una nueva rama de la física cada vez que hay 18 grados.\n\nPero quiero que el orden sea este: primero construir a Nimbus y después darle más capacidad para hablar.\n\nNo construir primero una IA y luego preguntarnos quién se supone que es.',
        en: 'That also changes how I’m thinking about the technology.\n\nI could plug in an LLM right now and have it generate endless comments. It sounds nice until Firebase, APIs and company start sending invoices with the ambition of a rent payment.\n\nFor now I prefer something harder, but also more interesting: testing whether Nimbus can have personality without relying on generative AI.\n\nRules, context, moods, variables and phrases written with intent.\n\nLater there will surely be a model behind it. Probably a small, cheap one, because I don’t need Nimbus to discover a new branch of physics every time it’s 18 degrees.\n\nBut I want the order to be this: first build Nimbus, then give it more capacity to speak.\n\nNot build an AI first and then wonder who it’s supposed to be.',
      },
    },
  ]

  console.log('Appending 2 entradas a Nimbus…')
  await client.patch('nimbus-experiment').append('logEntries', entries).commit()
  console.log('\n✅ Entradas agregadas correctamente.')
}

await run()
