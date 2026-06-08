/**
 * Seed script — davila.uno experiment
 * Crea el playgroundItem del sitio personal con su bitácora.
 *
 * Uso:
 *   node scripts/seed-davila-uno.mjs
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
  const id = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug })
  if (!id) throw new Error(`logTag "${slug}" no encontrado. Corre seed-nimbus.mjs primero.`)
  return { _type: 'reference', _ref: id }
}

async function seedDavilaUno() {
  console.log('Resolviendo tags…')
  const [hipotesis, insight, decision, avance, hito, leccion] = await Promise.all([
    getTagRef('hipotesis'),
    getTagRef('insight'),
    getTagRef('decision'),
    getTagRef('avance'),
    getTagRef('hito'),
    getTagRef('leccion'),
  ])
  console.log('  ✓ 6 tags resueltos')

  const item = {
    _type: 'playgroundItem',
    _id:   'davila-uno-site',
    title: {
      es: 'davila.uno',
      en: 'davila.uno',
    },
    slug: { _type: 'slug', current: 'davila-uno' },
    localizedSlug: {
      es: { _type: 'slug', current: 'davila-uno' },
      en: { _type: 'slug', current: 'davila-uno' },
    },
    category: 'systems',
    status:   'en_proceso',
    year:     2026,
    hidden:   false,
    description: {
      es: 'Dos formas de observar la misma historia.',
      en: 'Two ways of looking at the same story.',
    },
    idea: {
      es: 'Una plataforma editorial diseñada para evolucionar junto con las ideas que documenta.\n\nNo es un portafolio tradicional.\n\nEs un sistema para explorar cómo experiencia, curiosidad y tecnología pueden convivir en un mismo espacio.',
      en: 'An editorial platform designed to evolve alongside the ideas it documents.\n\nNot a traditional portfolio.\n\nA system to explore how experience, curiosity, and technology can coexist in the same space.',
    },
    why: {
      es: 'Durante años utilicé WordPress.\n\nFuncionaba.\n\nPero constantemente terminaba adaptándome a las limitaciones de la plataforma.\n\nLlegó un momento en que ya no quería personalizar una plantilla.\n\nQuería construir mi propio sistema.',
      en: 'For years I used WordPress.\n\nIt worked.\n\nBut I kept adapting myself to the platform\'s limitations.\n\nThere came a point when I no longer wanted to customize a template.\n\nI wanted to build my own system.',
    },
    logEntries: [
      {
        _key: 'duno-1',
        date: '2026-03-03',
        time: '23:17',
        dimension: 'lightbulb',
        tag: hipotesis,
        description: {
          es: 'Empiezo a cuestionar si mi web personal debería parecer un portafolio.\n\nCada vez me interesa más mostrar cómo pienso que mostrar qué hice.',
          en: 'Starting to question whether my personal site should look like a portfolio.\n\nI\'m increasingly more interested in showing how I think than what I\'ve done.',
        },
      },
      {
        _key: 'duno-2',
        date: '2026-03-05',
        time: '00:48',
        dimension: 'lightbulb',
        tag: insight,
        description: {
          es: 'Anotado:\n\nEarth y Orbital.\n\nNo son modos visuales.\n\nSon perspectivas.',
          en: 'Noted:\n\nEarth and Orbital.\n\nNot visual modes.\n\nPerspectives.',
        },
      },
      {
        _key: 'duno-3',
        date: '2026-03-06',
        time: '22:35',
        dimension: 'target',
        tag: decision,
        description: {
          es: 'Decisión importante:\n\nEl contenido no cambiará entre modos.\n\nLo que cambiará será la narrativa.',
          en: 'Important decision:\n\nThe content won\'t change between modes.\n\nWhat will change is the narrative.',
        },
      },
      {
        _key: 'duno-4',
        date: '2026-03-12',
        time: '23:54',
        dimension: 'code-2',
        tag: avance,
        description: {
          es: 'Comienza la migración desde WordPress hacia Next.js.\n\nNo estoy cambiando de plataforma.\n\nEstoy cambiando de libertad.',
          en: 'Migration from WordPress to Next.js begins.\n\nI\'m not changing platforms.\n\nI\'m changing freedom.',
        },
      },
      {
        _key: 'duno-5',
        date: '2026-03-18',
        time: '00:41',
        dimension: 'cloud',
        tag: hito,
        description: {
          es: 'Primer despliegue estable en Vercel.\n\nPor primera vez siento que el sitio me pertenece completamente.',
          en: 'First stable deployment on Vercel.\n\nFor the first time the site feels completely mine.',
        },
      },
      {
        _key: 'duno-6',
        date: '2026-03-22',
        time: '01:28',
        dimension: 'book-open',
        tag: leccion,
        description: {
          es: 'Tu sitio personal es probablemente el producto más difícil de diseñar.\n\nEl cliente nunca deja de cambiar.\n\nPorque el cliente eres tú.',
          en: 'Your personal site is probably the hardest product to design.\n\nThe client never stops changing.\n\nBecause the client is you.',
        },
      },
    ],
    repoUrl: 'https://github.com/everDavila/personal-site',
    demoUrl: 'https://davila.uno',
  }

  console.log('\nCreando davila.uno…')
  await client.createOrReplace(item)
  console.log('  ✓ davila.uno creado')
}

await seedDavilaUno()
console.log('\n✅ Seed completo. Visita /es/laboratorio/davila-uno')
