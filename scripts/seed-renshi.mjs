/**
 * Seed script — Rènshi (repo chinese-lesson)
 * Vocabulario chino en contexto para clases online — 12 entradas de bitácora, 10 oct 2026.
 * Fuente: BITACORA.md, IDEA.md y git log del repo chinese-lesson.
 *
 * Uso:
 *   node scripts/seed-renshi.mjs
 *
 * Requiere SANITY_TOKEN en .env.local
 * Requiere que existan: logTags (seed-nimbus) + dimension docs (seed-dimensions)
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

const DOC = 'renshi-experiment'
const IMG_DIR = 'D:/reposGIT/chinese-lesson/tests/screens'

// ── Helpers ───────────────────────────────────────────────────────────────────
let _k = 0
const k = () => `k${++_k}`

const p = (text) => ({
  _type: 'block', _key: k(), style: 'normal', markDefs: [],
  children: [{ _type: 'span', _key: k(), text, marks: [] }],
})

const dim = (icon) => ({ _type: 'reference', _ref: `dim-${icon}` })
const CIERRE_DEL_DIA = { _type: 'reference', _ref: '5ca5c31a-f9b2-4e71-95c9-ffc839552aa7' }

async function getTagRef(slug) {
  const id = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug })
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

async function uploadImage(path, key, captionEs, captionEn) {
  const asset = await client.assets.upload('image', createReadStream(`${IMG_DIR}/${path}`), {
    filename: `renshi-${key}.png`,
  })
  return {
    _type: 'image',
    _key: key,
    asset: { _type: 'reference', _ref: asset._id },
    caption: { es: captionEs, en: captionEn },
  }
}

// ── Idea y porqué ─────────────────────────────────────────────────────────────
const ideaEs = [
  p('Rènshi no pretende reinventar la rueda de las flashcards: simplemente se toma la molestia de explicar.'),
  p('Aquí cada palabra vive dentro de frases reales, no aislada en un rectángulo flotante esperando un milagro cognitivo. Y cada sentido va por su cuenta. Meter todos los usos de un carácter en una sola tarjeta es el equivalente pedagógico a enseñar la palabra «banco» pegando la foto de una plaza y la de un cajero automático, esperando que el alumno adivine por telepatía cuál le toca hoy.'),
  p('El proyecto arrancó inocente: diez palabras para una demo. Tres días después ya tenía cerca de mil tarjetas para mostrar cómo se usan las palabras del HSK 1 al 3, más de dos mil frases y la estructura de cada carácter. Ahí el problema dejó de ser la capacidad para generar contenido y pasó a ser el terror de confiar en él. Ante la menor duda, la app prefiere callarse (una virtud que muchos humanos todavía no dominan).'),
  p('Buena parte del contenido nació con IA y pasó por el filtro de otros dos modelos, aunque tres inteligencias artificiales poniéndose de acuerdo garantizan lo mismo que tres borrachos decidiendo quién maneja. Por eso hay un panel donde una profesora o un hablante nativo tiene el botón rojo para corregir desastres. La última palabra sigue en manos de alguien de carne y hueso.'),
  p('La profesora no recibe una colección intocable. Puede copiar con un clic una plantilla del temario HSK o una por tema (comer fuera, viajes, trabajo…) y editarla a su gusto. O partir de su propio material: pega las palabras de la lección de su libro y Rènshi las busca entre las once mil del temario y las trae con todo lo que ya sabe de ellas. Luego oculta las frases que no le convencen y escribe las suyas. La base común no la toca; lo que arma es suyo.'),
  p('Está pensada para el campo de batalla de la clase, no para el repaso culposo a medianoche. La profesora comparte la pantalla y los alumnos responden desde el celular, sin registros. No es obligatorio, pero tiene un superpoder: es anónimo. En plena clase nadie quiere ser el valiente que admita que no entendió; aquí los alumnos confiesan su ignorancia sin pasar vergüenza. Ese feedback silencioso sirve sobre todo para después: como la misma colección de palabras se vuelve a trabajar dos o tres veces en las siguientes clases, la profesora sabe exactamente qué caracteres toca reforzar antes de dar la próxima vuelta.'),
]

const ideaEn = [
  p('Rènshi doesn’t try to reinvent the flashcard wheel: it just takes the trouble to explain.'),
  p('Here every word lives inside real sentences, not isolated in a floating rectangle waiting for a cognitive miracle. And each sense goes on its own. Cramming every use of a character into one card is the teaching equivalent of explaining the word “bank” with a photo of a river and one of an ATM, and expecting the student to guess by telepathy which one is today’s.'),
  p('The project started out innocent: ten words for a demo. Three days later it had close to a thousand cards showing how the words of HSK 1 to 3 are used, over two thousand sentences and the structure of every character. That’s when the problem stopped being the ability to generate content and became the terror of trusting it. At the slightest doubt, the app prefers to keep quiet (a virtue many humans have yet to master).'),
  p('Much of the content was born with AI and went through the filter of two other models, although three artificial intelligences agreeing guarantee about as much as three drunks deciding who drives. That’s why there’s a panel where a teacher or a native speaker holds the red button to fix disasters. The last word is still in the hands of someone made of flesh and bone.'),
  p('The teacher doesn’t get an untouchable collection. She can copy an HSK syllabus template or a themed one (eating out, travel, work…) with one click and edit it as she likes. Or start from her own material: she pastes the words from her textbook lesson and Rènshi finds them among the eleven thousand in the syllabus and brings them in with everything it already knows about them. Then she hides the sentences she doesn’t like and writes her own. She never touches the shared base; what she builds is hers.'),
  p('It’s built for the battlefield of the classroom, not for guilty midnight review. The teacher shares her screen and students answer from their phones, no sign-up. It isn’t mandatory, but it has a superpower: it’s anonymous. Mid-class, nobody wants to be the brave one who admits they didn’t get it; here students confess their ignorance without the embarrassment. That silent feedback matters most afterwards: since the same collection of words comes back two or three times in the following classes, the teacher knows exactly which characters to reinforce before the next round.'),
]

const whyEs = [
  p('Mi profesora enseña con Quizlet. Delante, el carácter; detrás, la traducción.'),
  p('房子: «casa». 家: «casa». Dos caracteres distintos, la misma traducción en el reverso: una pista demasiado pobre para distinguir lo que significa cada uno. Aprender, aprendía. Lo que no sabía era qué demonios estaba aprendiendo.'),
  p('房子 es el inmueble: se alquila, se compra o se pinta. 家 es el hogar al que vuelves o la familia que te espera. Y justo cuando crees que ya lo tienes, aparece 公司 (empresa) y descubres que puedes decir 一家公司, «una empresa». Ahí 家 ya no tiene tejado ni parientes: mutó en clasificador. Esos pequeños detalles que una tarjeta minimalista prefiere ignorar para que nadie se deprima en clase.'),
  p('Con 认识 (rènshi) pasó lo mismo: «conocer», ilustrado con la foto de stock de un apretón de manos para despejar dudas. Las sembró todas. 认识 sirve para conocer a una persona, pero también para reconocer un carácter en la pizarra, que es la humillación a la que me someto cada semana. De ahí el nombre.'),
  p('El problema nunca fue que la traducción fuera falsa, sino que una traducción exacta te hace creer que entendiste algo que jamás sabrás usar. Así que, en vez de discutirle a la profesora (deporte que ya practico más de la cuenta), me senté a diseñar las tarjetas que a mí me hubiera gustado tener.'),
]

const whyEn = [
  p('My teacher teaches with Quizlet. On the front, the character; on the back, the translation.'),
  p('房子: “house”. 家: “house”. Two different characters, the same translation on the back: a clue far too thin to tell what each one means. Learning, I was learning. What I didn’t know was what on earth I was learning.'),
  p('房子 is the property: you rent it, buy it or paint it. 家 is the home you go back to, or the family waiting for you. And just when you think you’ve got it, 公司 (company) shows up and you find out you can say 一家公司, “a company”. There, 家 has no roof and no relatives left: it has mutated into a classifier. The kind of little detail a minimalist card prefers to ignore so nobody gets depressed in class.'),
  p('With 认识 (rènshi) the same thing happened: “to know”, illustrated with a stock photo of a handshake to clear up any doubts. It planted all of them. 认识 is for getting to know a person, but also for recognizing a character on the board, which is the humiliation I put myself through every week. Hence the name.'),
  p('The problem was never that the translation was wrong, but that an exact translation makes you believe you understood something you’ll never know how to use. So, instead of arguing with my teacher (a sport I already practice more than I should), I sat down to design the cards I would have liked to have.'),
]

// ── Main ──────────────────────────────────────────────────────────────────────
async function seedRenshi() {
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: DOC })
  if (existing) throw new Error(`${DOC} ya existe: usar un patch, no este seed`)

  console.log('Cargando tags…')
  const [hipotesis, decision, pivote, insight, leccion, fallo, avance] = await Promise.all([
    getTagRef('hipotesis'),
    getTagRef('decision'),
    getTagRef('pivote'),
    getTagRef('insight'),
    getTagRef('leccion'),
    getTagRef('fallo'),
    getTagRef('avance'),
  ])

  console.log('Subiendo 4 capturas…')
  const [anversoClaro, anversoOscuro, reversoOscuro, reversoCelular] = await Promise.all([
    uploadImage('desktop-light/1-anverso.png', 'anverso-claro',
      'El anverso: solo el carácter, en tinta. El radical apenas cambia de tono.',
      'The front: just the character, in ink. The radical only shifts in tone.'),
    uploadImage('desktop-dark/1-anverso.png', 'anverso-oscuro',
      'El mismo anverso en el modo oscuro dorado.',
      'The same front in the golden dark mode.'),
    uploadImage('desktop-dark/1-reverso.png', 'reverso-oscuro',
      'El reverso de 家: cómo se forma, dos frases y la valoración del grupo.',
      'The back of 家: how it is built, two sentences and the group rating.'),
    uploadImage('phone-dark/1-reverso.png', 'reverso-celular',
      'El reverso en el celular, sin scroll horizontal.',
      'The back on a phone, no horizontal scroll.'),
  ])

  const doc = {
    _type: 'playgroundItem',
    _id:   DOC,
    title: { es: 'Rènshi · 认识', en: 'Rènshi · 认识' },
    slug:  { _type: 'slug', current: 'renshi' },
    localizedSlug: {
      es: { _type: 'slug', current: 'renshi' },
      en: { _type: 'slug', current: 'renshi' },
    },
    category: 'tools',
    status:   'en_proceso',
    year:     2026,
    hidden:   false,
    description: {
      es: 'Tarjetas de chino que se toman la molestia de explicar. Nació de dos caracteres distintos, 家 y 房子, que Quizlet traducía igual: «casa».',
      en: 'Chinese flashcards that take the trouble to explain. It started with two different characters, 家 and 房子, that Quizlet translated the same way: “house”.',
    },
    idea: { es: ideaEs, en: ideaEn },
    why:  { es: whyEs,  en: whyEn  },
    logEntries: [

      // 1 — 15:00 — Idea / Hipótesis
      {
        _key: 'entry-1',
        date: '2026-10-10',
        time: '15:00',
        dimension: dim('lightbulb'),
        tag: hipotesis,
        description: {
          es: 'Mi profesora de chino usa Quizlet. Al frente, 认识. Atrás, «conocer» y la foto de un apretón de manos.\n\nEl problema es que «conocer» en español engaña. 认识 sirve para conocer a una persona o reconocer un carácter, pero si conociste Pekín, eso es otra palabra. Y 房子 y 家 salen las dos como «casa», aunque una es el edificio y la otra es adonde vuelves.\n\nLa hipótesis es simple: una palabra se entiende mejor dentro de una frase que sola en una tarjeta. No es una idea nueva. Lo nuevo es que esta vez me tocó sufrirlo como alumno.',
          en: 'My Chinese teacher uses Quizlet. On the front, 认识. On the back, "to know" and a photo of a handshake.\n\nThe problem is that "to know" misleads. 认识 means knowing a person or recognizing a character, but if you have been to Beijing, that is a different word. And 房子 and 家 both come out as "house", though one is the building and the other is where you go back to.\n\nThe hypothesis is simple: a word makes more sense inside a sentence than alone on a card. Not a new idea. What is new is that this time I got to suffer it as a student.',
        },
      },

      // 2 — 16:12 — Infraestructura / Decisión
      {
        _key: 'entry-2',
        date: '2026-10-10',
        time: '16:12',
        dimension: dim('cloud'),
        tag: decision,
        description: {
          es: 'Con Nimbus ya sé hacer las cosas con Vue y Firebase. Justamente por eso no los usé.\n\nEsta vez va Next.js con Supabase, y la app vivirá en su propio subdominio. Hace falta login para las docentes y una base de datos de verdad, pero sobre todo quería aprender algo nuevo en vez de repetir lo que ya me sale.\n\nDe Nimbus sí me traje algo: la lista de errores que ya cometí. Es la parte que más me costó.',
          en: 'With Nimbus I already know how to do things with Vue and Firebase. That is exactly why I didn’t use them.\n\nThis time it is Next.js with Supabase, and the app will live on its own subdomain. Teachers need a login and a real database, but mostly I wanted to learn something new instead of repeating what already works for me.\n\nI did bring one thing from Nimbus: the list of mistakes I already made. It was the part that cost me the most.',
        },
      },

      // 3 — 17:03 — Producto / Pivote
      {
        _key: 'entry-4',
        date: '2026-10-10',
        time: '17:03',
        dimension: dim('target'),
        tag: pivote,
        description: {
          es: 'El plan empezó como una app para estudiar solo, con tarjetas y repasos. Para la tarde ya era otra cosa.\n\nLa demo no es para mí: es para mostrarle a mi profesora cómo podría enseñar. Así que el centro pasó a la clase: un modo presentación para compartir pantalla, una valoración rápida de cuánto entendió el grupo y, más adelante, una votación anónima al estilo Kahoot.\n\nEl autoestudio no desaparece. Solo deja de ser lo primero. Convencer a la profesora va antes que convencer al algoritmo de repaso.',
          en: 'The plan started as an app for studying alone, with cards and reviews. By the afternoon it was something else.\n\nThe demo is not for me: it is to show my teacher how she could teach. So the center moved to the classroom: a presentation mode for screen sharing, a quick rating of how much the group understood and, later, an anonymous Kahoot-style vote.\n\nSelf-study doesn’t go away. It just stops being first. Convincing the teacher comes before convincing the review algorithm.',
        },
      },

      // 4 — 16:57 — Contenido / Decisión
      {
        _key: 'entry-3',
        date: '2026-10-10',
        time: '16:57',
        dimension: dim('pen-line'),
        tag: decision,
        description: {
          es: 'La unidad de la app no es la palabra. Es el sentido.\n\n家 es casa y familia, pero también es la palabra que cuenta empresas y restaurantes: 一家公司, una empresa. Son dos cosas distintas que comparten carácter. Si las meto en la misma tarjeta, vuelvo al problema de Quizlet con más pasos.\n\nAsí que cada sentido se enseña en su lección y se mide por separado. Puedes saber que 家 es casa y no tener idea de que también cuenta restaurantes. Me pasó.',
          en: 'The app’s unit is not the word. It is the sense.\n\n家 is house and family, but it is also the word that counts companies and restaurants: 一家公司, one company. Two different things sharing a character. If I put them on the same card, I am back to the Quizlet problem with extra steps.\n\nSo each sense is taught in its own lesson and measured separately. You can know 家 means home and have no idea it also counts restaurants. It happened to me.',
        },
      },

      // 5 — 17:56 — Contenido / Insight
      {
        _key: 'entry-5',
        date: '2026-10-10',
        time: '17:56',
        dimension: dim('pen-line'),
        tag: insight,
        description: {
          es: 'Armé una lección de demo con diez palabras y treinta frases, y un validador que revisa si cada frase usa palabras de un nivel más alto que el del alumno.\n\nLo corrí por primera vez y me encontró 厕所, «baño», que es de nivel 5, escondida en una frase de nivel 2. Además 过, que yo tenía como básica, resultó ser de nivel 4 en la versión nueva del examen. Salió de la lección.\n\nConstruí una herramienta para revisar el contenido de otros y lo primero que revisó fue el mío.',
          en: 'I built a demo lesson with ten words and thirty sentences, plus a validator that checks whether each sentence uses words above the student’s level.\n\nI ran it for the first time and it found 厕所, "bathroom", which is level 5, hiding in a level 2 sentence. Also 过, which I had as basic, turned out to be level 4 in the new version of the exam. It left the lesson.\n\nI built a tool to check other people’s content and the first thing it checked was mine.',
        },
      },

      // 6 — 18:47 — Interfaz / Decisión
      {
        _key: 'entry-6',
        date: '2026-10-10',
        time: '18:47',
        dimension: dim('layers'),
        tag: decision,
        description: {
          es: 'La primera tarjeta tenía el carácter pintado de colores: el radical de uno, la parte que da el sonido de otro, la palabra clave en rojo. Muy didáctica. Parecía un semáforo.\n\nLa regla nueva: un color, un significado. El rojo suave es solo para la palabra clave en las frases. Al frente, el carácter va en tinta y el radical apenas cambia de tono. Los colores de cómo se forma pasan al reverso, que es donde se explica.\n\nSi todo está resaltado, no hay nada resaltado.',
          en: 'The first card had the character painted in colors: the radical in one, the sound part in another, the key word in red. Very educational. It looked like a traffic light.\n\nThe new rule: one color, one meaning. Soft red is only for the key word in sentences. On the front, the character is in ink and the radical only shifts in tone. The colors of how it is built move to the back, where it gets explained.\n\nIf everything is highlighted, nothing is.',
        },
        images: [anversoClaro, reversoOscuro],
      },

      // 7 — 19:42 — Contenido / Pivote
      {
        _key: 'entry-7',
        date: '2026-10-10',
        time: '19:42',
        dimension: dim('pen-line'),
        tag: pivote,
        description: {
          es: 'Decidí que la interfaz iba en chino por defecto: las docentes que imagino son chinas. Duró cuatro minutos.\n\nEl que va a abrir la demo primero soy yo, y después cualquiera que no sea mi profesora. Ahora la app mira el idioma del navegador: chino, español o inglés, y si no es ninguno, inglés. Hay un selector y se acuerda de lo que elegiste.\n\nLo que no cambia: las tarjetas van en el idioma de los alumnos, no en el de quien las abre. Son dos idiomas distintos, y me costó una tarde notarlo.',
          en: 'I decided the interface would be in Chinese by default: the teachers I picture are Chinese. It lasted four minutes.\n\nThe first person to open the demo is me, and then anyone who isn’t my teacher. Now the app reads the browser language: Chinese, Spanish or English, and English if it is none of those. There is a selector and it remembers your choice.\n\nWhat doesn’t change: the cards follow the students’ language, not whoever opens them. Two different languages, and it took me an afternoon to notice.',
        },
      },

      // 8 — 19:56 — Interfaz / Decisión
      {
        _key: 'entry-8',
        date: '2026-10-10',
        time: '19:56',
        dimension: dim('layers'),
        tag: decision,
        description: {
          es: 'El modo oscuro salió marrón. No café elegante: marrón de mueble viejo.\n\nProbé una paleta «dorada» en paralelo, sin tocar la original, y las comparé lado a lado. Ganó un fondo carbón frío casi negro, texto crema y acentos dorados. Después vino el detalle fino: en lo oscuro, la tinta del carácter baja de tono hacia el radical en vez de aclararlo, para que no brille como letrero.\n\nTener las dos versiones abiertas a la vez decidió más rápido que cualquier argumento.',
          en: 'The dark mode came out brown. Not elegant coffee: old-furniture brown.\n\nI tried a "golden" palette in parallel, without touching the original, and compared them side by side. A cold charcoal background, almost black, won, with cream text and gold accents. Then came the fine detail: in the dark, the character’s ink darkens toward the radical instead of lightening it, so it doesn’t glow like a sign.\n\nHaving both versions open at once decided faster than any argument.',
        },
        images: [anversoOscuro],
      },

      // 9 — 20:01 — Aprendizaje / Lección
      {
        _key: 'entry-9',
        date: '2026-10-10',
        time: '20:01',
        dimension: dim('book-open'),
        tag: leccion,
        description: {
          es: 'Durante un buen rato yo veía en pantalla colores que el código ya no tenía. Cambiaba algo, recargaba, y nada.\n\nEl servidor de desarrollo guarda una caché en disco que sobrevive a los reinicios, y seguía sirviendo los estilos viejos con toda tranquilidad. Antes de eso, los trazos de los caracteres salieron invisibles: una forma de mezclar colores que el compilador descartaba en silencio. Ni un error, ni un aviso. Trazos transparentes.\n\nCuando lo que ves no coincide con lo que escribiste, no siempre estás loco. A veces es la caché.',
          en: 'For a good while I was seeing colors on screen that the code no longer had. I changed something, reloaded, and nothing.\n\nThe dev server keeps a disk cache that survives restarts, and it kept serving the old styles without a care. Before that, the character strokes came out invisible: a way of mixing colors that the compiler dropped silently. No error, no warning. Transparent strokes.\n\nWhen what you see doesn’t match what you wrote, you are not always crazy. Sometimes it is the cache.',
        },
      },

      // 10 — 19:38 — Implementación / Fallo
      {
        _key: 'entry-10',
        date: '2026-10-10',
        time: '19:38',
        dimension: dim('code-2'),
        tag: fallo,
        description: {
          es: 'Le dije al navegador que la página estaba en chino. Chrome, muy servicial, decidió traducirla por su cuenta.\n\nResultado: 汉字 apareció como «Chinese character». En una app para aprender a leer caracteres chinos, el navegador quitaba los caracteres chinos.\n\nAhora la página le pide explícitamente que no traduzca. Es la única frase de la app que va dirigida a una máquina.',
          en: 'I told the browser the page was in Chinese. Chrome, very helpful, decided to translate it on its own.\n\nResult: 汉字 showed up as "Chinese character". In an app for learning to read Chinese characters, the browser was removing the Chinese characters.\n\nNow the page explicitly asks it not to translate. It is the only sentence in the app addressed to a machine.',
        },
      },

      // 11 — 20:51 — Proceso / Lección
      {
        _key: 'entry-11',
        date: '2026-10-10',
        time: '20:51',
        dimension: dim('route'),
        tag: leccion,
        description: {
          es: 'En algún momento de la tarde había tres agentes trabajando en la misma carpeta: Claude construyendo, otra sesión de Claude subiendo la app a Vercel y Codex haciendo una auditoría.\n\nUno cambió de rama, otro reinstaló dependencias, y el servidor se cayó en mitad del trabajo del tercero. La auditoría quedó a medias. Nadie hizo nada mal; simplemente estaban todos en la misma cocina.\n\nRegla nueva: cada agente en su propia copia del proyecto. Tres asistentes no te hacen tres veces más rápido si comparten la misma silla.',
          en: 'At some point in the afternoon there were three agents working in the same folder: Claude building, another Claude session deploying to Vercel, and Codex running an audit.\n\nOne switched branches, another reinstalled dependencies, and the server went down in the middle of the third one’s work. The audit was left half done. Nobody did anything wrong; they were just all in the same kitchen.\n\nNew rule: each agent in its own copy of the project. Three assistants don’t make you three times faster if they share the same chair.',
        },
      },

      // 12 — 22:33 — Interfaz / Decisión
      {
        _key: 'entry-12',
        date: '2026-10-10',
        time: '22:33',
        dimension: dim('layers'),
        tag: decision,
        description: {
          es: 'Quedaba decidir qué imagen lleva el reverso. Fotos no: el apretón de manos de 认识 es justo lo que este proyecto quiere evitar. Glifos inventados por IA, tampoco.\n\nLo que va son las formas antiguas reales del carácter, de los huesos oraculares al bronce y al sello, y solo cuando el carácter es un dibujo de verdad. 家 tiene un cerdo bajo un techo, y eso explica más que cualquier foto de stock.\n\nSi la imagen no ayuda a leer el carácter, no va.',
          en: 'What was left was deciding which image goes on the back. No photos: the 认识 handshake is exactly what this project wants to avoid. No AI-invented glyphs either.\n\nWhat goes in are the character’s real ancient forms, from oracle bones to bronze and seal script, and only when the character really is a drawing. 家 has a pig under a roof, and that explains more than any stock photo.\n\nIf the image doesn’t help read the character, it doesn’t go in.',
        },
      },

      // 13 — 22:45 — Cierre del día / Avance
      {
        _key: 'entry-13',
        date: '2026-10-10',
        time: '22:45',
        dimension: CIERRE_DEL_DIA,
        tag: avance,
        description: {
          es: 'A las tres de la tarde era una queja sobre Quizlet. A las once de la noche es una demo con login, una lección de diez palabras, una tarjeta que gira y una base de datos de verdad.\n\nLo que no pasó: nadie entró todavía con una cuenta real, mi profesora no la ha visto y nunca la probé compartiendo pantalla en Zoom, que es justo para lo que existe.\n\nSiete horas y media. Lo más difícil sigue pendiente: mostrársela a ella.',
          en: 'At three in the afternoon it was a complaint about Quizlet. At eleven at night it is a demo with login, a ten-word lesson, a card that flips and a real database.\n\nWhat didn’t happen: nobody has logged in with a real account yet, my teacher hasn’t seen it and I never tested it while screen sharing on Zoom, which is exactly what it exists for.\n\nSeven and a half hours. The hardest part is still pending: showing it to her.',
        },
        images: [reversoCelular],
      },

    ],
    repoUrl: 'https://github.com/everDavila/chinese-lesson',
    demoUrl: 'https://renshi.davila.uno',
  }

  await client.create(doc)
  console.log('  ✓ Rènshi creado')
}

await seedRenshi()
console.log('\n✅ Listo. Visita /es/playground/renshi')
