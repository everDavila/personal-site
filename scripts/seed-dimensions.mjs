/**
 * Seed — dimensiones de bitácora
 * 1. Crea 14 documentos `dimension` en Sanity con nombre, ícono y cuándo usar
 * 2. Migra logEntries existentes: reemplaza dimension string por reference
 *
 * Uso:
 *   node scripts/seed-dimensions.mjs
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

// ── Definición de las 14 dimensiones ─────────────────────────────────────────
// icon = clave Lucide, también es el valor que estaba guardado como string
const DIMENSIONS = [
  { icon: 'lightbulb',     name: { es: 'Idea',              en: 'Idea'           }, whenToUse: 'El concepto original, el "¿y si…?"',                              order: 1  },
  { icon: 'compass',       name: { es: 'Investigación',     en: 'Research'       }, whenToUse: 'Benchmarks, referencias, análisis previo a diseñar',              order: 2  },
  { icon: 'route',         name: { es: 'Proceso',           en: 'Process'        }, whenToUse: 'Metodología, flujo de trabajo, cómo estás abordando el proyecto', order: 3  },
  { icon: 'target',        name: { es: 'Producto',          en: 'Product'        }, whenToUse: 'Decisiones de alcance, dirección, estrategia',                    order: 4  },
  { icon: 'layers',        name: { es: 'Interfaz',          en: 'Interface'      }, whenToUse: 'Diseño visual, interacción, pantallas',                           order: 5  },
  { icon: 'pen-line',      name: { es: 'Contenido',         en: 'Content'        }, whenToUse: 'UX writing, copy, naming, voz del producto',                      order: 6  },
  { icon: 'layout-grid',   name: { es: 'Diseño de sistema', en: 'Design system'  }, whenToUse: 'Tokens, componentes, patrones reutilizables',                     order: 7  },
  { icon: 'code-2',        name: { es: 'Implementación',    en: 'Implementation' }, whenToUse: 'Código, lógica, features',                                        order: 8  },
  { icon: 'cloud',         name: { es: 'Infraestructura',   en: 'Infrastructure' }, whenToUse: 'Deploy, auth, base de datos, servicios externos',                 order: 9  },
  { icon: 'flask-conical', name: { es: 'Testing',           en: 'Testing'        }, whenToUse: 'Pruebas con usuarios, validación, QA',                            order: 10 },
  { icon: 'activity',      name: { es: 'Datos',             en: 'Data'           }, whenToUse: 'Métricas, analytics, números que informaron decisiones',          order: 11 },
  { icon: 'eye',           name: { es: 'Accesibilidad',     en: 'Accessibility'  }, whenToUse: 'Contraste, a11y, lectores de pantalla',                           order: 12 },
  { icon: 'book-open',     name: { es: 'Aprendizaje',       en: 'Learning'       }, whenToUse: 'Reflexión técnica o de proceso',                                   order: 13 },
  { icon: 'zap',           name: { es: 'Hito',              en: 'Milestone'      }, whenToUse: 'Momento importante que merece destacarse visualmente',             order: 14 },
]

// ID predecible: dim-lightbulb, dim-code-2, etc.
const dimId = (icon) => `dim-${icon}`

// ── 1. Crear / actualizar documentos dimension ────────────────────────────────
async function seedDimensions() {
  console.log('Creando documentos dimension…')
  for (const dim of DIMENSIONS) {
    const doc = {
      _type: 'dimension',
      _id:   dimId(dim.icon),
      name:  dim.name,
      slug:  { _type: 'slug', current: dim.icon },
      icon:  dim.icon,
      whenToUse: dim.whenToUse,
      order: dim.order,
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ ${dim.name.es}`)
  }
}

// ── 2. Migrar logEntries de string a reference ────────────────────────────────
async function migrateLogEntries() {
  console.log('\nMigrando logEntries…')

  const items = await client.fetch(`
    *[_type == "playgroundItem" && defined(logEntries)] {
      _id, title,
      logEntries[]{ _key, dimension, date, time, description, tag, images }
    }
  `)

  for (const item of items) {
    if (!item.logEntries?.length) continue

    const updated = item.logEntries.map(entry => {
      // Si ya es una reference (objeto con _ref) no migrar
      if (typeof entry.dimension !== 'string') return entry
      const ref = dimId(entry.dimension)
      return { ...entry, dimension: { _type: 'reference', _ref: ref } }
    })

    await client.patch(item._id).set({ logEntries: updated }).commit()
    console.log(`  ✓ ${item.title?.es ?? item._id} (${item.logEntries.length} entries)`)
  }
}

await seedDimensions()
await migrateLogEntries()
console.log('\n✅ Listo.')
