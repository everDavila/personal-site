/**
 * Patch script — Nimbus: personaje, simplificación de interfaz y arranque de v2.0
 * 19/09/2026
 *
 * Uso:
 *   node scripts/patch-nimbus-v2-2026-09-19.mjs
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
  const [avance, leccion, decision] = await Promise.all([
    getTagRef('avance'),
    getTagRef('leccion'),
    getTagRef('decision'),
  ])

  const entries = [
    {
      _key: 'entry-9',
      date: '2026-09-19',
      time: '00:10',
      dimension: dim('layers'),
      tag: avance,
      description: {
        es: 'Retomo Nimbus por el personaje. Lo reestructuré y probé versiones más simples, pensando en algo que más adelante pueda animarse sin volverse un problema.\n\nUn personaje que hoy se ve bien pero mañana no se puede mover es un dibujo, no una mascota.',
        en: 'Back to Nimbus, starting with the character. I restructured it and tested simpler versions, with future animation in mind.\n\nA character that looks good today but can’t move tomorrow is an illustration, not a mascot.',
      },
    },
    {
      _key: 'entry-10',
      date: '2026-09-19',
      time: '00:22',
      dimension: dim('layers'),
      tag: leccion,
      description: {
        es: 'La versión 1 de la interfaz era simple a propósito: quería verla funcionando antes de decidir nada más. Después vinieron iteraciones más cargadas, y ahí apareció el riesgo: terminar siendo una app del clima cualquiera.\n\nLa interfaz pasó por un proceso de simplificación más de tres veces. Cada ronda quitaba algo que parecía importante y no lo era.\n\nAl final encontré un punto equilibrado. No es la versión más completa, es la que me deja dejar de iterar.',
        en: 'Interface v1 was simple on purpose: I wanted to see it working before deciding anything else. Then came heavier iterations, and that’s where the risk showed up: ending up as just another weather app.\n\nThe interface went through a simplification process more than three times. Each round removed something that seemed important and wasn’t.\n\nIn the end I found a balanced point. It isn’t the most complete version; it’s the one that lets me stop iterating.',
      },
    },
    {
      _key: 'entry-11',
      date: '2026-09-19',
      time: '00:38',
      dimension: dim('code-2'),
      tag: decision,
      description: {
        es: 'Con ese equilibrio encontrado, reconstruyo la arquitectura y la interfaz desde cero para la versión 2.0.\n\nLa v1 sirvió para validar la idea. La v2 se construye sobre lo que aprendí de ella, no sobre lo que quedó de ella.',
        en: 'With that balance found, I’m rebuilding the architecture and the interface from scratch for version 2.0.\n\nv1 was there to validate the idea. v2 gets built on what I learned from it, not on what was left of it.',
      },
    },
  ]

  console.log('Appending 3 entradas a Nimbus…')
  await client.patch('nimbus-experiment').append('logEntries', entries).commit()
  console.log('\n✅ Entradas agregadas correctamente.')
}

await run()
