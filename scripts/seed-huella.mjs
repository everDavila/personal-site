/**
 * Seed script — Huella (repo huella)
 * Planificador de viaje a China (marzo 2027) — 11 entradas de bitácora, 16–18 nov 2026.
 * Fuente: texto aprobado por Ever + BITACORA.md y git log del repo huella.
 *
 * Uso:
 *   node scripts/seed-huella.mjs
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

const DOC = 'huella-experiment'

// ── Helpers ───────────────────────────────────────────────────────────────────
let _k = 0
const k = () => `k${++_k}`

const p = (text) => ({
  _type: 'block', _key: k(), style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

const dim = (icon) => ({ _type: 'reference', _ref: `dim-${icon}` })

async function getTagRef(slug) {
  const id = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug })
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

// ── Idea y porqué ─────────────────────────────────────────────────────────────
const ideaEs = [
  p('Quiero viajar a China en 2027. El viaje todavía está en planificación, empiezo solo en Beijing y hay suficientes ciudades, atracciones y decisiones pendientes como para que una hoja de cálculo comience a parecer una amenaza.'),
  p('Huella nació para ordenar todo eso.'),
  p('Es una aplicación web progresiva para planificar y documentar el viaje: ver la ruta en un mapa, organizar las paradas, calcular noches y costos, y registrar por GPS los lugares por donde pasé.'),
  p('El presupuesto se calcula por persona. La excepción es el hospedaje, que se divide entre quienes comparten habitación. Porque viajar acompañado no debería significar que el presupuesto deje de tener sentido.'),
  p('La idea es planear con la comodidad de una pantalla grande y consultar el viaje desde el celular. También quiero que siga siendo útil cuando no haya conexión: un itinerario que desaparece justo cuando lo necesitas no es un itinerario, es decoración.'),
  p('El proyecto empezó llamándose GoChina. Después pasó a llamarse Huella: un nombre que no lo limita a un país y que también habla del rastro que deja el viaje.'),
]
const ideaEn = [
  p('I want to travel to China in 2027. The trip is still being planned, I start alone in Beijing, and there are enough cities, attractions and pending decisions for a spreadsheet to start looking like a threat.'),
  p('Huella was born to put all of that in order.'),
  p('It is a progressive web app to plan and document the trip: see the route on a map, organize the stops, calculate nights and costs, and record by GPS the places I went through.'),
  p('The budget is calculated per person. The exception is lodging, which is split among those who share a room. Because traveling with someone shouldn’t mean the budget stops making sense.'),
  p('The idea is to plan with the comfort of a big screen and check the trip from my phone. I also want it to stay useful when there is no connection: an itinerary that disappears right when you need it isn’t an itinerary, it’s decoration.'),
  p('The project started out called GoChina. It later became Huella (“footprint”): a name that doesn’t limit it to one country and that also speaks of the trail a trip leaves behind.'),
]

const whyEs = [
  p('Quiero hacer este viaje desde que empecé a estudiar chino.'),
  p('Hasta ahora he conocido parte del país a través del idioma y de las personas con las que me he encontrado mientras aprendo. Quiero llevar eso más lejos: conocerlas en persona y ver con mis propios ojos lugares que hasta ahora conozco a distancia.'),
  p('Me interesa ver la China que hoy es una potencia tecnológica y dejarme inspirar por lo que encuentre. Pero también quiero recorrer sus villas y lugares ancestrales. Ver esos dos extremos en un mismo viaje y fotografiarlos.'),
  p('Y para hacer un viaje así, primero hay que tomar muchas decisiones.'),
  p('Cada una mueve otra: agregar una ciudad cambia los traslados, mover una parada altera las fechas y quedarse una noche más afecta el presupuesto. Si además quiero comparar opciones sin borrar lo anterior, la cosa se pone interesante. Y por «interesante» quiero decir que termino negociando con siete pestañas y una celda que ya nadie se atreve a tocar.'),
  p('Necesitaba ver el viaje completo y poder jugar con él: cambiar la ruta, revisar cuánto cuesta y probar escenarios sin empezar de cero.'),
  p('Huella también es una forma de documentar cómo tomo decisiones mientras construyo. No solo lo que funciona, sino lo que todavía falta comprobar, lo que tuve que cambiar y los números que aún no merecen llamarse datos definitivos.'),
]
const whyEn = [
  p('I’ve wanted to make this trip since I started studying Chinese.'),
  p('So far I’ve known part of the country through the language and through the people I’ve met while learning. I want to take that further: meet them in person and see with my own eyes places I only know from a distance.'),
  p('I’m interested in seeing the China that is today a technological power and letting what I find inspire me. But I also want to walk its villages and ancestral places. See those two extremes on the same trip and photograph them.'),
  p('And to make a trip like that, you first have to make a lot of decisions.'),
  p('Each one moves another: adding a city changes the transfers, moving a stop shifts the dates, and staying one more night affects the budget. If I also want to compare options without erasing the previous ones, things get interesting. And by “interesting” I mean I end up negotiating with seven tabs and a cell nobody dares touch anymore.'),
  p('I needed to see the whole trip and be able to play with it: change the route, check how much it costs and try scenarios without starting over.'),
  p('Huella is also a way of documenting how I make decisions while I build. Not only what works, but what still needs checking, what I had to change, and the numbers that don’t yet deserve to be called final data.'),
]

// ── Documento ─────────────────────────────────────────────────────────────────
async function seedHuella() {
  console.log('Creando experimento Huella…')

  const decision = await getTagRef('decision')
  const duda     = await getTagRef('duda')
  const pivote   = await getTagRef('pivote')
  const hito     = await getTagRef('hito')
  const avance   = await getTagRef('avance')
  const insight  = await getTagRef('insight')
  const leccion  = await getTagRef('leccion')

  const doc = {
    _type: 'playgroundItem',
    _id:   DOC,
    title: { es: 'Huella', en: 'Huella' },
    slug: { _type: 'slug', current: 'huella' },
    localizedSlug: {
      es: { _type: 'slug', current: 'huella' },
      en: { _type: 'slug', current: 'huella' },
    },
    category: 'tools',
    status:   'en_proceso',
    year:     2026,
    hidden:   false,
    description: {
      es: 'Una herramienta para planear un viaje largo, ajustar la ruta sin romper el presupuesto y guardar el recorrido durante el camino.',
      en: 'A tool to plan a long trip, adjust the route without breaking the budget and keep the journey as I go.',
    },
    idea: { es: ideaEs, en: ideaEn },
    why:  { es: whyEs,  en: whyEn  },
    logEntries: [

      {
        _key: 'entry-1',
        date: '2026-11-16', time: '10:00',
        dimension: dim('target'), tag: decision,
        title: {
          es: 'Un presupuesto puede empezar con dudas, pero tiene que decirlo',
          en: 'A budget can start with doubts, but it has to say so',
        },
        description: {
          es: 'La primera versión reúne 78 atracciones de pago en 31 ciudades. De ellas, 38 están marcadas como imprescindibles y suman aproximadamente ¥2,518 por persona.\n\nLos precios provienen de una búsqueda inicial realizada con un agente de IA. Sirven como punto de partida, pero todavía necesitan verificarse, así que aparecen como «est.». Cuando edito uno, pasa a identificarse como «tuyo».\n\nLa aplicación puede ayudarme a calcular con lo que tengo hoy, pero eso no convierte una estimación en un precio confirmado. Ojalá los presupuestos funcionaran así.',
          en: 'The first version gathers 78 paid attractions in 31 cities. Of those, 38 are marked as must-sees and add up to roughly ¥2,518 per person.\n\nThe prices come from an initial search done with an AI agent. They work as a starting point but still need checking, so they show up as “est.”. When I edit one, it is labelled “yours”.\n\nThe app can help me calculate with what I have today, but that doesn’t turn an estimate into a confirmed price. I wish budgets worked like that.',
        },
      },

      {
        _key: 'entry-2',
        date: '2026-11-16', time: '15:00',
        dimension: dim('target'), tag: duda,
        title: {
          es: 'Un vuelo de ida y vuelta, una ruta que todavía no cierra',
          en: 'A round-trip flight, a route that still doesn’t close',
        },
        description: {
          es: 'Agregué al presupuesto aproximadamente S/ 8,000 para el vuelo Lima–Beijing, convertido a yuanes. El monto contempla ida y vuelta y parte de la idea de comprarlo con suficiente anticipación. Sigue siendo una estimación, no una tarifa confirmada.\n\nTambién apareció otra inconsistencia: la ruta empieza y termina en Hong Kong, aunque la intención es que empiece y termine en Beijing.\n\nEso queda pendiente. Prefiero que la bitácora lo señale ahora a descubrirlo cuando el itinerario ya parezca cerrado.',
          en: 'I added roughly S/ 8,000 to the budget for the Lima–Beijing flight, converted to yuan. The amount covers a round trip and assumes buying it well in advance. It is still an estimate, not a confirmed fare.\n\nAnother inconsistency also showed up: the route starts and ends in Hong Kong, although the intention is for it to start and end in Beijing.\n\nThat stays pending. I’d rather the log point it out now than find out when the itinerary already looks finished.',
        },
      },

      {
        _key: 'entry-3',
        date: '2026-11-17', time: '09:30',
        dimension: dim('target'), tag: decision,
        title: {
          es: 'GoChina se quedó corto',
          en: 'GoChina fell short',
        },
        description: {
          es: 'El primer nombre describía bien el destino, pero encerraba la herramienta ahí. Si más adelante quería usarla para otro viaje, GoChina tendría que dar explicaciones.\n\nLa renombré Huella. Funciona para distintos destinos y conecta con otra parte del proyecto: guardar el recorrido y documentar lo que pasó durante el viaje.\n\nConsideré otros nombres, como Lutu y Xingcheng, pero Huella decía lo que necesitaba sin amarrarse a una ruta.',
          en: 'The first name described the destination well, but it locked the tool in there. If I later wanted to use it for another trip, GoChina would have some explaining to do.\n\nI renamed it Huella. It works for different destinations and connects with another part of the project: keeping the route and documenting what happened during the trip.\n\nI considered other names, like Lutu and Xingcheng, but Huella said what I needed without tying itself to one route.',
        },
      },

      {
        _key: 'entry-4',
        date: '2026-11-17', time: '12:00',
        dimension: dim('cloud'), tag: pivote,
        title: {
          es: 'Cambiar de proveedor sin vaciar la billetera',
          en: 'Switching providers without emptying the wallet',
        },
        description: {
          es: 'Había elegido Supabase para guardar el plan en la nube. El problema era que los dos proyectos activos del plan gratuito ya estaban ocupados por Rènshi.\n\nPodía pagar o mover algo que ya funcionaba, pero ninguna de las dos opciones tenía mucho sentido. Estos proyectos también son mi espacio para jugar, experimentar y probar tecnologías; no necesito convertir cada curiosidad en una nueva suscripción.\n\nAsí que cambié a Firebase, que ya conocía por Nimbus. Huella seguía necesitando una forma de guardar el plan, pero no a costa de afectar otro proyecto ni de gastar más de lo necesario.\n\nExperimentar está bien. Pagarle alquiler a cada experimento, no tanto.',
          en: 'I had picked Supabase to store the plan in the cloud. The problem was that the two active projects of the free plan were already taken by Rènshi.\n\nI could pay or move something that already worked, but neither option made much sense. These projects are also my space to play, experiment and try technologies; I don’t need to turn every curiosity into a new subscription.\n\nSo I switched to Firebase, which I already knew from Nimbus. Huella still needed a way to store the plan, but not at the cost of affecting another project or spending more than necessary.\n\nExperimenting is fine. Paying rent for every experiment, not so much.',
        },
      },

      {
        _key: 'entry-5',
        date: '2026-11-17', time: '16:00',
        dimension: dim('target'), tag: decision,
        title: {
          es: 'Compartir la ruta no debería significar entregar las llaves',
          en: 'Sharing the route shouldn’t mean handing over the keys',
        },
        description: {
          es: 'El plan contiene mis fechas, mis costos y decisiones que voy a seguir ajustando. Quiero poder compartirlo sin que cualquiera pueda modificarlo.\n\nLa intención es que otras personas puedan consultarlo y que solo yo, o quienes invite, podamos editarlo. El control no depende únicamente de desactivar botones: la capa de datos también debe rechazar cambios no autorizados.\n\nPorque un botón gris no es seguridad. Es una sugerencia con buen comportamiento.\n\nPendiente: aclarar el acceso de lectura sin sesión y probar los permisos con una persona invitada.',
          en: 'The plan holds my dates, my costs and decisions I’ll keep adjusting. I want to be able to share it without just anyone being able to change it.\n\nThe intention is that other people can look at it and only I, or whoever I invite, can edit it. The control doesn’t rely only on disabling buttons: the data layer must also reject unauthorized changes.\n\nBecause a greyed-out button isn’t security. It’s a well-behaved suggestion.\n\nPending: clarify read access without signing in and test the permissions with an invited person.',
        },
      },

      {
        _key: 'entry-6',
        date: '2026-11-17', time: '20:00',
        dimension: dim('cloud'), tag: hito,
        title: {
          es: 'Huella llegó a producción. Los permisos siguen bajo revisión',
          en: 'Huella reached production. Permissions are still under review',
        },
        description: {
          es: 'La aplicación ya está publicada en huella.davila.uno y conectada a Firebase.\n\nEn la prueba registrada, un intento de leer el plan sin sesión recibió una respuesta 403. Eso confirma un bloqueo en ese caso, pero también deja una pregunta abierta: ¿cómo accederá al itinerario alguien que solo quiera consultarlo?\n\nAntes de dar por resuelto el modo lectura, tengo que comprobar el flujo completo y probar las reglas con una persona invitada.',
          en: 'The app is now live at huella.davila.uno and connected to Firebase.\n\nIn the recorded test, an attempt to read the plan without signing in got a 403 response. That confirms a block in that case, but it also leaves an open question: how will someone who only wants to look at the itinerary get to it?\n\nBefore calling read mode settled, I have to check the full flow and test the rules with an invited person.',
        },
      },

      {
        _key: 'entry-7',
        date: '2026-11-17', time: '22:00',
        dimension: dim('layers'), tag: avance,
        title: {
          es: 'Una ruta para compartir, no un archivo para descifrar',
          en: 'A route to share, not a file to decipher',
        },
        description: {
          es: 'Exportar un JSON puede servir para quien administra el plan. Para alguien que solo quiere saber por dónde vamos, no tanto.\n\nAgregué «Copiar ruta»: una versión del itinerario en texto, con paradas, fechas, transporte y total por persona.\n\nLa idea es simple: que pueda mandársela a alguien sin tener que explicarle qué hacer con un archivo lleno de llaves y comillas.',
          en: 'Exporting a JSON can work for whoever manages the plan. For someone who just wants to know where we’re going, not so much.\n\nI added “Copy route”: a text version of the itinerary, with stops, dates, transport and total per person.\n\nThe idea is simple: that I can send it to someone without having to explain what to do with a file full of braces and quotes.',
        },
      },

      {
        _key: 'entry-8',
        date: '2026-11-18', time: '10:00',
        dimension: dim('target'), tag: insight,
        title: {
          es: 'Una noche en cada parada no era un itinerario',
          en: 'One night at every stop wasn’t an itinerary',
        },
        description: {
          es: 'Al revisar la ruta, las 37 paradas tenían asignada una sola noche. Era el mínimo posible, sí. También era una forma bastante eficiente de convertir un viaje en una competencia de empacar maletas.\n\nAgregué dos referencias por ciudad: un mínimo para conocer lo esencial y una duración recomendada para viajar con menos apuro. En el cálculo registrado, esas referencias sumaban 35 y 63 noches, respectivamente.\n\nSon criterios míos basados en guías típicas, todavía sin fuentes verificadas. No pretenden decidir por mí: sirven para que la duración del viaje deje de ser una cifra puesta por defecto.',
          en: 'Reviewing the route, all 37 stops had a single night assigned. It was the minimum possible, yes. It was also a rather efficient way to turn a trip into a suitcase-packing competition.\n\nI added two references per city: a minimum to see the essentials and a recommended length to travel with less rush. In the recorded calculation, those references added up to 35 and 63 nights, respectively.\n\nThey are my own criteria based on typical guides, still without verified sources. They’re not meant to decide for me: they’re there so the length of the trip stops being a default number.',
        },
      },

      {
        _key: 'entry-9',
        date: '2026-11-18', time: '13:00',
        dimension: dim('target'), tag: avance,
        title: {
          es: '¿Y si no voy? Ahora puedo probarlo',
          en: 'What if I skip it? Now I can try',
        },
        description: {
          es: 'Quería comparar rutas sin tener que borrar ciudades cada vez que cambiaba de opinión.\n\nCada parada tiene una casilla para desactivarla. La ciudad permanece en la lista, pero deja de contar en el presupuesto, las noches y el mapa. Si la reactivo, vuelve a sumar como antes.\n\nParece una interacción pequeña, pero cambia la forma de planear: ya no tengo que comprometerme con una decisión para explorarla.',
          en: 'I wanted to compare routes without deleting cities every time I changed my mind.\n\nEach stop has a checkbox to deactivate it. The city stays in the list but stops counting in the budget, the nights and the map. If I reactivate it, it adds up again as before.\n\nIt looks like a small interaction, but it changes the way I plan: I no longer have to commit to a decision in order to explore it.',
        },
      },

      {
        _key: 'entry-10',
        date: '2026-11-18', time: '16:00',
        dimension: dim('compass'), tag: decision,
        title: {
          es: 'Un enlace útil vale más que un enlace «oficial» inventado',
          en: 'A useful link beats an invented “official” one',
        },
        description: {
          es: 'Quería que cada atracción tuviera un enlace para consultar información y ver fotos. Intenté resolverlo con sitios oficiales, pero no pude verificar enlaces para incluirlos.\n\nOpté por Wikipedia: busqué las atracciones por su nombre en caracteres chinos y elegí el artículo en español cuando existía; si no, en inglés o en chino.\n\nSegún la revisión registrada, 76 de las 78 atracciones tienen enlace y los 76 respondieron. Quedan dos sin enlace y ninguno de los sitios oficiales quedó verificado.\n\nNo es la fuente definitiva para precios ni horarios, pero sí un punto de partida. Es mejor dejar un espacio vacío que mandar a alguien a una página equivocada con mucha confianza.',
          en: 'I wanted every attraction to have a link to look up information and see photos. I tried to solve it with official sites, but I couldn’t verify links to include.\n\nI went with Wikipedia: I searched the attractions by their name in Chinese characters and picked the Spanish article when there was one; if not, the English or Chinese one.\n\nAccording to the recorded check, 76 of the 78 attractions have a link and all 76 responded. Two have no link, and none of the official sites ended up verified.\n\nIt’s not the definitive source for prices or opening hours, but it’s a starting point. Better to leave a blank than to send someone to the wrong page with great confidence.',
        },
      },

      {
        _key: 'entry-11',
        date: '2026-11-18', time: '20:00',
        dimension: dim('route'), tag: leccion,
        title: {
          es: 'Cambiar de computadora sin volver a empezar',
          en: 'Changing computers without starting over',
        },
        description: {
          es: 'Cloné el repositorio en otra computadora y pude poner el proyecto a correr en pocos minutos.\n\nLa diferencia no fue magia ni una configuración excepcional: había dejado escritos el estado del proyecto, las decisiones y los pasos necesarios, sin incluir secretos.\n\nDocumentar mientras construyo no solo sirve para contar el proceso después. También sirve para no depender de recordar cómo resolví algo tres días atrás.',
          en: 'I cloned the repository on another computer and got the project running in a few minutes.\n\nThe difference wasn’t magic or an exceptional setup: I had written down the project’s state, the decisions and the steps needed, without including secrets.\n\nDocumenting while I build isn’t only for telling the process afterwards. It also keeps me from depending on remembering how I solved something three days ago.',
        },
      },

    ],
    repoUrl: null,
    demoUrl: 'https://huella.davila.uno',
  }

  await client.createOrReplace(doc)
  console.log('  ✓ Huella creado')
}

await seedHuella()
console.log('\n✅ Listo. Visita /es/playground/huella')
