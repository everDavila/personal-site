/**
 * Seed script — Diseño con Contexto
 * Crea el experimento sobre alfabetización técnica para diseñadores UX.
 *
 * Uso:
 *   node scripts/seed-diseno-contexto.mjs
 *
 * Requiere SANITY_TOKEN en .env.local (write token)
 * Los 13 logTags deben existir ya (creados por seed-nimbus.mjs)
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

// ── Portable Text helpers ─────────────────────────────────────────────────────
let _k = 0
const k = () => `k${++_k}`

const p = (text) => ({
  _type: 'block', _key: k(), style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

const h2 = (text) => ({
  _type: 'block', _key: k(), style: 'h2', markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

const li = (text) => ({
  _type: 'block', _key: k(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

// ── Contenido ─────────────────────────────────────────────────────────────────
const ideaEs = [
  p('Durante años he visto el mismo patrón repetirse.'),
  p('Diseñadores que producen interfaces impecables, pero que llegan a desarrollo incompletas. Desarrolladores que responden con "eso no se puede". Retrabajo. Frustración. Decisiones que nadie termina de defender.'),
  p('La pregunta es sencilla: ¿qué debería entender un diseñador sobre tecnología para colaborar mejor sin convertirse en desarrollador?'),
  p('No busco formar programadores. Busco entender dónde termina el diseño y dónde comienza una mejor conversación.'),
]

const ideaEn = [
  p('For years I\'ve seen the same pattern repeat itself.'),
  p('Designers who produce flawless interfaces, but deliver them to development incomplete. Developers who respond with "that can\'t be done." Rework. Frustration. Decisions that nobody ends up defending.'),
  p('The question is simple: what should a designer understand about technology to collaborate better, without becoming a developer?'),
  p('I\'m not trying to train programmers. I\'m trying to understand where design ends and where a better conversation begins.'),
]

const whyEs = [
  p('La mayoría de los problemas que aparecen entre UX y desarrollo no son conflictos de personas. Son problemas de contexto.'),
  p('Quizá un diseñador no necesita escribir una API. Pero tal vez sí debería entender qué es una API. Quizá no necesita administrar una base de datos. Pero sí comprender que los datos no aparecen por generación espontánea. Tal vez la alfabetización técnica sea una forma de empatía.'),
  h2('Preguntas que quiero explorar'),
  li('¿Qué conocimientos técnicos aportan más valor a un diseñador?'),
  li('¿Cuándo un diseñador está reinventando algo que ya existe?'),
  li('¿Cómo negociar un "eso no se puede"?'),
  li('¿Qué significa realmente diseñar algo viable?'),
  li('¿Cuándo la complejidad debe estar en la interfaz y cuándo en el sistema?'),
  li('¿Puede existir una especie de "alfabetización técnica" para UX?'),
  h2('Hipótesis'),
  p('Un diseñador con cierto entendimiento técnico puede:'),
  li('anticipar restricciones;'),
  li('reducir retrabajo;'),
  li('defender mejor sus decisiones;'),
  li('participar en conversaciones más interesantes;'),
  li('construir soluciones más realistas;'),
  li('aumentar su influencia dentro del equipo.'),
  p('Sin escribir una línea de código.'),
]

const whyEn = [
  p('Most problems that appear between UX and development are not people conflicts. They are context problems.'),
  p('Maybe a designer doesn\'t need to write an API. But perhaps they should understand what an API is. Maybe they don\'t need to manage a database. But they should understand that data doesn\'t appear out of nowhere. Perhaps technical literacy is a form of empathy.'),
  h2('Questions I want to explore'),
  li('What technical knowledge adds the most value to a designer?'),
  li('When is a designer reinventing something that already exists?'),
  li('How do you negotiate a "that can\'t be done"?'),
  li('What does it really mean to design something viable?'),
  li('When should complexity live in the interface, and when in the system?'),
  li('Can a "technical literacy" for UX exist?'),
  h2('Hypothesis'),
  p('A designer with some technical understanding can:'),
  li('anticipate constraints;'),
  li('reduce rework;'),
  li('better defend their decisions;'),
  li('participate in more interesting conversations;'),
  li('build more realistic solutions;'),
  li('increase their influence within the team.'),
  p('Without writing a single line of code.'),
]

async function getTagIds() {
  const tags = await client.fetch(
    `*[_type == "logTag"]{ "slug": slug.current, _id }`
  )
  return Object.fromEntries(tags.map(t => [t.slug, t._id]))
}

async function seedDisenoContexto(tagIds) {
  console.log('\nCreando experimento Diseño con Contexto…')

  const ref = (slug) => ({ _type: 'reference', _ref: tagIds[slug] })

  const doc = {
    _type: 'playgroundItem',
    _id:   'diseno-con-contexto-experiment',
    title: {
      es: 'Diseño con Contexto',
      en: 'Design with Context',
    },
    slug: { _type: 'slug', current: 'diseno-con-contexto' },
    localizedSlug: {
      es: { _type: 'slug', current: 'diseno-con-contexto' },
      en: { _type: 'slug', current: 'design-with-context' },
    },
    category: 'experiments',
    status:   'en_proceso',
    year:     2026,
    hidden:   false,
    description: {
      es: '¿Cuánto conocimiento técnico necesita realmente un diseñador UX? Una exploración sobre la frontera entre diseño y desarrollo.',
      en: 'How much technical knowledge does a UX designer really need? An exploration of the boundary between design and development.',
    },
    idea: { es: ideaEs, en: ideaEn },
    why:  { es: whyEs,  en: whyEn  },
    logEntries: [
      {
        _key: 'entry-1',
        date: '2026-06-24',
        dimension: 'lightbulb',
        tag: ref('hipotesis'),
        description: {
          es: 'Después de trabajar durante años con sistemas complejos, empiezo a sospechar que muchas fricciones entre UX y desarrollo no provienen de diferencias de criterio, sino de diferencias de contexto. Quizá el problema nunca fue "los desarrolladores no entienden UX". Tal vez los diseñadores tampoco entendemos del todo cómo se construyen las cosas que dibujamos.',
          en: 'After years working with complex systems, I\'m starting to suspect that many frictions between UX and development don\'t come from differences of opinion, but from differences of context. Maybe the problem was never "developers don\'t understand UX." Perhaps designers don\'t fully understand how the things we draw are actually built.',
        },
      },
      {
        _key: 'entry-2',
        date: '2026-06-24',
        dimension: 'book-open',
        tag: ref('exploracion'),
        description: {
          es: 'La palabra "framework" me genera cierta incomodidad. Suena demasiado terminada. Por ahora prefiero verlo como un experimento — una especie de mapa para responder una pregunta más grande: ¿cómo dejar de ser un turista dentro del proceso de construcción del producto?',
          en: 'The word "framework" makes me a little uncomfortable. It sounds too finished. For now I prefer to think of it as an experiment — a kind of map to answer a bigger question: how to stop being a tourist inside the product-building process?',
        },
      },
      {
        _key: 'entry-3',
        date: '2026-06-24',
        dimension: 'compass',
        tag: ref('exploracion'),
        description: {
          es: 'Temas pendientes de explorar: modelos mentales para diseñadores, APIs para gente que diseña, estados y flujos, qué debería saber un UX sobre bases de datos, arquitectura explicada sin trauma, design systems y reutilización, cómo discutir con desarrollo sin que sea un debate religioso, y la frase "eso no se puede" con sus múltiples traducciones.',
          en: 'Topics ahead: mental models for designers, APIs for people who design, states and flows, what a UX designer should know about databases, architecture explained without trauma, design systems and reuse, how to argue with development without it becoming a religious debate, and the phrase "that can\'t be done" and its many translations.',
        },
      },
    ],
    repoUrl: null,
    demoUrl: null,
  }

  const existing = await client.fetch(
    `*[_type == "playgroundItem" && _id == "diseno-con-contexto-experiment"][0]._id`
  )
  if (existing) {
    await client.createOrReplace(doc)
    console.log('  ✓ Diseño con Contexto actualizado')
  } else {
    await client.create(doc)
    console.log('  ✓ Diseño con Contexto creado')
  }
}

// ── Run ────────────────────────────────────────────────────────────────────────
const tagIds = await getTagIds()
const missing = ['hipotesis', 'exploracion'].filter(s => !tagIds[s])
if (missing.length) {
  console.error(`❌ Tags no encontrados en Sanity: ${missing.join(', ')}`)
  console.error('   Ejecuta primero: node scripts/seed-nimbus.mjs')
  process.exit(1)
}

await seedDisenoContexto(tagIds)
console.log('\n✅ Listo. Visita /es/playground/diseno-con-contexto')
