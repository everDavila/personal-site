/**
 * Seed script — SSD Editorial
 * Crea el experimento de tesis con bitácora inicial.
 *
 * Uso:
 *   node scripts/seed-ssd-editorial.mjs
 *
 * Requiere SANITY_TOKEN en .env.local (write token)
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

async function getTagIds() {
  const tags = await client.fetch(
    `*[_type == "logTag"]{ "slug": slug.current, _id }`
  )
  return Object.fromEntries(tags.map(t => [t.slug, t._id]))
}

async function seedSsdEditorial(tagIds) {
  console.log('\nCreando experimento SSD Editorial…')

  const ref = (slug) => ({ _type: 'reference', _ref: tagIds[slug] })

  const doc = {
    _type: 'playgroundItem',
    _id:   'ssd-editorial-experiment',
    title: {
      es: 'SSD Editorial',
      en: 'SSD Editorial',
    },
    slug: { _type: 'slug', current: 'ssd-editorial' },
    localizedSlug: {
      es: { _type: 'slug', current: 'ssd-editorial' },
      en: { _type: 'slug', current: 'ssd-editorial' },
    },
    category: 'ai',
    status:   'en_proceso',
    year:     2026,
    hidden:   false,
    description: {
      es: 'La editorial ya tenía los datos. Solo necesitaba escucharlos.',
      en: 'The publisher had the data all along. It just needed to listen.',
    },
    idea: {
      es: [
        p('Todo empezó como una tesis.'),
        p('1,280 registros de ventas de una editorial familiar limeña. Libros de ficción infantil y juvenil. Fechas, títulos, canales, ferias. Cuatro años de decisiones acumuladas en un Excel que nadie había interrogado en serio.'),
        p('La pregunta original era técnica: ¿puede un modelo de machine learning predecir cuántos libros va a vender un título el próximo trimestre?'),
        p('Pero mientras avanzaba apareció una pregunta más interesante.'),
        p('¿Qué pasa cuando una editorial pequeña deja de adivinar y empieza a saber?'),
      ],
      en: [
        p('It started as a thesis.'),
        p('1,280 sales records from a family-owned publisher in Lima. Children\'s and young adult fiction. Dates, titles, channels, book fairs. Four years of decisions accumulated in a spreadsheet nobody had seriously questioned.'),
        p('The original question was technical: can a machine learning model predict how many copies a title will sell next quarter?'),
        p('But as it progressed, a more interesting question emerged.'),
        p('What happens when a small publisher stops guessing and starts knowing?'),
      ],
    },
    why: {
      es: [
        p('Las editoriales familiares toman decisiones de la misma forma desde hace décadas. ¿Cuántos ejemplares imprimir? Intuición. ¿Vale la pena ir a esa feria en Arequipa? Intuición. ¿Qué autor vende más en temporada escolar? Intuición con algo de memoria.'),
        p('No porque sean malas en su trabajo. Sino porque nadie les había construido una herramienta que hablara su idioma.'),
        p('Cuando empecé a estudiar los datos me encontré con algo que no esperaba. No era solo un problema de predicción. Era un problema de visibilidad. La editorial no sabía qué títulos financiaban a cuáles. No sabía qué ferias realmente rentaban después de descontar el stand, el personal y el transporte. No sabía si el estilo de ilustración influía en las ventas por rango de edad.'),
        p('Tenía los datos. No tenía el espejo.'),
        p('SSD Editorial nace de esa observación: construir el espejo. Un sistema que tome los datos históricos, los procese con tres algoritmos de ML —XGBoost, Random Forest y LSTM— y devuelva algo accionable. No un paper. No un dashboard académico. Una herramienta que la editorial pueda usar el lunes por la mañana.'),
      ],
      en: [
        p('Family publishers have made decisions the same way for decades. How many copies to print? Intuition. Is it worth going to that book fair in Arequipa? Intuition. Which author sells best during the school season? Intuition backed by memory.'),
        p('Not because they\'re bad at their job. But because nobody had built them a tool that spoke their language.'),
        p('When I started studying the data, I found something unexpected. It wasn\'t just a prediction problem. It was a visibility problem. The publisher didn\'t know which titles were subsidizing others. Didn\'t know which fairs were actually profitable after deducting booth fees, staff, and transport. Didn\'t know whether illustration style influenced sales by age group.'),
        p('They had the data. They didn\'t have the mirror.'),
        p('SSD Editorial was born from that observation: build the mirror. A system that takes historical data, processes it with three ML algorithms —XGBoost, Random Forest, and LSTM— and returns something actionable. Not a paper. Not an academic dashboard. A tool the publisher can use on Monday morning.'),
      ],
    },
    logEntries: [
      {
        _key: 'entry-1',
        date: '2026-06-21',
        time: '10:00',
        dimension: 'lightbulb',
        tag: ref('hipotesis'),
        description: {
          es: 'Empezó como una tesis de pregrado. Tres algoritmos, 1,280 registros, una metodología CRISP-DM y un jurado esperando resultados. Pero en algún punto entre los datos y el modelo apareció una pregunta que no cabía en ningún capítulo: ¿y si esto fuera una herramienta real?',
          en: 'It started as an undergraduate thesis. Three algorithms, 1,280 records, a CRISP-DM methodology, and a jury waiting for results. But somewhere between the data and the model, a question appeared that didn\'t fit any chapter: what if this became a real tool?',
        },
      },
      {
        _key: 'entry-2',
        date: '2026-06-21',
        time: '14:00',
        dimension: 'layout-grid',
        tag: ref('decision'),
        description: {
          es: 'Definí el stack. Python 3.11, XGBoost, Random Forest, LSTM, Streamlit, SQLite, Plotly. uv como gestor de paquetes. Claude Code como entorno de desarrollo. La decisión más importante no fue técnica: fue separar la tesis del sistema. Los resultados académicos están cerrados. Lo que construyo ahora es otra cosa.',
          en: 'Defined the stack. Python 3.11, XGBoost, Random Forest, LSTM, Streamlit, SQLite, Plotly. uv as package manager. Claude Code as development environment. The most important decision wasn\'t technical: it was separating the thesis from the system. The academic results are done. What I\'m building now is something else.',
        },
      },
      {
        _key: 'entry-3',
        date: '2026-06-21',
        time: '16:00',
        dimension: 'activity',
        tag: ref('decision'),
        description: {
          es: 'Elegí SQLite sobre NoSQL. Los datos son relacionales por naturaleza: un título tiene un autor, un ilustrador y muchas ventas. Un canal puede ser una librería, una plataforma online o una feria en otro distrito. SQL hace esas preguntas de forma natural. NoSQL me hubiera obligado a escribir a mano lo que ya existe.',
          en: 'Chose SQLite over NoSQL. The data is relational by nature: a title has an author, an illustrator, and many sales records. A channel can be a bookstore, an online platform, or a fair in another district. SQL asks those questions naturally. NoSQL would have made me write by hand what already exists.',
        },
      },
      {
        _key: 'entry-4',
        date: '2026-06-21',
        time: '20:00',
        dimension: 'target',
        tag: ref('avance'),
        description: {
          es: 'El sistema creció más de lo esperado. Lo que empezó como un dashboard de predicciones terminó incluyendo un calendario de ferias con alertas de stock, un módulo de ROI por evento y análisis geográfico de ventas fuera de Lima. La estructura está preparada para una fase 2: análisis automático de estilo de escritura e ilustración con NLP y Computer Vision. Primero, que funcione. Después, que aprenda.',
          en: 'The system grew beyond expectations. What started as a predictions dashboard ended up including a book fair calendar with stock alerts, an ROI module per event, and geographic analysis of sales outside Lima. The architecture is ready for a phase 2: automatic analysis of writing and illustration style with NLP and Computer Vision. First, make it work. Then, make it learn.',
        },
      },
    ],
    repoUrl: null,
    demoUrl: null,
  }

  const existing = await client.fetch(
    `*[_type == "playgroundItem" && _id == "ssd-editorial-experiment"][0]._id`
  )
  if (existing) {
    await client.createOrReplace(doc)
    console.log('  ✓ SSD Editorial actualizado')
  } else {
    await client.create(doc)
    console.log('  ✓ SSD Editorial creado')
  }
}

// ── Run ────────────────────────────────────────────────────────────────────────
const tagIds = await getTagIds()
const missing = ['hipotesis', 'decision', 'avance'].filter(s => !tagIds[s])
if (missing.length) {
  console.error(`❌ Tags no encontrados en Sanity: ${missing.join(', ')}`)
  console.error('   Ejecuta primero: node scripts/seed-nimbus.mjs')
  process.exit(1)
}

await seedSsdEditorial(tagIds)
console.log('\n✅ Listo. Visita /es/playground/ssd-editorial')
