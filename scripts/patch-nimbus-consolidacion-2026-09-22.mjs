/**
 * Patch script — consolidación de la bitácora de Nimbus (2026-09-22)
 *
 * Qué hace, y qué NO hace:
 * - Funde 4 entradas fragmentadas del 18-19/09 (plan de fases + F0 + F1 + F2) en una sola,
 *   sin listar "F0/F1/F2" ni nombres de funciones internas (phraseTrigger, phraseLog).
 * - Funde 20/09 02:40 + 09:35 (Diario/Esta semana + voz fase 2) en una sola.
 * - Funde 20/09 12:30 + 14:22 (base de curaduría + interfaz de curaduría) en una sola,
 *   con dimensión Interfaz y tag Hito (antes Infraestructura/Avance + Interfaz/Hito).
 * - Reescribe Olimpo (20/09 15:30) para quitar el listado "Fase A/B/C/D".
 * - Pule dos cierres (18/09 01:15 y 23:10) con una línea más filosa, sin cambiar el hecho.
 * - NO toca: mayo 2026, 17:16+17:17 (cerebros), 19:18+20:20 (lugares), 21:40 (poses),
 *   22:08 y 22:30 del 19/09 (ya sin problema), 21:00 y 22:30 del 20/09 (texto de Ever,
 *   no se toca), ni ninguna otra entrada no listada aquí.
 *
 * Uso:
 *   node scripts/patch-nimbus-consolidacion-2026-09-22.mjs
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
const DOC = 'nimbus-experiment'

async function getTagRef(slug) {
  const id = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug })
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

async function run() {
  const hito = await getTagRef('hito')

  console.log('1/6 — puliendo cierre de entry-8 (publicación v1.0)…')
  await client.patch(DOC).set({
    'logEntries[_key=="entry-8"].description': {
      es: 'Primera publicación en una URL pública: v1.0 de Nimbus ya está disponible para cualquiera que quiera probarlo.\n\nPublicarlo no significó que estuviera terminado; solo significó que ahora mis errores tenían público.',
      en: 'First release on a public URL: Nimbus v1.0 is now available for anyone who wants to try it.\n\nPublishing it didn’t mean it was finished; it just meant my mistakes now had an audience.',
    },
  }).commit()

  console.log('2/6 — puliendo cierre de entry-11 (decisión de reconstruir v2)…')
  await client.patch(DOC).set({
    'logEntries[_key=="entry-11"].description': {
      es: 'Con ese equilibrio encontrado, reconstruyo la arquitectura y la interfaz desde cero para la versión 2.0.\n\nLa v1 sirvió para validar la idea. La v2 no se construye sobre lo que quedó de ella, sino sobre lo que aprendí al romperla.',
      en: 'With that balance in place, I’m rebuilding the architecture and the interface from scratch for version 2.0.\n\nv1 was there to validate the idea. v2 isn’t built on what was left of it, but on what I learned by breaking it.',
    },
  }).commit()

  console.log('3/6 — fundiendo el plan de fases + F0 + F1 + F2 en entry-12…')
  await client.patch(DOC).set({
    'logEntries[_key=="entry-12"].description': {
      es: 'Para llegar a la v2.0 dividí el trabajo en fases: primero la estructura y la lógica, después lo que se ve.\n\nEncadené las primeras en una sola noche. La navegación se ordenó en tres pestañas —Inicio, Pronóstico y Nimbus—, con el Diario escondido bajo Pronóstico y Ajustes detrás del engranaje. Después vino el cerebro, todavía sin ninguna interfaz: la lógica de cuándo Nimbus tiene algo nuevo que decir, y un registro de sus frases en Firestore. Recién al final apareció algo que se pudiera ver: un hero armado por capas —cielo, clima, escenario y Nimbus— con la tarjeta "Nimbus · Ahora".\n\nEs la primera vez que la v2 se parece a lo que tenía en la cabeza.',
      en: 'To get to v2.0 I split the work into phases: first the structure and the logic, then what you actually see.\n\nI chained the first ones together in a single night. Navigation got sorted into three tabs —Home, Forecast and Nimbus—, with the Journal tucked under Forecast and Settings behind the gear icon. Then came the brain, with no interface yet: the logic for when Nimbus has something new to say, plus a log of its phrases in Firestore. Only at the end did something show up that you could actually see: a hero built in layers —sky, weather, scenery and Nimbus— with the "Nimbus · Now" card.\n\nIt’s the first time v2 starts to look like what I had in my head.',
    },
  }).commit()
  console.log('   retirando entry-13, entry-14, entry-15 (ya fundidas arriba)…')
  await client.patch(DOC).unset([
    'logEntries[_key=="entry-13"]',
    'logEntries[_key=="entry-14"]',
    'logEntries[_key=="entry-15"]',
  ]).commit()

  console.log('4/6 — fundiendo Diario/Esta semana + voz fase 2 en entry-27…')
  await client.patch(DOC).set({
    'logEntries[_key=="entry-27"].dimension': dim('pen-line'),
    'logEntries[_key=="entry-27"].description': {
      es: 'El pronóstico Diario pasó a ser una lista compacta, con lluvia por día, rango térmico y un comentario de Nimbus en cada fila. Encima apareció un bloque nuevo, "Nimbus · Esta semana": detecta patrones en los próximos días, elige una pose y suelta una lectura general. Es lo más cerca que estoy de tener un amigo meteorólogo, sin tener que invitarle un café.\n\nLa voz también maduró. Sumé seis referencias pop para los días y veinte para el resumen semanal, en español e inglés —la semana gris cita Fifty Shades of Grey; si vamos a sufrir el cielo de Lima, que sea con algo de ironía—. Y ya no basta con reaccionar a "llueve" o "hace frío": ahora reacciona a la intensidad, la tendencia y la niebla densa.\n\nUn arreglo pequeño de paso: el Diario solo muestra días completos. Nada de mostrar medio martes.',
      en: 'The Daily forecast became a compact list, with rain per day, a temperature range and a comment from Nimbus on every row. On top of that came a new block, "Nimbus · This Week": it detects patterns over the coming days, picks a pose and gives a general read. It’s the closest I’ll get to having a meteorologist friend, without having to buy him a coffee.\n\nThe voice also grew up. I added six pop references for daily use and twenty for the weekly summary, in Spanish and English —the grey week quotes Fifty Shades of Grey; if we’re going to suffer Lima’s sky, might as well do it with some irony—. And "it’s raining" or "it’s cold" is no longer enough: now it reacts to intensity, trend and dense fog.\n\nOne small fix along the way: the Daily view only shows full days. No more showing half a Tuesday.',
    },
  }).commit()
  console.log('   retirando entry-29 (ya fundida arriba)…')
  await client.patch(DOC).unset(['logEntries[_key=="entry-29"]']).commit()

  console.log('5/6 — fundiendo base de curaduría + interfaz de curaduría en entry-30…')
  await client.patch(DOC).set({
    'logEntries[_key=="entry-30"].dimension': dim('layers'),
    'logEntries[_key=="entry-30"].tag': hito,
    'logEntries[_key=="entry-30"].description': {
      es: 'Antes de dejar que alguien edite lo que Nimbus dice, tocaba construir la base: el contenido vive en local con un parche en Firestore, las reglas quedan versionadas y hay una pantalla de diagnóstico que distingue dos cosas que se parecen mucho pero no son lo mismo —reglas sin publicar, y un correo que no es administrador—. Un detalle de paso: Google ahora siempre muestra el selector de cuentas, porque adivinar con cuál había entrado ya era un deporte.\n\nCon esa base lista, ya se puede curar a Nimbus desde la propia app: auditar, retirar, restaurar, añadir y publicar frases, sin abrir un editor de código. El último ajuste fue de reglas: el administrador tenía que ser yo. Ahora lo es. Que la app no me reconociera como su dueño fue un ejercicio de humildad que no había pedido.',
      en: 'Before letting anyone edit what Nimbus says, I had to build the foundation: content lives locally with a patch in Firestore, the rules are versioned, and there’s a diagnostics screen that tells apart two things that look alike but aren’t —unpublished rules, and an email that isn’t an admin. One small fix along the way: Google now always shows the account picker, since guessing which one I’d signed in with had become a sport.\n\nWith that foundation in place, Nimbus can now be curated from inside the app itself: audit, retire, restore, add and publish phrases, no code editor required. The last fix was to the rules: the administrator had to be me. Now it is. The app not recognizing me as its owner was an exercise in humility I hadn’t asked for.',
    },
  }).commit()
  console.log('   retirando entry-31 (ya fundida arriba)…')
  await client.patch(DOC).unset(['logEntries[_key=="entry-31"]']).commit()

  console.log('6/6 — reescribiendo Olimpo (entry-32) sin listar fases…')
  await client.patch(DOC).set({
    'logEntries[_key=="entry-32"].description': {
      es: 'Le puse Olimpo al panel de administración. El nombre lo elegí yo: "admin" sonaba a menú de una intranet. Solo lo veo yo, en /olimpo.\n\nEmpezó como una tabla de frases y terminó siendo un panel completo, con vista previa en Nimbus, selección múltiple y una sección aparte para permisos y mensajes. La regla que más me costó, y la que más me gusta: editar una frase es retirar la vieja y añadir la nueva. Si la vieja ya tenía reacciones positivas, se queda activa, y la corregida entra como una frase distinta.\n\nNadie pierde sus likes por mis ganas de corregir una coma a medianoche.',
      en: 'I named the admin panel Olimpo. I picked the name myself: "admin" sounded like an intranet menu. Only I can see it, at /olimpo.\n\nIt started as a table of phrases and grew into a full panel, with a live preview in Nimbus, multi-select and a separate section for permissions and messages. The rule that cost me the most, and that I like the most: editing a phrase means retiring the old one and adding a new one. If the old one already had positive reactions, it stays active, and the corrected version comes in as a separate phrase.\n\nNobody loses their likes because I felt like fixing a comma at midnight.',
    },
  }).commit()

  console.log('\n✅ Consolidación aplicada.')
}

await run()
