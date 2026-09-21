/**
 * Patch script — Nimbus 20/09/2026: banco curado, pronóstico, PWA, voz fase 2, curaduría
 *
 * Uso:
 *   node scripts/patch-nimbus-2026-09-20.mjs
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
  const [avance, hito] = await Promise.all([getTagRef('avance'), getTagRef('hito')])

  const entries = [
    {
      _key: 'entry-26',
      date: '2026-09-20',
      time: '01:20',
      dimension: dim('pen-line'),
      tag: avance,
      description: {
        es: 'Nimbus ya no habla de memoria. Cargué el banco curado de frases, etiquetas, condiciones y recomendaciones que venía de unas hojas de cálculo.\n\nTodo lo que dice ahora se lee de Firestore, con una copia local como respaldo por si la nube tiene un mal día. Y si la última frase quedó en un idioma distinto al de la interfaz, Nimbus pide una nueva. Hablar en dos idiomas a la vez le queda bien a un poeta, no a una app del clima.\n\nPrimero que tenga qué decir. Después, dónde.',
        en: 'Nimbus no longer speaks from memory. I loaded the curated bank of phrases, tags, conditions and recommendations that came from a few spreadsheets.\n\nEverything it says now is read from Firestore, with a local copy as a backup in case the cloud has a bad day. And if the last phrase is in a different language than the interface, Nimbus asks for a new one. Speaking two languages at once suits a poet, not a weather app.\n\nFirst, it has to have something to say. Then, where to keep it.',
      },
    },
    {
      _key: 'entry-27',
      date: '2026-09-20',
      time: '02:40',
      dimension: dim('layers'),
      tag: avance,
      description: {
        es: 'El pronóstico Diario pasó a una lista compacta dentro de la tarjeta del tema, con lluvia por día, barra de rango y un comentario de Nimbus por fila. Antes era más largo de lo que necesitaba ser.\n\nAdemás apareció un bloque nuevo, "Nimbus · Esta semana": detecta patrones, elige una pose, escribe una frase por patrón y destaca las filas que importan. Ver la semana entera y que alguien opine sobre ella es lo más cerca que estoy de tener un amigo meteorólogo.\n\nUn arreglo pequeño: el Diario solo muestra días completos, y el título dice cuántos son. Nada de mostrar medio martes.',
        en: 'The Daily forecast became a compact list inside the theme card, with rain per day, a range bar and a comment from Nimbus on each row. It used to be longer than it needed to be.\n\nA new block also showed up, "Nimbus · This week": it detects patterns, picks a pose, writes a phrase per pattern and highlights the rows that matter. Seeing the whole week and having someone comment on it is the closest I’ll get to a weatherman friend.\n\nA small fix: the Daily view only shows full days, and the title says how many there are. No more half a Tuesday.',
      },
    },
    {
      _key: 'entry-28',
      date: '2026-09-20',
      time: '03:48',
      dimension: dim('cloud'),
      tag: avance,
      description: {
        es: 'La PWA empezó a tener personalidad. La barra para instalar la app rota frases de Nimbus y, si dices "Ahora no", se calla siete días. Por una vez, alguien que respeta un no.\n\nEl aviso de versión nueva también usa frases de Nimbus. El service worker espera confirmación antes de actualizarse y busca cambios cada hora, para que la app no se reinicie sola en mitad de lo que estés leyendo.',
        en: 'The PWA started to have a personality. The install bar rotates Nimbus phrases and, if you say "Not now", it stays quiet for seven days. For once, someone who respects a no.\n\nThe new-version notice also uses Nimbus phrases. The service worker waits for confirmation before updating and checks for changes every hour, so the app doesn’t restart itself in the middle of whatever you’re reading.',
      },
    },
    {
      _key: 'entry-29',
      date: '2026-09-20',
      time: '09:35',
      dimension: dim('pen-line'),
      tag: avance,
      description: {
        es: 'Por la mañana, más Nimbus. El Diario lleva ahora una etiqueta corta por fila; la voz se queda para los destacados y la tarjeta final. Actualizar a mano trae el clima y una frase nueva que encaja con ese clima, no una cualquiera.\n\nSumé seis referencias pop para los días y veinte para el resumen semanal, en español e inglés. La semana gris cita Fifty Shades of Grey. Sí, es una app del clima.\n\nLa voz entró en su fase dos: hay frases que exigen rasgos del momento. La lluvia por intensidad, la tendencia, los extremos, la niebla densa. Ya no basta con "llueve": tiene que llover de cierta manera.',
        en: 'In the morning, more Nimbus. The Daily view now has a short label on each row; the voice is kept for the highlights and the final card. Refreshing by hand brings the weather and a new phrase that fits that weather, not just any phrase.\n\nI added six pop references for the days and twenty for the weekly summary, in Spanish and English. The gray week quotes Fifty Shades of Grey. Yes, it’s a weather app.\n\nThe voice entered its second phase: some phrases now require traits of the moment. Rain by intensity, trend, extremes, dense fog. "It’s raining" is no longer enough: it has to rain a certain way.',
      },
    },
    {
      _key: 'entry-30',
      date: '2026-09-20',
      time: '12:30',
      dimension: dim('cloud'),
      tag: avance,
      description: {
        es: 'Antes de dejar que alguien edite lo que Nimbus dice, tocaba construir la base. Fases 0 a 2: el contenido vive en local con un parche en Firestore, las reglas van versionadas, hay estadísticas de uso y una copia de prueba para no experimentar en producción (vite --mode preview).\n\nAgregué una pantalla de diagnóstico de permisos con un veredicto que distingue dos casos que se parecen mucho pero no son lo mismo: reglas sin publicar, y un correo que no es administrador. El cierre de sesión es irreversible, y la curaduría solo se ofrece a quien tiene permisos. Google ahora muestra siempre el selector de cuentas, porque adivinar con cuál entré ya era un deporte.\n\nTambién dejé documentado en docs/NOTIFICACIONES_PUSH.md cómo serán las notificaciones push: automáticas y personalizadas, desde el panel.',
        en: 'Before letting anyone edit what Nimbus says, the foundation had to be built. Phases 0 to 2: content lives locally with a patch in Firestore, rules are versioned, there are usage stats and a test copy so I don’t experiment in production (vite --mode preview).\n\nI added a permissions diagnostic screen with a verdict that tells apart two cases that look alike but aren’t: unpublished rules, and an email that isn’t an administrator. Signing out is irreversible, and curation is only offered to people with permissions. Google now always shows the account picker, because guessing which one I had signed in with had become a sport.\n\nI also documented in docs/NOTIFICACIONES_PUSH.md how push notifications will work: automatic and personalized, from the panel.',
      },
    },
    {
      _key: 'entry-31',
      date: '2026-09-20',
      time: '14:22',
      dimension: dim('layers'),
      tag: hito,
      description: {
        es: 'Ya se puede curar a Nimbus desde la propia app. Hay un núcleo de auditoría con filtro general y de interés, y las ediciones quedan como borrador hasta que las publico.\n\nEn Ajustes → Curaduría → Frases puedo auditar, retirar, restaurar, añadir y publicar. Es la primera vez que le puedo decir a Nimbus "eso no lo digas más" sin abrir un editor de código.\n\nEl último arreglo fue de reglas: el administrador tenía que ser yo. Ahora lo es. Que la app no me reconociera como su dueño fue un ejercicio de humildad que no había pedido.',
        en: 'Nimbus can now be curated from within the app itself. There’s an audit core with a general filter and an interest filter, and edits stay as drafts until I publish them.\n\nIn Settings → Curation → Phrases I can audit, retire, restore, add and publish. It’s the first time I can tell Nimbus "don’t say that anymore" without opening a code editor.\n\nThe last fix was in the rules: the administrator had to be me. Now it is. The app not recognizing me as its owner was an exercise in humility I hadn’t asked for.',
      },
    },
  ]

  console.log('Appending 6 entradas a Nimbus…')
  await client.patch('nimbus-experiment').append('logEntries', entries).commit()
  console.log('\n✅ Entradas agregadas correctamente.')
}

await run()
