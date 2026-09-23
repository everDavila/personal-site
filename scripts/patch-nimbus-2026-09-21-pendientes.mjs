/**
 * Patch script — 8 entradas del 21/09 pendientes de publicar (revisión "revisemos la bitácora")
 *
 * Uso:
 *   node scripts/patch-nimbus-2026-09-21-pendientes.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync, createReadStream } from 'fs'
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

const IMG_DIR = 'C:/Users/ever/Documents/bitacora-borrador/nimbus-2026-09-21'
const dim = (icon) => ({ _type: 'reference', _ref: `dim-${icon}` })

async function getTagRef(slug) {
  const id = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug })
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

async function uploadImage(filename, captionEs, captionEn) {
  const asset = await client.assets.upload('image', createReadStream(`${IMG_DIR}/${filename}`), { filename })
  return {
    _type: 'image',
    _key: filename.replace(/\.\w+$/, ''),
    asset: { _type: 'reference', _ref: asset._id },
    caption: { es: captionEs, en: captionEn },
  }
}

async function run() {
  const [avance, duda, insight, decision, pausa, hipotesis, leccion] = await Promise.all([
    getTagRef('avance'), getTagRef('duda'), getTagRef('insight'), getTagRef('decision'),
    getTagRef('pausa'), getTagRef('hipotesis'), getTagRef('leccion'),
  ])
  const CIERRE_DEL_DIA = { _type: 'reference', _ref: '5ca5c31a-f9b2-4e71-95c9-ffc839552aa7' }

  console.log('Subiendo imágenes…')
  const imgNedStark = await uploadImage(
    'winter-is-coming-1-ned-stark.png',
    'Nimbus como Ned Stark, con la frase "Empieza a refrescar. Winter is coming."',
    'Nimbus as Ned Stark, with the phrase "It\'s getting colder. Winter is coming."'
  )
  const imgCaminante = await uploadImage(
    'winter-is-coming-2-caminante-blanco.png',
    'Nimbus como Caminante Blanco, con la misma frase de frío',
    'Nimbus as a White Walker, with the same cold-weather phrase'
  )
  const imgAdmin = await uploadImage(
    'administrador-de-poses.png',
    'El administrador de poses: 59 ilustraciones, fechas especiales e intensidad',
    'The pose admin: 59 illustrations, special dates and intensity'
  )

  const entries = [
    {
      _key: 'entry-39',
      date: '2026-09-21',
      time: '10:03',
      dimension: dim('pen-line'),
      tag: avance,
      images: [imgNedStark, imgCaminante],
      description: {
        es: 'Las referencias de Nimbus empiezan a tener cara. Antes, con "Winter is coming" salía la imagen genérica del frío de siempre; ahora agarré ilustraciones de Juego de Tronos para que la imagen haga match con la frase.\n\nSumé una segunda referencia: Pokémon. Pikachu para los rayos, porque es lo obvio, y Charmander para el calor y el fuego. Son parodias con patas, no personajes con derechos de autor asustados.\n\nYa sé qué referencia manda en cada clima extremo: Winter is coming para el frío, y Dracarys para el calor. Esta última, por ahora, solo vive en mi cabeza.',
        en: 'Nimbus’s references are starting to get a face. Before, "Winter is coming" pulled up the same generic cold-weather image; now I grabbed Game of Thrones illustrations so the image matches the phrase.\n\nI added a second reference: Pokémon. Pikachu for lightning, because it’s the obvious pick, and Charmander for heat and fire. They’re parodies with legs, not copyrighted characters getting nervous.\n\nI already know which reference wins in each weather extreme: Winter is coming for cold, Dracarys for heat. The second one, for now, only lives in my head.',
      },
    },
    {
      _key: 'entry-40',
      date: '2026-09-21',
      time: '11:00',
      dimension: dim('layout-grid'),
      tag: duda,
      images: [imgAdmin],
      description: {
        es: 'Ya tengo un primer orden para las fechas especiales: primero manda el evento, después el momento, después el clima, y si nada de eso aplica, neutral. Con eso funcionan Halloween, San Valentín, el Año Nuevo Chino y las que vengan.\n\nAhora quiero ir más allá y definir esas fechas por calendario desde el propio administrador de poses. Tengo una duda que todavía no resuelvo: un mismo día no es el mismo día en todos lados. Voy a iterar primero, antes de prometer algo que la zona horaria me puede hacer quedar mal.',
        en: 'I already have a first order for special dates: the event comes first, then the moment, then the weather, and if none of that applies, neutral. That’s how Halloween, Valentine’s Day, Chinese New Year and whatever comes next already work.\n\nNow I want to go further and define those dates by calendar, right from the pose admin itself. I have a doubt I haven’t solved yet: the same day isn’t the same day everywhere. I’ll iterate on this first, before promising something a time zone could make me regret.',
      },
    },
    {
      _key: 'entry-41',
      date: '2026-09-21',
      time: '11:04',
      dimension: dim('target'),
      tag: insight,
      description: {
        es: 'Ya tengo la beta lista y probada por mi cuenta. Creo que puedo pasársela a algunos amigos cercanos, que buena falta me hace su feedback.\n\nPero noté algo: para que salga "Winter is coming" o cualquier otra referencia, el usuario tiene que haber elegido esa preferencia, y hoy está escondida en Ajustes. Yo la tengo puesta desde el principio, claro. Alguien nuevo no, y le puede salir algo demasiado de nicho como para entenderlo.\n\n(Pensé en armar un onboarding para la primera vez que alguien abra la app, pero lo descarté: no quiero que alguien que recién la prueba se vaya antes de llegar a usarla. Queda en la lista de pendientes, por ahora.)',
        en: 'The beta is ready and I’ve tested it myself. I think I can pass it to a few close friends — I badly need their feedback.\n\nBut I noticed something: for "Winter is coming" or any other reference to show up, the user has to have picked that preference, and today it’s hidden in Settings. I have mine set from the start, obviously. Someone new doesn’t, and they can end up seeing something too niche to make sense of.\n\n(I thought about building an onboarding for the first time someone opens the app, but I dropped it: I don’t want someone trying it out for the first time to leave before they even get to use it. It stays on the pending list, for now.)',
      },
    },
    {
      _key: 'entry-42',
      date: '2026-09-21',
      time: '12:42',
      dimension: dim('target'),
      tag: decision,
      description: {
        es: 'Ahora que tengo dos referencias, toca hacer curaduría de frases. Todavía no confío en un LLM para que las escriba por mí: prefiero elegir a mano las que ya tienen más interacción, y con esas alimentar algún día un motor propio que genere frases solo.\n\nEse motor no lo voy a construir pronto. Necesito o una máquina donde correrlo en local, o animarme a jugar con alguna IA china más barata. Por ahora, sigo siendo yo el que decide qué dice Nimbus.',
        en: 'Now that I have two references, it’s time to curate phrases. I still don’t trust an LLM to write them for me: I’d rather hand-pick the ones that already get the most interaction, and someday feed an engine of my own with those, one that generates phrases on its own.\n\nI’m not building that engine soon. I’d need either a machine to run it locally, or the nerve to play with some cheaper Chinese AI. For now, I’m still the one deciding what Nimbus says.',
      },
    },
    {
      _key: 'entry-43',
      date: '2026-09-21',
      time: '12:50',
      dimension: CIERRE_DEL_DIA,
      tag: pausa,
      description: {
        es: 'Por hoy, curaduría de frases. Las notificaciones push quedan para mañana o pasado. Son varios días seguidos trabajando en esto, y hoy ya toca parar. Las push sí las quiero hacer bien, cliente y back completos, y eso no se construye con la cabeza cansada.',
        en: 'For today, phrase curation. Push notifications are staying for tomorrow or the day after. It’s been several days in a row on this, and today it’s time to stop. I do want to build push properly, client and back end both, and that’s not something you build with a tired head.',
      },
    },
    {
      _key: 'entry-44',
      date: '2026-09-21',
      time: '17:12',
      dimension: dim('target'),
      tag: hipotesis,
      description: {
        es: 'Se me ocurrió que "Nimbus recomienda" es un poco sosa. A mí me gusta comer rico, así que pensé en asociarla con comida: si hace calor, un rico helado; si estás en Piura, un plato típico de Piura.\n\nPor ahora es solo una idea, ni siquiera decidida del todo. Armé una base con platos típicos de cada departamento del Perú para tener con qué empezar, si es que sigo adelante. La comida reemplazaría la bajada de "Nimbus recomienda"; el título se queda.',
        en: 'It occurred to me that "Nimbus recommends" is a bit bland. I like eating well, so I thought about pairing it with food: if it’s hot, a good ice cream; if you’re in Piura, a typical Piura dish.\n\nFor now it’s just an idea, not even fully decided. I put together a database of typical dishes by Peruvian department to have something to start from, if I go ahead with it. The food would replace the line under "Nimbus recommends"; the title stays.',
      },
    },
    {
      _key: 'entry-45',
      date: '2026-09-21',
      time: '17:37',
      dimension: dim('cloud'),
      tag: leccion,
      description: {
        es: 'Apagué el GPS del celular a propósito, para ver qué hacía Nimbus. La respuesta: siguió creyendo que estaba donde estaba antes. En segundo plano no avisa nada, solo se queda con la última ubicación que tenía.\n\nCuando pido la ubicación a mano sí me avisa que algo falló, pero con un error genérico, no con la pantalla de bienvenida que ya tengo pensada para cuando no sabe dónde estoy. Ahí hay algo que ajustar.',
        en: 'I turned off my phone’s GPS on purpose, just to see what Nimbus would do. The answer: it kept believing it was still where it used to be. In the background it doesn’t say a word, it just holds on to the last location it had.\n\nWhen I ask for the location by hand, it does tell me something failed, but with a generic error, not the welcome screen I already have in mind for when it doesn’t know where I am. There’s something to adjust there.',
      },
    },
    {
      _key: 'entry-46',
      date: '2026-09-21',
      time: '18:21',
      dimension: dim('lightbulb'),
      tag: hipotesis,
      description: {
        es: 'Creo que Nimbus está quedando muy corto. Estoy pensando en subirle el filo a la personalidad: hoy es sarcástico pero sano, y me pregunto si debería ser mucho más sarcástico, casi una relación tóxica con mi propia aplicación. No como Duolingo, que directamente acosa. Aunque, pensándolo bien, quizás algo parecido.\n\nTodavía no es una decisión, solo una idea rondando. Si la pruebo, va a ser con cuidado.',
        en: 'I think Nimbus is coming out too tame. I’m thinking about sharpening its personality: right now it’s sarcastic but healthy, and I wonder if it should be much more sarcastic, almost a toxic relationship with my own app. Not like Duolingo, which flat-out stalks you. Although, thinking about it, maybe something close to that.\n\nIt’s not a decision yet, just an idea circling. If I try it, I’ll try it carefully.',
      },
    },
  ]

  console.log('Appending 8 entradas a Nimbus…')
  await client.patch('nimbus-experiment').append('logEntries', entries).commit()
  console.log('\n✅ Listo.')
}

await run()
