/**
 * Patch — LivingMusic: entrada 15
 * 05/07/2026 04:47 — El cerebro de animaciones. Demasiado PowerPoint.
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
  const exploracion = await getTagRef('exploracion')

  const entry = {
    _key: 'entry-15',
    date: '2026-07-05',
    time: '04:47',
    dimension: dim('compass'),
    tag: exploracion,
    description: {
      es: `El manifiesto como lista de primitivas tiene un problema que recién estoy viendo: es demasiado lineal. Demasiado PowerPoint. Define reglas pero no entiende por qué esas reglas existen. No tiene referencias, no tiene memoria visual, no tiene intuición. Es un índice sin cuerpo.

Lo que necesito no es un manual — es un cerebro.

Le compartí a Claudio capturas de estilo editorial de un video de Lewis Capaldi. No como referencia para copiar — como evidencia de que algo puede sentirse de una manera específica y hay que entender por qué. La tipografía en ese video no decora la música. La interpreta. Hay decisiones ahí que no están en ningún manual de motion design porque no vienen de reglas — vienen de sensibilidad.

Así que estamos reestructurando. El cerebro de animaciones va a tener tres capas: referencias visuales con anotaciones (qué ocurre y por qué funciona), un catálogo de canciones con sus arcos emocionales mapeados, y encima de todo eso las primitivas — pero ahora con contexto, con ejemplos reales, con la pregunta de por qué esta primitiva y no otra.

No sé si esto tiene nombre en ninguna metodología. Probablemente no. Pero es la diferencia entre un sistema que genera animaciones correctas y uno que genera animaciones que se sienten bien. Lo primero se puede documentar en un readme. Lo segundo necesita un cerebro.`,
      en: `The manifesto as a list of primitives has a problem I'm only now seeing: it's too linear. Too PowerPoint. It defines rules but doesn't understand why those rules exist. No references, no visual memory, no intuition. It's an index without a body.

What I need isn't a manual — it's a brain.

I shared editorial style captures from a Lewis Capaldi video with Claudio. Not as a reference to copy — as evidence that something can feel a specific way and we need to understand why. The typography in that video doesn't decorate the music. It interprets it. There are decisions there that aren't in any motion design manual because they don't come from rules — they come from sensibility.

So we're restructuring. The animation brain will have three layers: visual references with annotations (what happens and why it works), a catalog of songs with their emotional arcs mapped, and on top of all that the primitives — but now with context, with real examples, with the question of why this primitive and not another.

I don't know if this has a name in any methodology. Probably not. But it's the difference between a system that generates correct animations and one that generates animations that feel right. The first can be documented in a readme. The second needs a brain.`,
    },
  }

  console.log('Appending entrada 15 (cerebro de animaciones)…')
  await client
    .patch('living-music-experiment')
    .append('logEntries', [entry])
    .commit()

  console.log('\n✅ Entrada 15 agregada.')
}

await run()
