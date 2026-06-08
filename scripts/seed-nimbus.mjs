/**
 * Seed script — Nimbus experiment + logTags
 * Crea los 13 logTags y el experimento Nimbus con su bitácora completa.
 *
 * Uso:
 *   node scripts/seed-nimbus.mjs
 *
 * Requiere SANITY_TOKEN en .env.local (write token)
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Leer .env.local manualmente
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

// ── logTags ──────────────────────────────────────────────────────────────────
const LOG_TAGS = [
  { slug: 'hipotesis',   colorKey: 'hipotesis',   name: { es: 'Hipótesis',   en: 'Hypothesis'  } },
  { slug: 'decision',    colorKey: 'decision',    name: { es: 'Decisión',    en: 'Decision'    } },
  { slug: 'exploracion', colorKey: 'exploracion', name: { es: 'Exploración', en: 'Exploration' } },
  { slug: 'avance',      colorKey: 'avance',      name: { es: 'Avance',      en: 'Progress'    } },
  { slug: 'completado',  colorKey: 'completado',  name: { es: 'Completado',  en: 'Completed'   } },
  { slug: 'leccion',     colorKey: 'leccion',     name: { es: 'Lección',     en: 'Lesson'      } },
  { slug: 'hito',        colorKey: 'hito',        name: { es: 'Hito',        en: 'Milestone'   } },
  { slug: 'fallo',       colorKey: 'fallo',       name: { es: 'Fallo',       en: 'Failure'     } },
  { slug: 'pivote',      colorKey: 'pivote',      name: { es: 'Pivote',      en: 'Pivot'       } },
  { slug: 'insight',     colorKey: 'insight',     name: { es: 'Insight',     en: 'Insight'     } },
  { slug: 'duda',        colorKey: 'duda',        name: { es: 'Duda',        en: 'Doubt'       } },
  { slug: 'pausa',       colorKey: 'pausa',       name: { es: 'Pausa',       en: 'Pause'       } },
  { slug: 'validacion',  colorKey: 'validacion',  name: { es: 'Validación',  en: 'Validation'  } },
]

async function upsertTags() {
  console.log('Creando logTags…')
  const tagIds = {}
  for (const tag of LOG_TAGS) {
    const existing = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug: tag.slug })
    const doc = {
      _type: 'logTag',
      name:     tag.name,
      slug:     { _type: 'slug', current: tag.slug },
      colorKey: tag.colorKey,
    }
    if (existing) {
      await client.patch(existing).set(doc).commit()
      tagIds[tag.slug] = existing
    } else {
      const created = await client.create(doc)
      tagIds[tag.slug] = created._id
    }
    console.log(`  ✓ ${tag.slug}`)
  }
  return tagIds
}

async function seedNimbus(tagIds) {
  console.log('\nCreando experimento Nimbus…')

  const ref = (slug) => ({ _type: 'reference', _ref: tagIds[slug] })

  const nimbus = {
    _type: 'playgroundItem',
    _id:   'nimbus-experiment',
    title: {
      es: 'Nimbus',
      en: 'Nimbus',
    },
    slug: { _type: 'slug', current: 'nimbus' },
    localizedSlug: {
      es: { _type: 'slug', current: 'nimbus' },
      en: { _type: 'slug', current: 'nimbus' },
    },
    category: 'interfaces',
    status:   'en_proceso',
    year:     2026,
    hidden:   false,
    description: {
      es: '¿Y si el clima tuviera personalidad?',
      en: 'What if the weather had personality?',
    },
    idea: {
      es: 'Nimbus es una aplicación meteorológica experimental que explora cómo la narrativa, la personalidad digital y la inteligencia artificial pueden transformar una utilidad cotidiana en una experiencia más humana.',
      en: 'Nimbus is an experimental weather app exploring how narrative, digital personality, and AI can transform a daily utility into a more human experience.',
    },
    why: {
      es: 'Consultamos el clima constantemente. Antes de salir. Antes de viajar. Antes de decidir qué ponernos. Sin embargo, la mayoría de aplicaciones siguen comunicándose como si hablaran con meteorólogos. Información correcta. Experiencia olvidable.\n\nNimbus nace de una curiosidad: ¿qué ocurriría si el clima tuviera personalidad?',
      en: 'We check the weather constantly. Before going out. Before traveling. Before deciding what to wear. Yet most apps still communicate as if speaking to meteorologists. Correct information. Forgettable experience.\n\nNimbus comes from a curiosity: what would happen if the weather had personality?',
    },
    logEntries: [
      {
        _key: 'entry-1',
        date: '2026-06-04',
        time: '09:14',
        dimension: 'lightbulb',
        tag: ref('hipotesis'),
        description: { es: '¿Y si el clima tuviera personalidad? La hipótesis inicial surge al observar que las aplicaciones meteorológicas parecen diseñadas para estaciones meteorológicas y no para personas.' },
      },
      {
        _key: 'entry-2',
        date: '2026-06-08',
        time: '11:40',
        dimension: 'target',
        tag: ref('decision'),
        description: { es: 'Definí los primeros modos de personalidad para interpretar el mismo clima. Geek. Filosófico. Noctámbulo. Gamer. Team Frío. Team Calor. La misma temperatura. Narrativas distintas.' },
      },
      {
        _key: 'entry-3',
        date: '2026-06-12',
        time: '15:22',
        dimension: 'layers',
        tag: ref('exploracion'),
        description: { es: 'Primeras exploraciones visuales para la mascota. Descarté enfoques demasiado caricaturescos. Busco algo que transmita carácter sin sentirse infantil.' },
      },
      {
        _key: 'entry-4',
        date: '2026-06-18',
        time: '22:07',
        dimension: 'code-2',
        tag: ref('avance'),
        description: { es: 'Integración inicial con OpenWeather. Generación dinámica de mensajes basada en temperatura, condición climática y hora del día.' },
      },
      {
        _key: 'entry-5',
        date: '2026-06-20',
        time: '10:55',
        dimension: 'cloud',
        tag: ref('completado'),
        description: { es: 'Firebase Auth. Login con Google. Persistencia de sesión. El objetivo no era el acceso, era conservar preferencias y personalidad entre dispositivos.' },
      },
      {
        _key: 'entry-6',
        date: '2026-06-21',
        time: '23:48',
        dimension: 'book-open',
        tag: ref('leccion'),
        description: { es: 'La sesión se perdía al recargar la aplicación. El problema no era Firebase. Era el orden en que el listener de autenticación actualizaba el estado inicial.' },
      },
      {
        _key: 'entry-7',
        date: '2026-06-25',
        time: '18:30',
        dimension: 'zap',
        tag: ref('hito'),
        description: { es: 'Primer MVP funcional desplegado. Nimbus ya puede obtener el clima, interpretar el contexto y generar respuestas personalizadas.' },
      },
    ],
    repoUrl:  null,
    demoUrl:  null,
  }

  const existing = await client.fetch(`*[_type == "playgroundItem" && _id == "nimbus-experiment"][0]._id`)
  if (existing) {
    await client.createOrReplace(nimbus)
    console.log('  ✓ Nimbus actualizado')
  } else {
    await client.create(nimbus)
    console.log('  ✓ Nimbus creado')
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────
const tagIds = await upsertTags()
await seedNimbus(tagIds)
console.log('\n✅ Seed completo. Visita /es/playground/nimbus')
