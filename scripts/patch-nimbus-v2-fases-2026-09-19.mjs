/**
 * Patch script — Nimbus v2.0: plan de 5 fases + avance F0, F1, F2
 * Reordena las horas de entry-9..11 (inventadas) para que la cronología cuadre.
 *
 * Uso:
 *   node scripts/patch-nimbus-v2-fases-2026-09-19.mjs
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
  const [decision, completado, avance] = await Promise.all([
    getTagRef('decision'),
    getTagRef('completado'),
    getTagRef('avance'),
  ])

  console.log('Reubicando horas de entry-9..11…')
  await client
    .patch('nimbus-experiment')
    .set({
      'logEntries[_key=="entry-9"].date':  '2026-09-18',
      'logEntries[_key=="entry-9"].time':  '22:30',
      'logEntries[_key=="entry-10"].date': '2026-09-18',
      'logEntries[_key=="entry-10"].time': '22:50',
      'logEntries[_key=="entry-11"].date': '2026-09-18',
      'logEntries[_key=="entry-11"].time': '23:10',
    })
    .commit()

  const entries = [
    {
      _key: 'entry-12',
      date: '2026-09-18',
      time: '23:20',
      dimension: dim('route'),
      tag: decision,
      description: {
        es: 'Para llegar a la v2.0 dividí el trabajo en cinco fases, en orden, para no reconstruir todo a la vez:\n\nF0 · Andamiaje: navegación de 3 tabs, rutas anidadas y cabecera compartida.\nF1 · Dominio: la lógica de cuándo Nimbus dice algo nuevo y cómo se registra. Sin interfaz.\nF2 · Hero y card: el personaje por capas y la tarjeta "Nimbus · Ahora".\nF3 · Tab Nimbus: la línea de tiempo de frases y los favoritos.\nF4 · Pronóstico "Hoy": próximas horas, condiciones y resumen.\nF5 · Recomienda y Compartir: qué ponerse, si llevar paraguas y la imagen para compartir.\n\nPrimero la estructura y la lógica, después lo que se ve.',
        en: 'To get to v2.0 I split the work into five ordered phases, so I don’t rebuild everything at once:\n\nF0 · Scaffolding: 3-tab navigation, nested routes and a shared header.\nF1 · Domain: the logic for when Nimbus says something new and how it’s logged. No UI.\nF2 · Hero and card: the layered character and the “Nimbus · Now” card.\nF3 · Nimbus tab: the phrase timeline and favorites.\nF4 · Forecast “Today”: upcoming hours, conditions and summary.\nF5 · Recommends and Share: what to wear, whether to bring an umbrella, and the shareable image.\n\nStructure and logic first, what you see later.',
      },
    },
    {
      _key: 'entry-13',
      date: '2026-09-18',
      time: '23:42',
      dimension: dim('code-2'),
      tag: completado,
      description: {
        es: 'F0 terminada y pusheada.\n\nLa navegación ahora tiene tres tabs: Inicio, Pronóstico y Nimbus. Rutas anidadas, una cabecera compartida, el Diario movido bajo Pronóstico, y Ajustes escondido detrás del engranaje.',
        en: 'F0 done and pushed.\n\nNavigation now has three tabs: Home, Forecast and Nimbus. Nested routes, a shared header, the Journal moved under Forecast, and Settings tucked behind the gear.',
      },
    },
    {
      _key: 'entry-14',
      date: '2026-09-19',
      time: '00:12',
      dimension: dim('code-2'),
      tag: completado,
      description: {
        es: 'F1 terminada y pusheada. Treinta minutos después de F0, y sin tocar la interfaz.\n\nphraseTrigger decide cuándo Nimbus tiene algo nuevo que decir. phraseLog guarda las frases de los últimos 7 días y los favoritos, en local y en Firestore. Además, datos nuevos en el clima: pop, at y fetchedAt.\n\nPrimero que piense, después que se vea.',
        en: 'F1 done and pushed. Thirty minutes after F0, and without touching the interface.\n\nphraseTrigger decides when Nimbus has something new to say. phraseLog stores the last 7 days of phrases and favorites, locally and in Firestore. Plus new weather data: pop, at and fetchedAt.\n\nThink first, show later.',
      },
    },
    {
      _key: 'entry-15',
      date: '2026-09-19',
      time: '00:42',
      dimension: dim('layers'),
      tag: avance,
      description: {
        es: 'F2 terminada, con commit local todavía sin pushear.\n\nEl hero ahora se arma por capas: cielo, clima, escenario y Nimbus. Los textos toman su color según la condición del clima. Y aparece la tarjeta "Nimbus · Ahora", con like y compartir en texto.\n\nEs la primera fase donde la v2 se parece a lo que quería.',
        en: 'F2 done, committed locally and not pushed yet.\n\nThe hero is now built in layers: sky, weather, scene and Nimbus. Text colors follow the weather condition. And the “Nimbus · Now” card shows up, with like and text sharing.\n\nThe first phase where v2 starts to look like what I wanted.',
      },
    },
  ]

  console.log('Appending 4 entradas a Nimbus…')
  await client.patch('nimbus-experiment').append('logEntries', entries).commit()
  console.log('\n✅ Listo.')
}

await run()
