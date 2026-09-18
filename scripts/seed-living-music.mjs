/**
 * Seed script — LivingMusic
 * Visualizador tipográfico de canciones — 10 entradas de bitácora, 04–05 jul 2026.
 *
 * Uso:
 *   node scripts/seed-living-music.mjs
 *
 * Requiere SANITY_TOKEN en .env.local
 * Requiere que existan: logTags (seed-nimbus) + dimension docs (seed-dimensions)
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

// ── Helpers ───────────────────────────────────────────────────────────────────
let _k = 0
const k = () => `k${++_k}`

const p = (text) => ({
  _type: 'block', _key: k(), style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

// Dimension refs — IDs predecibles del seed-dimensions
const dim = (icon) => ({ _type: 'reference', _ref: `dim-${icon}` })

async function getTagRef(slug) {
  const id = await client.fetch(
    `*[_type == "logTag" && slug.current == $slug][0]._id`, { slug }
  )
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

// ── Contenido ─────────────────────────────────────────────────────────────────
const ideaEs = [
  p('Un visualizador tipográfico de canciones — explícitamente no un karaoke, reproductor, ni cliente de Spotify.'),
  p('La inspiración vino del Cotodama Lyric Speaker: un dispositivo donde la tipografía dejaba de ser un simple texto para convertirse en parte de la música. Las palabras no aparecían para ser leídas, sino para ser sentidas. Después de buscar una aplicación que hiciera algo parecido y no encontrarla, la pregunta fue inevitable: si no existe, ¿por qué no construir una versión pequeña para entender cómo funciona?'),
]

const ideaEn = [
  p('A typographic visualizer of songs — explicitly not a karaoke, a player, or a Spotify client.'),
  p('The inspiration came from the Cotodama Lyric Speaker: a device where typography stopped being simple text and became part of the music. Words didn\'t appear to be read, they appeared to be felt. After searching for an app that did something similar and not finding it, the question became inevitable: if it doesn\'t exist, why not build a small version to understand how it works?'),
]

const whyEs = [
  p('Muchas veces un proyecto nace para resolver un problema. Este nació por curiosidad.'),
  p('No quería competir con Spotify ni construir otro reproductor de música. Lo que interesaba era explorar una idea: si la música puede emocionar por sí sola, ¿qué ocurre cuando la tipografía también interpreta la canción? Cada principio del proyecto viene de esa pregunta — la música manda, la tipografía es la interfaz, el movimiento debe tener intención y nunca ser decorativo.'),
]

const whyEn = [
  p('Many projects are born to solve a problem. This one was born out of curiosity.'),
  p('The goal wasn\'t to compete with Spotify or build another music player. What mattered was exploring an idea: if music can move you on its own, what happens when typography also interprets the song? Every principle of the project comes from that question — music leads, typography is the interface, movement must have intention and never be decorative.'),
]

// ── Main ──────────────────────────────────────────────────────────────────────
async function seedLivingMusic() {
  console.log('Cargando tags…')
  const [exploracion, leccion, decision, fallo, pivote, hito] = await Promise.all([
    getTagRef('exploracion'),
    getTagRef('leccion'),
    getTagRef('decision'),
    getTagRef('fallo'),
    getTagRef('pivote'),
    getTagRef('hito'),
  ])

  console.log('\nCreando experimento LivingMusic…')

  const doc = {
    _type: 'playgroundItem',
    _id:   'living-music-experiment',
    title: { es: 'LivingMusic', en: 'LivingMusic' },
    slug:  { _type: 'slug', current: 'living-music' },
    localizedSlug: {
      es: { _type: 'slug', current: 'living-music' },
      en: { _type: 'slug', current: 'living-music' },
    },
    category: 'experiments',
    status:   'en_proceso',
    year:     2026,
    hidden:   false,
    description: {
      es: 'Un visualizador tipográfico donde la tipografía interpreta la música — la experiencia que buscaba y no existía.',
      en: 'A typographic visualizer where typography interprets music — the experience I was looking for and didn\'t exist.',
    },
    idea: { es: ideaEs, en: ideaEn },
    why:  { es: whyEs,  en: whyEn  },
    logEntries: [

      // 1 — 2026-07-04 23:50 — Idea / Exploración
      {
        _key: 'entry-1',
        date: '2026-07-04',
        time: '23:50',
        dimension: dim('lightbulb'),
        tag: exploracion,
        description: {
          es: 'No estaba buscando un proyecto nuevo. Todo empezó después de ver varios videos del Cotodama Lyric Speaker — la tipografía dejaba de ser un simple texto para convertirse en parte de la música. Las palabras aparecían, respiraban y desaparecían siguiendo el ritmo de cada canción. Era una experiencia visual, no un karaoke. Después de buscar encontré muchos reproductores con letras sincronizadas, pero ninguno trataba la tipografía como el elemento principal de la experiencia. Todos resolvían el problema de leer una canción. Yo estaba buscando sentirla desde otro lugar. Apareció una pregunta bastante sencilla: si la aplicación que quiero no existe, ¿por qué no construir una versión pequeña para entender cómo funciona? Ese fue el verdadero inicio de LivingMusic. No quería competir con Spotify ni construir otro reproductor — lo que me interesaba era explorar qué ocurre cuando la tipografía también interpreta la canción.',
          en: 'I wasn\'t looking for a new project. It all started after watching several videos of the Cotodama Lyric Speaker — typography stopped being simple text and became part of the music. Words appeared, breathed, and disappeared following the rhythm of each song. It was a visual experience, not karaoke. After searching I found many players with synchronized lyrics, but none treated typography as the main element of the experience. A simple question appeared: if the app I want doesn\'t exist, why not build a small version to understand how it works? That was the real start of LivingMusic.',
        },
      },

      // 2 — 2026-07-04 23:55 — Aprendizaje / Lección
      {
        _key: 'entry-2',
        date: '2026-07-04',
        time: '23:55',
        dimension: dim('book-open'),
        tag: leccion,
        description: {
          es: 'Pensé que la parte más sencilla sería obtener las letras sincronizadas. Después de investigar descubrí que era exactamente al revés. Spotify y Apple Music no exponen letras sincronizadas mediante sus APIs públicas. Las soluciones abiertas suelen ofrecer sincronización por línea — suficiente para un karaoke tradicional, pero insuficiente para el tipo de experiencia que imaginaba. Musixmatch sí dispone de sincronización mucho más precisa, incluso por palabra, pero esa funcionalidad pertenece a acuerdos comerciales orientados a grandes empresas. La decisión fue cambiar de estrategia: el MVP trabajará con un pequeño catálogo de canciones cuidadosamente preparadas, usando LRCLIB como fuente abierta y forced alignment casero para timestamps por palabra. A veces la mejor decisión no consiste en encontrar una solución más compleja, sino en reducir el alcance hasta recuperar el control del problema.',
          en: 'I thought the easiest part would be getting synchronized lyrics. After researching, I discovered it was exactly the opposite. Spotify and Apple Music don\'t expose synchronized lyrics through their public APIs. Open solutions usually offer line-level sync — enough for traditional karaoke, but insufficient for the experience I had in mind. Musixmatch does have word-level precision, but that\'s behind commercial agreements. The decision: the MVP uses a small curated catalog with LRCLIB as the open source and manual forced alignment for word timestamps. Sometimes the best decision is reducing scope until you regain control of the problem.',
        },
      },

      // 3 — 2026-07-05 00:00 — Producto / Decisión
      {
        _key: 'entry-3',
        date: '2026-07-05',
        time: '00:00',
        dimension: dim('target'),
        tag: decision,
        description: {
          es: 'La primera versión del proyecto asumía que Spotify y Apple Music serían el punto de partida. Después de entender las limitaciones de las APIs esa idea dejó de tener sentido. LivingMusic no necesita conectarse a un servicio de streaming para demostrar su propuesta de valor — necesita demostrar que una canción puede adquirir una identidad visual propia. El MVP trabajará únicamente con un pequeño catálogo local. Si la experiencia funciona con cinco canciones, más adelante podrá crecer. Si no funciona con cinco, tampoco funcionará con cinco millones. Era fácil caer en la tentación de construir primero la infraestructura. Preferí validar primero la experiencia.',
          en: 'The first version of the project assumed Spotify and Apple Music would be the starting point. After understanding the API limitations, that idea stopped making sense. LivingMusic doesn\'t need to connect to a streaming service to demonstrate its value — it needs to prove that a song can acquire its own visual identity. The MVP works with a small local catalog. If the experience works with five songs, it can grow later. If it doesn\'t work with five, it won\'t work with five million either.',
        },
      },

      // 4 — 2026-07-05 00:05 — Interfaz / Decisión
      {
        _key: 'entry-4',
        date: '2026-07-05',
        time: '00:05',
        dimension: dim('layers'),
        tag: decision,
        description: {
          es: 'Muy pronto apareció una decisión que terminó definiendo todo el proyecto: no quería un único estilo visual para todas las canciones. Una balada no comunica lo mismo que un rap. Una pieza instrumental no transmite el mismo ritmo que una canción electrónica. La interfaz debía adaptarse a la música y no al revés. Por eso cada canción tendrá un preset de dirección artística donde la tipografía, la composición, el movimiento y el ritmo podrán cambiar completamente. La consistencia no vendrá de repetir animaciones — vendrá de compartir una misma filosofía de diseño. Si la música cambia de personalidad en cada canción, la interfaz también debería tener permiso para hacerlo.',
          en: 'A decision appeared early that ended up defining the entire project: I didn\'t want a single visual style for all songs. A ballad doesn\'t communicate the same as rap. An instrumental piece doesn\'t carry the same rhythm as an electronic song. The interface had to adapt to the music, not the other way around. So each song will have an artistic direction preset where typography, composition, movement, and rhythm can change completely. Consistency won\'t come from repeating animations — it will come from sharing the same design philosophy.',
        },
      },

      // 5 — 2026-07-05 00:20 — Proceso / Decisión
      {
        _key: 'entry-5',
        date: '2026-07-05',
        time: '00:20',
        dimension: dim('route'),
        tag: decision,
        description: {
          es: 'La máquina principal de desarrollo es Windows. iOS y Apple TV requieren macOS y Xcode — un requisito duro de Apple sin workaround real. Se confirmó que hay una Mac disponible para cuando toque compilar y probar ese frente, así que el alcance de cuatro plataformas (iOS, Android, Apple TV, Android TV) se mantiene. No es un bloqueo, sino una restricción que hay que tener en cuenta desde el principio. El desarrollo día a día avanza en Windows; las pruebas de plataformas Apple van a la Mac cuando haga falta.',
          en: 'The main development machine is Windows. iOS and Apple TV require macOS and Xcode — a hard Apple requirement with no real workaround. It was confirmed that a Mac is available for when those platforms need to be compiled and tested, so the four-platform scope (iOS, Android, Apple TV, Android TV) holds. Not a blocker, just a constraint to keep in mind from the start.',
        },
      },

      // 6 — 2026-07-05 00:42 — Implementación / Fallo
      {
        _key: 'entry-6',
        date: '2026-07-05',
        time: '00:42',
        dimension: dim('code-2'),
        tag: fallo,
        description: {
          es: 'El scaffold del proyecto quedó en commit f912b84 usando @react-native-tvos/template-tv (React Native 0.86, React 19.2, TypeScript 5.8). Inmediatamente después se intentó el primer build en Android. El CLI de React Native falló al invocar gradlew.bat — un bug conocido de Windows con subprocesos .bat. Se resolvió invocando Gradle directamente, pero entonces apareció un segundo problema: conflicto entre Gradle 9.0.0 (recién liberado, viene incluido en el template) y el plugin de resolución de toolchains JDK (IBM_SEMERU). Se decidió no perseguir ese problema de inmediato y explorar una ruta alternativa para validar el motor visual sin depender del emulador nativo.',
          en: 'The project scaffold landed in commit f912b84 using @react-native-tvos/template-tv (React Native 0.86, React 19.2, TypeScript 5.8). Immediately after, the first Android build was attempted. The React Native CLI failed invoking gradlew.bat — a known Windows bug with .bat subprocesses. Solved by invoking Gradle directly, but a second problem appeared: conflict between Gradle 9.0.0 (newly released, bundled with the template) and the JDK toolchain resolution plugin (IBM_SEMERU). Decided not to pursue this immediately and look for an alternative route to validate the visual engine without depending on the native emulator.',
        },
      },

      // 7 — 2026-07-05 01:18 — Infraestructura / Pivote
      {
        _key: 'entry-7',
        date: '2026-07-05',
        time: '01:18',
        dimension: dim('cloud'),
        tag: pivote,
        description: {
          es: 'El desarrollo comenzó en React Native puro. Muy pronto apareció una fricción real: cada prueba dependía de levantar un emulador, esperar compilaciones y repetir un ciclo demasiado lento para un proyecto que probablemente exigirá cientos de pequeños ajustes visuales. La investigación confirmó que react-native-skia tiene soporte web maduro vía CanvasKit (WASM) — el mismo motor Skia, no una aproximación. Se creó un monorepo con tres paquetes: packages/engine (lógica compartida), apps/mobile (el proyecto RN+tvOS) y apps/web-preview (Vite + React + Skia web). La intención nunca fue construir una versión web del producto. El objetivo era disponer de un laboratorio donde cualquier cambio pudiera verse casi al instante. Cuando el ciclo entre una idea y su validación dura demasiado, también disminuye la curiosidad por seguir experimentando.',
          en: 'Development started in pure React Native. A real friction appeared quickly: each test depended on spinning up an emulator, waiting for builds, and repeating a cycle too slow for a project that will probably require hundreds of small visual adjustments. Research confirmed that react-native-skia has mature web support via CanvasKit (WASM) — the same Skia engine, not an approximation. A monorepo was created with three packages: packages/engine (shared logic), apps/mobile (the RN+tvOS project), and apps/web-preview (Vite + React + Skia web). The goal was never to build a web version of the product — it was to have a lab where any change could be seen almost instantly.',
        },
      },

      // 8 — 2026-07-05 01:53 — Implementación / Decisión
      {
        _key: 'entry-8',
        date: '2026-07-05',
        time: '01:53',
        dimension: dim('code-2'),
        tag: decision,
        description: {
          es: 'Después de varias decisiones de arquitectura apareció una pregunta mucho más importante: ¿realmente funciona esta idea? En lugar de integrar audio, streaming y sincronización real se construyó primero una prueba mínima — un reloj. Si el motor podía animar correctamente una frase utilizando únicamente el paso del tiempo, después podría hacerlo siguiendo una canción real. packages/engine recibió sus primeras piezas reales: types.ts (LyricWord) y sync.ts (computeWordEmphasis, función pura que calcula una curva de énfasis 0→1 por palabra con rampas de entrada y salida). La primera implementación del proyecto no reproduce música. Solo intenta demostrar que las palabras pueden moverse con intención. El verdadero producto no es el reproductor — es el motor visual. Todo lo demás puede construirse después.',
          en: 'After several architecture decisions, a much more important question appeared: does this idea actually work? Instead of integrating audio, streaming, and real sync, a minimal proof was built first — a clock. If the engine could correctly animate a phrase using only the passage of time, it could later do so following a real song. packages/engine received its first real pieces: types.ts (LyricWord) and sync.ts (computeWordEmphasis, a pure function calculating a 0→1 emphasis curve per word with entry/exit ramps). The first implementation doesn\'t play music. It only tries to prove that words can move with intention. The real product is not the player — it\'s the visual engine.',
        },
      },

      // 9 — 2026-07-05 02:00 — Aprendizaje / Lección
      {
        _key: 'entry-9',
        date: '2026-07-05',
        time: '02:00',
        dimension: dim('book-open'),
        tag: leccion,
        description: {
          es: 'Durante varias horas se asumió que el motor estaba funcionando. Los procesos terminaban correctamente, las respuestas HTTP eran exitosas, nada parecía indicar un problema. Hasta que se abrió el navegador: no había absolutamente nada. Ese momento obligó a revisar cada supuesto desde el principio. La cadena de causas fue larga — dependencias CJS de react-native-web sin pre-bundling explícito, shims faltantes para TurboModuleRegistry, la versión de canvaskit-wasm (^0.40.0) desalineada con la que react-native-skia empaqueta internamente (0.41.0 exacto), y extensiones .web.js que esbuild ignoraba mientras Metro las resuelve correctamente. Más importante que corregirlas fue entender otra cosa: se había dado por válida una hipótesis sin comprobar el resultado final. Las herramientas pueden decir que todo salió bien. El usuario siempre tiene la última palabra. En un proyecto visual, esa última palabra empieza cuando realmente aparece algo en la pantalla.',
          en: 'For several hours it was assumed the engine was working. Processes completed correctly, HTTP responses were successful, nothing seemed to indicate a problem. Until the browser was opened: absolutely nothing. That moment forced a review of every assumption from scratch. The chain of causes was long — CJS dependencies of react-native-web without explicit pre-bundling, missing shims for TurboModuleRegistry, canvaskit-wasm version mismatch (^0.40.0 vs the 0.41.0 that react-native-skia bundles internally), and .web.js extensions that esbuild ignored while Metro resolves them correctly. More important than fixing them was understanding something else: a hypothesis had been validated without checking the final result. Tools can say everything went fine. The user always has the last word. In a visual project, that last word starts when something actually appears on screen.',
        },
      },

      // 10 — 2026-07-05 02:23 — Hito / Hito
      {
        _key: 'entry-10',
        date: '2026-07-05',
        time: '02:23',
        dimension: dim('zap'),
        tag: hito,
        description: {
          es: 'Después de varios intentos el motor consiguió renderizar su primera frase utilizando el Sync Engine y Skia — commit 6ef51a8. No había audio, no existía un reproductor, tampoco un sistema completo de animaciones. Solo una frase, un reloj y un conjunto de cálculos que controlaban el énfasis de cada palabra. Era una prueba muy pequeña. Pero por primera vez el proyecto dejó de ser una arquitectura dibujada sobre papel y empezó a comportarse como aquello que imaginé cuando vi aquellas primeras animaciones tipográficas. Los grandes hitos rara vez llegan con una interfaz terminada. A veces llegan cuando una sola palabra aparece exactamente donde esperabas verla.',
          en: 'After several attempts, the engine managed to render its first phrase using the Sync Engine and Skia — commit 6ef51a8. There was no audio, no player, no complete animation system. Just a phrase, a clock, and a set of calculations controlling the emphasis of each word. It was a very small proof. But for the first time the project stopped being an architecture drawn on paper and started behaving like what I imagined when I saw those first typographic animations. Great milestones rarely arrive with a finished interface. Sometimes they arrive when a single word appears exactly where you expected it.',
        },
      },

    ],
    repoUrl: null,
    demoUrl: null,
  }

  const existing = await client.fetch(
    `*[_type == "playgroundItem" && _id == "living-music-experiment"][0]._id`
  )
  if (existing) {
    await client.createOrReplace(doc)
    console.log('  ✓ LivingMusic actualizado')
  } else {
    await client.create(doc)
    console.log('  ✓ LivingMusic creado')
  }
}

await seedLivingMusic()
console.log('\n✅ Listo. Visita /es/playground/living-music')
