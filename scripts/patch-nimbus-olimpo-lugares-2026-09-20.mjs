/**
 * Patch script — Nimbus 20/09/2026 (tarde/noche): Olimpo, avisos editables, push (diseño),
 * betas por función, Explorar lugares (motor + rediseño) y cierre de v2 estable.
 * Fuente: appclima/BITACORA.md
 *
 * Uso:
 *   node scripts/patch-nimbus-olimpo-lugares-2026-09-20.mjs
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
  const [avance, duda, decision, hito] = await Promise.all([
    getTagRef('avance'), getTagRef('duda'), getTagRef('decision'), getTagRef('hito'),
  ])

  const entries = [
    {
      _key: 'entry-32',
      date: '2026-09-20',
      time: '15:30',
      dimension: dim('layers'),
      tag: avance,
      description: {
        es: 'Le puse Olimpo al panel de administración. El nombre lo elegí yo: "admin" sonaba a menú de una intranet.\n\nSolo lo veo yo, en /olimpo. La fase A es Frases como tabla: resumen arriba, pestañas con contador, orden por vistas y reacciones, filtros y paginación. La fase B agrega un panel lateral para crear y editar con vista previa en Nimbus, y acciones en bloque. La fase C lo parte en dos niveles: Frases (Home, Nimbus recomienda, Condiciones climáticas y Nimbus esta semana), y Permisos y Mensajes.\n\nEditar una frase es retirar la vieja y añadir la nueva. Si la vieja ya tenía reacciones positivas, se queda activa, y la editada entra como una frase distinta. Nadie pierde sus likes por mis ganas de corregir una coma.\n\nQueda para después la fase D: importar y referencia.',
        en: 'I named the admin panel Olimpo. I picked the name myself: "admin" sounded like an intranet menu.\n\nOnly I can see it, at /olimpo. Phase A is Phrases as a table: summary on top, tabs with counters, sorting by views and reactions, filters and pagination. Phase B adds a side panel to create and edit with a live preview in Nimbus, plus bulk actions. Phase C splits it into two levels: Phrases (Home, Nimbus recommends, Weather conditions and Nimbus this week), and Permissions and Messages.\n\nEditing a phrase means retiring the old one and adding the new one. If the old one already had positive reactions, it stays active and the edited one comes in as a separate phrase. Nobody loses their likes because I felt like fixing a comma.\n\nPhase D is still to come: import and reference.',
      },
    },
    {
      _key: 'entry-33',
      date: '2026-09-20',
      time: '16:40',
      dimension: dim('pen-line'),
      tag: avance,
      description: {
        es: 'Ahora yo escribo lo que dice el aviso de "hay una versión nueva". Un bloque por idioma, con título, mensaje y fecha de caducidad, y un botón para quitarlo si me arrepiento. Vive en Firestore, sin servidor nuevo. Si no hay mensaje, o ya caducó, el aviso vuelve a decir la frase suelta de siempre.\n\nTambién queda un historial de lo que publiqué, con "Usar de nuevo". Un archivo de mis propios avisos: la versión más pequeña de la nostalgia.\n\nHay dos reglas que conviene aprender a la primera: publicar el mensaje antes de desplegar, y recordar que lo dibuja la versión que la persona ya tiene instalada, no la nueva. Además arreglé que en móviles estrechos el texto quedara aplastado: los botones bajan a otra fila.',
        en: 'Now I write what the "new version available" notice says. One block per language, with a title, a message and an expiry date, plus a button to remove it if I change my mind. It lives in Firestore, with no new server. If there’s no message, or it has expired, the notice goes back to the usual loose phrase.\n\nThere’s also a history of what I’ve published, with "Use again". An archive of my own notices: the smallest possible version of nostalgia.\n\nThere are two rules worth learning the first time: publish the message before deploying, and remember that it is drawn by the version the person already has installed, not the new one. I also fixed the text getting squashed on narrow phones: the buttons now drop to another row.',
      },
    },
    {
      _key: 'entry-34',
      date: '2026-09-20',
      time: '17:10',
      dimension: dim('cloud'),
      tag: duda,
      description: {
        es: 'Las notificaciones push, por ahora, son un documento y no una función. Dejé escrito el diseño y los tipos, sin una sola línea de código de suscripción ni de envío.\n\nLo que falta no es técnico, es mío. Decidir entre FCM con plan Blaze o un Web Push propio, si habrá sesión anónima, cómo segmentar, qué límites poner y qué dicen las automáticas. Cinco decisiones.\n\nUna app que te avisa cuando ella quiere es una app que uno desinstala. Prefiero pensarlo bien antes de molestar a nadie.',
        en: 'Push notifications, for now, are a document and not a feature. I wrote down the design and the types, without a single line of subscription or sending code.\n\nWhat’s missing isn’t technical, it’s mine. Deciding between FCM on the Blaze plan or my own Web Push, whether there will be anonymous sessions, how to segment, what limits to set and what the automatic ones say. Five decisions.\n\nAn app that notifies you whenever it feels like it is an app people uninstall. I’d rather think it through before bothering anyone.',
      },
    },
    {
      _key: 'entry-35',
      date: '2026-09-20',
      time: '18:00',
      dimension: dim('cloud'),
      tag: decision,
      description: {
        es: 'Las funciones grandes ahora se prueban aparte, en /nimbus-beta/<nombre>/, sin tocar lo que ya funciona en /nimbus. Cada beta se construye con su propia base y una etiqueta "BETA", sin service worker y sin indexar, y se sube con un script que primero simula y solo después toca algo.\n\nVa fuera de /nimbus porque el service worker de producción tiene ese alcance, y una beta ahí adentro terminaría cacheada como si fuera la versión real.\n\nLa advertencia honesta: una beta comparte origen con producción. Mismo Firestore, misma sesión, mismo localStorage. Es un laboratorio, pero con la puerta abierta al comedor.',
        en: 'Big features are now tested separately, at /nimbus-beta/<name>/, without touching what already works at /nimbus. Each beta is built with its own base and a "BETA" label, with no service worker and not indexed, and it’s uploaded with a script that simulates first and only then touches anything.\n\nIt lives outside /nimbus because the production service worker has that scope, and a beta in there would end up cached as if it were the real version.\n\nThe honest warning: a beta shares its origin with production. Same Firestore, same session, same localStorage. It’s a lab, but with the door open to the dining room.',
      },
    },
    {
      _key: 'entry-36',
      date: '2026-09-20',
      time: '19:10',
      dimension: dim('target'),
      tag: avance,
      description: {
        es: 'Nueva función: Explora otros lugares. La persona elige el clima que le apetece (frío, calor, templado o lluvia), hasta dónde está dispuesta a llegar y para cuándo, y Nimbus dice dónde está.\n\nPor dentro es una rejilla de puntos alrededor de donde estás. Consulto el clima de cada uno en Open-Meteo, los puntúo según el clima elegido y a los mejores les pongo nombre con geocodificación inversa. Si nada mejora lo que hay aquí, la respuesta es "quédate". Que Nimbus sea capaz de decirte que no hace falta salir de casa me parece una virtud.\n\nEl rango nació como tiempo en coche, de 30 minutos a 4 horas, y lo cambié a kilómetros en línea recta, de 50 a 1.000. Descarté las rutas reales: el tráfico lo calcula mejor la app de mapas. Entró también "Otra fecha", hasta 15 días. "Ver en mapas" apunta al pueblo y no al punto de la rejilla, porque Google no calcula rutas a una ladera, y "Buscar vuelos" solo aparece desde 250 km y con aeropuerto en los dos extremos.\n\nLo caro son las cuotas: cada punto cuenta como una llamada, así que una búsqueda de 1.000 km son 97. Si se agotan, la pantalla dice "saturado" en vez de mentir con un "aquí no hay pueblo".',
        en: 'New feature: Explore other places. The person picks the weather they feel like (cold, hot, mild or rain), how far they’re willing to go and for when, and Nimbus says where to find it.\n\nInside, it’s a grid of points around where you are. I fetch each one’s weather from Open-Meteo, score them against the chosen weather and give the best ones a name using reverse geocoding. If nothing beats what’s here, the answer is "stay". Nimbus being able to tell you there’s no need to leave the house strikes me as a virtue.\n\nThe range started as driving time, from 30 minutes to 4 hours, and I changed it to straight-line kilometers, from 50 to 1,000. I dropped real routes: traffic is better calculated by the maps app. "Another date" also came in, up to 15 days. "See on maps" points to the town and not to the grid point, because Google won’t calculate a route to a hillside, and "Find flights" only shows up from 250 km and with an airport at both ends.\n\nThe expensive part is quotas: every point counts as a call, so a 1,000 km search is 97. If they run out, the screen says "overloaded" instead of lying with a "there’s no town here".',
      },
    },
    {
      _key: 'entry-37',
      date: '2026-09-20',
      time: '21:00',
      dimension: dim('layers'),
      tag: avance,
      description: {
        es: 'Hoy rediseñé esa pantalla y el cambio es de fondo: pasa de buscador a decisión. Cuando hay resultados, el formulario se pliega en un resumen ("Frío · hasta 500 km · Hoy") con un botón para cambiarlo. El primer resultado es la recomendación, en una tarjeta grande, y los otros dos quedan como "Otras opciones".\n\nCada uno trae una razón de Nimbus: frío, calor, templado, lluvia, altura o "cerca". Nimbus recomienda y el mapa demuestra, así que saqué de la tarjeta los kilómetros, el rumbo y el aeropuerto.\n\nLo dejo dicho con honestidad: las 25 pruebas del motor pasan y el type-check está limpio, pero todavía no la vi en un navegador con datos reales. Y las frases de las razones son un borrador que falta pasar por mi voz.',
        en: 'Today I redesigned that screen and the change goes deep: it moves from search tool to decision. When there are results, the form folds into a summary ("Cold · up to 500 km · Today") with a button to change it. The first result is the recommendation, in a big card, and the other two stay as "Other options".\n\nEach one comes with a reason from Nimbus: cold, hot, mild, rain, altitude or "close by". Nimbus recommends and the map proves it, so I took the kilometers, the heading and the airport off the card.\n\nI’ll say it honestly: the 25 engine tests pass and the type-check is clean, but I haven’t seen it in a browser with real data yet. And the reason phrases are a draft that still has to go through my voice.',
      },
    },
    {
      _key: 'entry-38',
      date: '2026-09-20',
      time: '22:30',
      dimension: dim('zap'),
      tag: hito,
      description: {
        es: 'Nimbus v2 estable. Hoy quedó puesta al día y en producción, con su tag v2-estable. Las pruebas pasaron 351 de 351 en cuatro proyectos, con type-check y build limpios. Dos pruebas viejas se portaban mal y las arreglé: una dependía de que el mensaje real que publiqué no pisara al de prueba, y la otra recordaba un tema oscuro que ya no existe.\n\nDejé escrito el flujo de trabajo: una carpeta, una rama, y las betas como única excepción. Es la lección de haber tenido dos carpetas y dos ramas, con cada instancia de Claude editando la que tenía a mano. Fue un caos con buenos modales.\n\nQueda abierto el escritorio (móvil primero) y el arte definitivo: skyline de Lima, playa, poses. Eso lo dibujo yo.',
        en: 'Nimbus v2 stable. Today it was brought up to date and shipped to production, tagged v2-estable. Tests passed 351 out of 351 across four projects, with a clean type-check and build. Two old tests were misbehaving and I fixed them: one depended on the real message I had published not overriding the test one, and the other remembered a dark theme that no longer exists.\n\nI wrote down the workflow: one folder, one branch, and betas as the only exception. It’s the lesson from having had two folders and two branches, with every Claude instance editing whichever one it had at hand. It was chaos with good manners.\n\nStill open: the desktop layout (mobile first) and the final art: Lima skyline, beach, poses. I’ll draw those myself.',
      },
    },
  ]

  console.log('Appending 7 entradas a Nimbus…')
  await client.patch('nimbus-experiment').append('logEntries', entries).commit()
  console.log('\n✅ Entradas agregadas correctamente.')
}

await run()
