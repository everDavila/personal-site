/**
 * Patch script — LivingMusic: entradas 11-13
 * 05/07/2026 02:40–03:13 — Tipografías, Manifiesto, Wonderwall
 *
 * Uso:
 *   node scripts/patch-living-music-entries-2.mjs
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
  console.log('Cargando tags…')
  const [decision, hito] = await Promise.all([
    getTagRef('decision'),
    getTagRef('hito'),
  ])

  const newEntries = [

    // 11 — 05/07/2026 02:40 — Sistema de diseño — Decisión
    {
      _key: 'entry-11',
      date: '2026-07-05',
      time: '02:40',
      dimension: dim('layout-grid'),
      tag: decision,
      description: {
        es: 'Antes de escribir una sola línea de código de animación necesito saber con qué cuerpo van a moverse las palabras. No sirve cualquier fuente — necesito un set de tipografías libres que tengan carácter propio, que puedan cargar con el peso emocional de una canción sin romperse. Entre cinco y diez. Que cubran el espectro sin solaparse: la que se siente fría y estructural, la que se siente humana y cálida, la que tiene rotura, la que es perfectamente geométrica, la que respira. Una paleta. Porque si cada canción va a tener su propia dirección artística, las tipografías son la primera decisión de esa dirección — antes del movimiento, antes del ritmo, antes de todo. No puedo llegar al momento de diseñar para una canción y empezar a buscar. El cajón tiene que estar lleno antes.',
        en: 'Before writing a single line of animation code I need to know what body the words will move in. Not just any typeface — I need a set of free typefaces with their own character, that can carry the emotional weight of a song without breaking. Between five and ten. Covering the spectrum without overlapping: the cold and structural one, the human and warm one, the one with fracture, the perfectly geometric one, the one that breathes. A palette. Because if each song will have its own artistic direction, typefaces are the first decision of that direction — before movement, before rhythm, before everything.',
      },
    },

    // 12 — 05/07/2026 02:50 — Idea — Decisión
    {
      _key: 'entry-12',
      date: '2026-07-05',
      time: '02:50',
      dimension: dim('lightbulb'),
      tag: decision,
      description: {
        es: 'Tenía pensado entrenar el motor mirando videos — estudiar cómo se mueven las palabras en referencias que me gustan, extraer patrones, replicarlos. Pero mientras lo pensaba me di cuenta de que era exactamente lo que no quería hacer. Si el motor aprende de referencias, siempre va a ser una copia sofisticada. La palabra tiene que sentirse, no parecerse a algo que ya vi. Cambié el plan. Primero el manifiesto. Antes de escribir código de animación, escribo las reglas de por qué una palabra se mueve de cierta manera — qué significa que una palabra "cargue peso", qué es el silencio tipográfico, por qué la velocidad de entrada y la de salida no tienen que ser iguales. Compartí las ideas con Claudio — así le llamo cuando estamos en modo creativo, no modo debug — y empezamos a iterar. Lo que está saliendo no es un manual técnico: es un catálogo reutilizable de primitivas de movimiento. El manifiesto es el índice. El código vendrá después, y cuando llegue ya sabrá para qué existe. Hay algo que me resulta muy familiar en todo esto. Estoy actuando como director de arte editorial de un medio que todavía no existe. Es exactamente el mismo proceso que cuando arrancaba en diseño publicitario — cuando el producto era papel, el movimiento era solo imaginado, y aun así tenías que tomar decisiones sobre él. Parece que vuelvo al mundo impreso, pero con un lienzo que respira.',
        en: 'I was planning to train the motor by watching videos — studying how words move in references I like, extracting patterns, replicating them. But as I thought about it I realized that was exactly what I didn\'t want to do. If the motor learns from references, it will always be a sophisticated copy. The word needs to feel, not resemble something I\'ve already seen. Changed the plan. Manifesto first. Before writing animation code, write the rules for why a word moves a certain way — what it means for a word to "carry weight," what typographic silence is, why the entry speed and exit speed don\'t have to be equal. Shared the ideas with Claudio — that\'s what I call him when we\'re in creative mode, not debug mode — and we started iterating. What\'s coming out isn\'t a technical manual: it\'s a reusable catalog of movement primitives. The manifesto is the index. Code comes after, and when it does it will already know why it exists.',
      },
    },

    // 13 — 05/07/2026 03:13 — Producto — Hito
    {
      _key: 'entry-13',
      date: '2026-07-05',
      time: '03:13',
      dimension: dim('target'),
      tag: hito,
      description: {
        es: 'Wonderwall. Oasis, 1995. Es la primera canción del catálogo LivingMusic. No la elegí por nostalgia — la elegí porque tiene exactamente el arco emocional que necesito para probar si el sistema funciona de verdad: incertidumbre → duda → tensión creciente → catarsis anthémica. Si el motor puede seguir ese arco, si las primitivas del manifiesto pueden acompañarlo sin forzarlo, puede acompañar cualquier arco. Si no puede, quiero saberlo ahora, con cinco letras de Oasis y no con un álbum completo de algo más complejo. Simulé cuatro frases aplicando el vocabulario completo — cómo entra cada palabra, qué peso carga, cuándo respira el layout, cómo escala la tensión antes del estribillo. Es la primera vez que el proyecto deja de ser un sistema abstracto y se convierte en algo que podría sentirse. Hasta ahora tenía un motor, un set de primitivas y un cajón de tipografías. Ahora tengo una canción real con un arco real. Y Wonderwall no pide ser leída — pide ser sentida desde la primera línea.',
        en: 'Wonderwall. Oasis, 1995. First song in the LivingMusic catalog. I didn\'t choose it for nostalgia — I chose it because it has exactly the emotional arc I need to test whether the system really works: uncertainty → doubt → growing tension → anthemic catharsis. If the engine can follow that arc, if the manifesto primitives can accompany it without forcing it, it can accompany any arc. Simulated four phrases applying the full vocabulary — how each word enters, what weight it carries, when the layout breathes, how tension scales before the chorus. First time the project stops being an abstract system and becomes something that could be felt.',
      },
    },

  ]

  console.log('Appending 3 entradas al experimento LivingMusic…')
  await client
    .patch('living-music-experiment')
    .append('logEntries', newEntries)
    .commit()

  console.log('\n✅ Entradas 11–13 agregadas correctamente.')
}

await run()
