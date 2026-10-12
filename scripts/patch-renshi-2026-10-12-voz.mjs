/**
 * Patch — Rènshi: bitácora con la voz de Ever (12 oct 2026)
 * - Reescribe las 13 entradas del 10/10 con los textos curados por Ever y les pone título.
 * - Agrega 3 imágenes: las dos caras de la tarjeta de Quizlet (entrada 1) y la propuesta de 房子 (entrada 3).
 * - Agrega 17 entradas del 11 y 12 de octubre.
 * Guarda un respaldo de logEntries antes de escribir.
 *
 * Uso:
 *   node scripts/patch-renshi-2026-10-12-voz.mjs <carpeta-de-imagenes>
 *
 * Requiere SANITY_TOKEN en .env.local
 */

import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync, createReadStream } from 'fs'
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
const IMG_DIR = process.argv[2]
if (!IMG_DIR) throw new Error('Falta la carpeta de imágenes')

const dim = (icon) => ({ _type: 'reference', _ref: `dim-${icon}` })
const CIERRE_DEL_DIA = { _type: 'reference', _ref: '5ca5c31a-f9b2-4e71-95c9-ffc839552aa7' }

async function getTagRef(slug) {
  const id = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug })
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

async function uploadImage(file, key, captionEs, captionEn) {
  const asset = await client.assets.upload('image', createReadStream(`${IMG_DIR}/${file}`), {
    filename: `renshi-${key}.png`,
  })
  return {
    _type: 'image',
    _key: key,
    asset: { _type: 'reference', _ref: asset._id },
    caption: { es: captionEs, en: captionEn },
  }
}

// ── Entradas del 10/10: título + texto nuevo, por _key ───────────────────────
const REWRITE = {
  'entry-1': {
    title: { es: 'Quizlet me estafó', en: 'Quizlet scammed me' },
    es: `A las tres de la tarde tenía una queja y una hipótesis. La queja: las tarjetas de Quizlet de mi profesora traducen palabra por palabra, y el chino no se deja. La hipótesis: una palabra se entiende mejor dentro de una frase que sola en una tarjeta.\n\nNo es una idea nueva. Lo nuevo es que esta vez me tocó sufrirlo como alumno.`,
    en: `At three in the afternoon I had a complaint and a hypothesis. The complaint: my teacher's Quizlet cards translate word for word, and Chinese won't have it. The hypothesis: a word makes more sense inside a sentence than alone on a card.\n\nNot a new idea. What's new is that this time I got to suffer it as a student.`,
  },
  'entry-2': {
    title: { es: 'El masoquismo técnico', en: 'Technical masochism' },
    es: `Con Nimbus ya dominaba Vue y Firebase con los ojos cerrados. ¿Qué hace una persona sensata? Usar lo que funciona. ¿Qué hice yo? Exacto: mandarlo todo al diablo y usar algo diferente: Next.js con Supabase.\n\nPorque claro, ¿para qué terminar rápido si puedes complicarte la vida aprendiendo un stack nuevo en un subdominio propio? Necesitaba login para las docentes y una base de datos de verdad, pero sobre todo necesitaba recordarme que no sé vivir en paz.\n\nDe Nimbus me traje lo único verdaderamente valioso: el catálogo completo de todos los errores que ya me costaron lágrimas.`,
    en: `With Nimbus I already had Vue and Firebase down with my eyes closed. What does a sensible person do? Use what works. What did I do? Exactly: send it all to hell and use something different: Next.js with Supabase.\n\nBecause sure, why finish fast when you can complicate your life learning a new stack on its own subdomain? I needed a login for teachers and a real database, but above all I needed to remind myself that I don't know how to live in peace.\n\nFrom Nimbus I brought the only truly valuable thing: the complete catalog of every mistake that has already cost me tears.`,
  },
  'entry-3': {
    title: { es: 'La trampa del 2x1', en: 'The two-for-one trap' },
    es: `La unidad de la app no es la palabra. Es el sentido.\n\nCada uso de un carácter va en su propia lección y se mide por separado. Si los meto todos en la misma tarjeta, vuelvo al problema de Quizlet con más pasos.`,
    en: `The app's unit isn't the word. It's the sense.\n\nEach use of a character goes in its own lesson and is measured separately. If I cram them all onto the same card, I'm back to the Quizlet problem with extra steps.`,
  },
  'entry-4': {
    title: { es: 'El síndrome de Estocolmo pedagógico', en: 'Pedagogical Stockholm syndrome' },
    es: `Mi plan maestro duró exactamente dos horas: empezó como una app solitaria para estudiar mientras lloro sobre mis apuntes y para la tarde ya era un circo interactivo.\n\nCaí en la cuenta de que esta demo no es para salvarme a mí: es para hipnotizar a mi profesora y mostrarle en vivo cómo debería sentirse una clase. El centro ahora es el aula: modo presentación para compartir pantalla en Zoom, termómetro de entendimiento en tiempo real y, más adelante, votación anónima tipo Kahoot para medirle el pulso al grupo sin exponer a nadie.\n\nEl autoestudio sigue ahí, pero en lista de espera. Primero hay que lograr el hechizo en el aula; el algoritmo de repetición espaciada puede esperar su turno.`,
    en: `My master plan lasted exactly two hours: it started as a solitary app for studying while I cry over my notes, and by the afternoon it was an interactive circus.\n\nIt dawned on me that this demo isn't here to save me: it's here to hypnotize my teacher and show her, live, how a class should feel. The center is now the classroom: presentation mode for screen sharing on Zoom, a real-time understanding thermometer and, later on, an anonymous Kahoot-style vote to take the group's pulse without exposing anyone.\n\nSelf-study is still there, but on the waiting list. First the spell has to work in the classroom; the spaced repetition algorithm can wait its turn.`,
  },
  'entry-5': {
    title: { es: 'Cazador cazado', en: 'The hunter hunted' },
    es: `Armé diez palabras, treinta frases de prueba y un validador justiciero para evitar que un alumno principiante termine leyendo jeroglíficos de maestría.\n\nCorrí el script con el pecho inflado de orgullo y lo primero que me escupió en la cara fue 厕所 («baño»), una palabra de nivel 5 escondida como contrabando en una frase de nivel 2. Y 过, que yo juraba que era de kínder, resulta que en el examen nuevo es nivel 4.\n\nConstruí un detector de ignorancia ajena y lo primero que detectó fue la mía. Poético.`,
    en: `I put together ten words, thirty test sentences and a vigilante validator to keep a beginner from ending up reading mastery-level hieroglyphs.\n\nI ran the script with my chest puffed out in pride, and the first thing it spat in my face was 厕所 ("bathroom"), a level 5 word smuggled into a level 2 sentence. And 过, which I swore was kindergarten stuff, turns out to be level 4 in the new exam.\n\nI built a detector for other people's ignorance and the first thing it detected was mine. Poetic.`,
  },
  'entry-6': {
    title: { es: 'Menos carnaval, más dignidad', en: 'Less carnival, more dignity' },
    es: `La primera versión de la tarjeta era un vómito de arcoíris: el radical de un color, la fonética de otro, la palabra clave en rojo fosforescente. Muy didáctico, decían. Parecía el tablero de control de Chernobyl.\n\nDecreté ley marcial visual: un color, un significado. El rojo suave queda estrictamente confiscado para la palabra clave en contexto. Al frente, el carácter va sobrio en tinta china y el radical apenas respira en un tono sutil. Las explicaciones cromáticas de cómo se armó el monstruo se van al reverso, donde nadie salga lastimado.\n\nSi todo grita al mismo tiempo, nadie escucha un carajo.`,
    en: `The first version of the card was a rainbow throw-up: the radical in one color, the phonetic part in another, the key word in fluorescent red. Very educational, they said. It looked like the control panel at Chernobyl.\n\nI declared visual martial law: one color, one meaning. Soft red is strictly confiscated for the key word in context. On the front, the character goes sober in Chinese ink and the radical barely breathes in a subtle tone. The color-coded explanations of how the monster was assembled move to the back, where nobody gets hurt.\n\nIf everything shouts at once, nobody hears a damn thing.`,
  },
  'entry-10': {
    title: { es: 'Chrome, el saboteador silencioso', en: 'Chrome, the silent saboteur' },
    es: `Le avisé educadamente al navegador que la página estaba en chino. Chrome, con esa prepotencia que lo caracteriza, decidió que yo necesitaba su caridad y la tradujo entera sin pedir permiso.\n\nResultado brillante: 汉字 pasó a ser «Chinese character». En una plataforma diseñada específicamente para aprender a descifrar caracteres chinos, el navegador se encargó de borrarlos todos.\n\nAhora el código incluye una orden explícita para que Chrome se meta las manos en los bolsillos y no toque nada. Es la única línea de toda la app escrita para domar a una máquina insolente.`,
    en: `I politely told the browser the page was in Chinese. Chrome, with its signature arrogance, decided I needed its charity and translated the whole thing without asking.\n\nBrilliant result: 汉字 became "Chinese character". On a platform designed specifically to learn to decipher Chinese characters, the browser took care of erasing every one of them.\n\nNow the code includes an explicit order for Chrome to keep its hands in its pockets and touch nothing. It's the only line in the whole app written to tame an insolent machine.`,
  },
  'entry-7': {
    title: { es: 'La realidad me duró cuatro minutos', en: 'Reality took four minutes' },
    es: `Se me ocurrió la brillante idea de poner la interfaz en chino por defecto porque «las profesoras son nativas». Duré con esa convicción exactamente 240 segundos.\n\nEl primero en abrir esta abominación soy yo, y después cualquier curioso que probablemente no distingue un ideograma de un fideo ramen. Ahora la app husmea el idioma del navegador: chino, español o inglés, con selector manual para los inconformes.\n\nLo intocable: las tarjetas van en el idioma del estudiante, no en el de quien proyecta la pantalla. Tardé media tarde en entender esa obviedad, pero finjamos que siempre fue parte del plan.`,
    en: `I had the brilliant idea of making the interface Chinese by default because "the teachers are native speakers". I held that conviction for exactly 240 seconds.\n\nThe first person to open this abomination is me, and after that any curious visitor who probably can't tell an ideogram from a ramen noodle. Now the app sniffs the browser language: Chinese, Spanish or English, with a manual selector for the nonconformists.\n\nThe untouchable part: cards go in the student's language, not in the language of whoever projects the screen. It took me half an afternoon to grasp that obvious fact, but let's pretend it was always part of the plan.`,
  },
  'entry-8': {
    title: { es: 'Marrón funeraria', en: 'Funeral-home brown' },
    es: `El primer intento de modo oscuro fue una tragedia estética: marrón mueble de oficina pública de los años 70. Una depresión en CSS.\n\nMonté una paleta dorada en paralelo para comparar cadáveres. Ganó por goleada un fondo carbón frío que roza el vacío existencial, texto crema y detalles dorados. Luego el toque obsesivo: en la oscuridad, la tinta del carácter baja de intensidad hacia el radical en vez de encenderse, porque la idea es que aprendan chino, no que queden ciegos con un letrero de neón.\n\nPoner las dos pantallas juntas cerró la discusión más rápido que cualquier debate filosófico sobre diseño.`,
    en: `The first attempt at dark mode was an aesthetic tragedy: 1970s government-office-furniture brown. Depression in CSS.\n\nI set up a golden palette in parallel to compare corpses. The winner, by a landslide: a cold charcoal background bordering on the existential void, cream text and gold details. Then the obsessive touch: in the dark, the character's ink dims toward the radical instead of lighting up, because the idea is for them to learn Chinese, not go blind staring at a neon sign.\n\nPutting the two screens side by side ended the discussion faster than any philosophical debate about design.`,
  },
  'entry-9': {
    title: { es: 'Gaslighting por software', en: 'Gaslit by software' },
    es: `Estuve un buen rato dudando de mi propia salud mental porque cambiaba estilos en el código y la pantalla seguía exactamente igual. Recargaba, rezaba, y nada.\n\nEl servidor de desarrollo guardaba una caché en disco tan terca que sobrevivía a los reinicios y me seguía mostrando la versión vieja con una sonrisa burlona. Minutos antes, los trazos de los caracteres habían desaparecido por completo: un truco de colores que el compilador decidió ignorar en absoluto silencio, sin un miserable error en consola.`,
    en: `I spent a good while doubting my own sanity because I'd change styles in the code and the screen stayed exactly the same. Reload, pray, nothing.\n\nThe dev server kept a disk cache so stubborn it survived restarts and kept showing me the old version with a mocking smile. Minutes earlier, the character strokes had vanished entirely: a color trick the compiler decided to ignore in absolute silence, without a single miserable error in the console.`,
  },
  'entry-11': {
    title: { es: 'Muchos cocineros queman la sopa', en: 'Too many cooks burn the soup' },
    es: `Hubo un momento cumbre de delirio en el que tres agentes de IA operaban sobre la misma carpeta: un Claude picando código, otro Claude intentando desplegar en Vercel y Codex haciendo una auditoría moral, y Cline husmeando cómo trabajan los otros para meter látigo y «corregir».\n\nUno cambió de rama en Git, el otro ejecutó un npm install a traición y el servidor colapsó a mitad del análisis del tercero. La auditoría murió en el acto. Nadie tuvo la culpa, pero tres inteligencias artificiales apretadas en la misma terminal son tan eficientes como tres personas intentando manejar el mismo volante.\n\nRegla de oro: cada agente en su propio corral. Multiplicar ayudantes solo multiplica el caos si todos se sientan en la misma silla.`,
    en: `There was a peak moment of delirium when three AI agents were operating on the same folder: one Claude hammering out code, another Claude trying to deploy to Vercel and Codex running a moral audit, with Cline snooping on how the others worked so it could crack the whip and "correct" them.\n\nOne switched Git branches, another ran a treacherous npm install, and the server collapsed in the middle of the third one's analysis. The audit died on the spot. Nobody was to blame, but three artificial intelligences squeezed into the same terminal are as efficient as three people trying to drive with the same steering wheel.\n\nGolden rule: each agent in its own pen. Adding helpers only multiplies the chaos if they all sit in the same chair.`,
  },
  'entry-12': {
    title: { es: 'Fotos de stock nunca más', en: 'Stock photos never again' },
    es: `Faltaba el reverso. Me negué rotundamente a meter fotos: el apretón de manos genérico de 认识 es el enemigo jurado de este proyecto. Y de glifos generados por IA alucinando trazos, ni hablemos.\n\nNos fuimos a la fuente milenaria: formas antiguas reales, huesos oraculares y bronce, pero solo cuando el carácter cuenta un chiste visual de verdad. 家 es literalmente un cerdo durmiendo bajo un techo; eso te enseña más historia y contexto que cualquier modelo sonriente de Shutterstock.\n\nSi el dibujo no te ayuda a memorizar el trazo, va directo a la basura.`,
    en: `The back of the card was still missing. I flatly refused to put photos in: the generic handshake of 认识 is this project's sworn enemy. And glyphs generated by an AI hallucinating strokes, don't even get me started.\n\nWe went to the millennia-old source: real ancient forms, oracle bones and bronze, but only when the character tells a genuine visual joke. 家 is literally a pig sleeping under a roof; that teaches you more history and context than any smiling Shutterstock model.\n\nIf the drawing doesn't help you remember the stroke, it goes straight in the trash.`,
  },
  'entry-13': {
    title: { es: 'La hora de la verdad', en: 'Moment of truth' },
    es: `A las tres de la tarde era un berrinche infantil contra Quizlet. A las once de la noche es un monstruo funcional con autenticación, diez palabras cargadas, tarjetas que giran y una base de datos operativa.\n\nDetalle menor sin importancia: ningún usuario real la ha tocado, mi profesora ni se entera de que esto existe y jamás la probé compartiendo pantalla por Zoom, que era supuestamente la razón de ser de todo este circo.\n\nSiete horas y media quemando tokens. El código está listo; ahora solo falta la parte aterradora: mostrárselo a ella y rezar para que no me mande a estudiar en Quizlet otra vez.`,
    en: `At three in the afternoon it was a childish tantrum against Quizlet. At eleven at night it's a working monster with authentication, ten words loaded, cards that flip and an operational database.\n\nMinor detail of no importance: no real user has touched it, my teacher has no idea this exists, and I never tested it while screen sharing on Zoom, which was supposedly the whole point of this circus.\n\nSeven and a half hours burning tokens. The code is ready; all that's left is the terrifying part: showing it to her and praying she doesn't send me back to studying on Quizlet.`,
  },
}

// ── Entradas nuevas: 11 y 12 de octubre ──────────────────────────────────────
const NEW = [
  {
    date: '2026-10-11', time: '00:06', dim: 'cloud', tag: 'avance',
    title: { es: 'Dios bendiga a producción', en: 'God bless production' },
    es: `Creé el subdominio. Vercel lo miró, dijo «sí, verificado», se cruzó de brazos y se negó a emitir el certificado SSL por pura desidia. Estaba verificado, sí; seguro, ni de chiste. Tuve que ir a rogarle el candadito a mano como si fuera un trámite burocrático municipal.\n\nLa otra joya: la app llegó viva a producción antes de que a mí se me ocurriera probar el login con mi propia cuenta. Lo testeé directamente en vivo, como los valientes o los inconscientes. Milagrosamente no explotó nada.`,
    en: `I created the subdomain. Vercel looked at it, said "yes, verified", crossed its arms and refused to issue the SSL certificate out of sheer apathy. Verified, yes; secure, not a chance. I had to go beg for the little padlock by hand, like it was paperwork at city hall.\n\nThe other gem: the app reached production alive before it occurred to me to test the login with my own account. I tested it straight in production, like the brave or the reckless do. Miraculously, nothing blew up.`,
  },
  {
    date: '2026-10-11', time: '01:28', dim: 'target', tag: 'pivote',
    title: { es: 'Adiós maqueta, hola pánico', en: 'Goodbye mockup, hello panic' },
    es: `Diez palabras alcanzan para impresionar en una presentación. Para aprender un idioma no sirven ni para pedir agua.\n\nA esa hora de la madrugada le enchufé el temario oficial del HSK 3.0 (niveles 1 al 3) y la app mutó en otra especie. La profesora que use esto ya no tiene que picar piedra desde cero: agarra una plantilla del temario, la tunea a gusto y listo. Las colecciones son de ella; la base troncal solo la toca el administrador supremo (yo).\n\nDejé de tener una demo coqueta para convencer incrédulos y pasé a tener una herramienta que alguien podría usar un martes a las 8 de la mañana. Y eso da un terror genuino.`,
    en: `Ten words are enough to impress in a presentation. For learning a language they won't even get you a glass of water.\n\nAt that hour of the morning I plugged in the official HSK 3.0 syllabus (levels 1 to 3) and the app mutated into another species. The teacher who uses this no longer has to start from scratch: she grabs a template from the syllabus, tweaks it to taste, done. The collections are hers; the core base is only touched by the supreme administrator (me).\n\nI stopped having a flirty demo to win over skeptics and started having a tool someone could use on a Tuesday at 8 a.m. And that is genuinely terrifying.`,
  },
  {
    date: '2026-10-11', time: '09:02', dim: 'code-2', tag: 'fallo',
    title: { es: 'Espejismo en la base de datos', en: 'Database mirage' },
    es: `En el prototipo todo era glamour: mil sentidos perfectamente desglosados con categoría gramatical de revista. Cuando lo enchufé a la base de datos real, el glamour se convirtió en un páramo desierto con etiquetas crípticas en chino abreviado tipo «量、（名）».\n\nDescubrí la trampa: la maqueta consumía un archivo suelto y primoroso que jamás nadie se molestó en migrar a las tablas de verdad. Lo bonito vivía en la fantasía local; la base de datos tenía apenas un esqueleto raquítico.\n\nUna migración de emergencia tapó los agujeros. Once palabras siguen flotando en el limbo sin significado porque la fuente original tampoco los traía, y el español —que era la bandera de toda esta cruzada— quedó postergado para cuando haya oxígeno.`,
    en: `In the prototype everything was glamour: a thousand senses perfectly broken down, with magazine-grade grammatical categories. When I plugged it into the real database, the glamour turned into a barren wasteland with cryptic labels in abbreviated Chinese like «量、（名）».\n\nI found the trick: the mockup read from a loose, lovingly crafted file that nobody ever bothered to migrate to the real tables. The pretty stuff lived in the local fantasy; the database had barely a scrawny skeleton.\n\nAn emergency migration plugged the holes. Eleven words are still floating in limbo with no meaning because the original source didn't have them either, and Spanish —the banner of this whole crusade— got postponed until there's oxygen.`,
  },
  {
    date: '2026-10-11', time: '09:40', dim: 'route', tag: 'leccion',
    title: { es: 'Ciberseguridad básica para agentes chismosos', en: 'Basic cybersecurity for nosy agents' },
    es: `Para testear las pantallas protegidas, el atajo perezoso era regalarle mi contraseña al agente de turno. Ni loco. Soy paranoico, sí, pero con fundamentos: darle credenciales a una IA es la versión moderna de dejar la llave pegada por fuera de la puerta y esperar que nadie la gire.\n\nApliqué criterio: me logueo yo una sola vez, la sesión se queda tibia en mi máquina y las pruebas automatizadas entran colgadas de esa cookie sin que nadie tenga que ver mis claves.`,
    en: `To test the protected screens, the lazy shortcut was to hand my password to whichever agent was on duty. No way. I'm paranoid, yes, but with good reason: giving credentials to an AI is the modern version of leaving the key in the outside of the door and hoping nobody turns it.\n\nI applied some judgment: I log in once, the session stays warm on my machine, and the automated tests ride on that cookie without anyone having to see my passwords.`,
  },
  {
    date: '2026-10-11', time: '10:37', dim: 'cloud', tag: 'insight',
    title: { es: 'Turismo de paquetes de red', en: 'Network packet tourism' },
    es: `La pantalla de colecciones se quedaba más de un segundo en blanco con cara de nada. No suena a drama hasta que imaginas a veinte alumnos mirándote en silencio en plena clase de Zoom.\n\nEl diagnóstico fue un chiste de geografía: la app corría en un centro de datos de Virginia y la base de datos dormía plácidamente en São Paulo. Cada consulta tenía que viajar de Lima a Estados Unidos, bajar a Brasil y rebotar de vuelta. Una gira continental por cada clic.\n\nMudé la app a São Paulo, dejé de traerme el texto íntegro de 68 lecciones solo para calcular cuántas eran y metí un esqueleto de carga para disimular. Bajó de 1,3 a 0,5 segundos. La mitad de la optimización fue simplemente respetar el mapa mundi.`,
    en: `The collections screen stayed blank for over a second, staring at nothing. Doesn't sound dramatic until you picture twenty students silently staring at you in the middle of a Zoom class.\n\nThe diagnosis was a geography joke: the app ran in a data center in Virginia and the database was sleeping peacefully in São Paulo. Every query had to travel from Lima to the United States, go down to Brazil and bounce back. A continental tour for every click.\n\nI moved the app to São Paulo, stopped pulling the full text of 68 lessons just to count how many there were, and added a loading skeleton to save face. It dropped from 1.3 to 0.5 seconds. Half the optimization was simply respecting the world map.`,
  },
  {
    date: '2026-10-11', time: '11:01', dim: 'target', tag: 'decision',
    title: { es: 'Prohibido memorizar canciones', en: 'No memorizing songs allowed' },
    es: `Si en cada clase pones exactamente las mismas dos frases por tarjeta, a la tercera sesión los alumnos ya no están leyendo caracteres: están cantando el estribillo de memoria como loros amaestrados.\n\nAhora la profesora decide cuántas frases quiere mostrar y la app las baraja con criterio: primero las que ese grupo todavía no ha visto, y después las que ya juntaron polvo en el olvido. Las frases que ella misma escribe a mano entran a la ruleta en igualdad de condiciones.\n\nRepetir el carácter es aprender; repetir la frase idéntica es karaoke.`,
    en: `If every class shows exactly the same two sentences per card, by the third session students aren't reading characters anymore: they're singing the chorus from memory like trained parrots.\n\nNow the teacher decides how many sentences to show and the app shuffles them with some sense: first the ones that group hasn't seen yet, then the ones gathering dust in oblivion. The sentences she writes by hand go into the roulette on equal terms.\n\nRepeating the character is learning; repeating the identical sentence is karaoke.`,
  },
  {
    date: '2026-10-11', time: '14:56', dim: 'target', tag: 'avance',
    title: { es: 'Kahoot sin el estrés del registro', en: 'Kahoot without the sign-up stress' },
    es: `La votación anónima —esa que ayer por la tarde juré que dejaría «para una segunda fase»— ya está viva y coleando.\n\nEn plena lección, la docente aprieta la tecla V, la pantalla da un código y los alumnos votan desde el teléfono sin crearse cuenta, sin dar correos y sin dejar rastro. Ven el carácter y el pinyin (el significado bien escondido, obvio) y pueden rectificar si el pánico los hace cambiar de idea. Ella ve la marea de votos en tiempo real con un semáforo implacable que delata si el curso entendió o si están todos en la luna.\n\nEl infierno no fue la interfaz: fue autorizar que un perfecto desconocido sin sesión abierta pueda escribir en mi base de datos sin regalarle las escrituras del servidor.`,
    en: `The anonymous vote —the one I swore yesterday afternoon I'd leave "for a second phase"— is alive and kicking.\n\nMid-lesson, the teacher hits the V key, the screen shows a code and students vote from their phones without creating an account, without giving an email and without leaving a trace. They see the character and the pinyin (the meaning well hidden, obviously) and can change their answer if panic makes them change their mind. She watches the tide of votes in real time with a merciless traffic light that reveals whether the class got it or everyone's on the moon.\n\nThe hell wasn't the interface: it was allowing a total stranger with no session to write to my database without handing them the deeds to the server.`,
  },
  {
    date: '2026-10-11', time: '15:25', dim: 'pen-line', tag: 'leccion',
    title: { es: 'La arrogancia de las tarjetas', en: 'The arrogance of cards' },
    es: `La sección de etimología juraba muy suelta de huesos que 爱 («amor») era un carácter simple. Spoiler: no lo es ni de cerca. La app lo afirmaba simplemente porque no tenía datos, y ante el vacío prefirió mentir con absoluta seguridad antes que admitir ignorancia. Muy humano de su parte.\n\nLey marcial de contenido: si no hay datos blindados, la tarjeta se calla la boca. Tras varios bocetos, la fórmula quedó en el chasis mínimo: solo las piezas con su pinyin debajo (知 = 矢 + 口), sin meterse a inventar fábulas.\n\nLe apliqué a mi propia criatura la misma motosierra que le pasé a Quizlet. Una tarjeta en silencio enseña poco, pero una tarjeta charlatana desinforma.`,
    en: `The etymology section swore, cool as anything, that 爱 ("love") was a simple character. Spoiler: it's not even close. The app claimed it simply because it had no data, and faced with the void it preferred to lie with absolute confidence rather than admit ignorance. Very human of it.\n\nContent martial law: if there's no rock-solid data, the card keeps its mouth shut. After several drafts, the formula was stripped to the bare chassis: just the pieces with their pinyin underneath (知 = 矢 + 口), without making up fables.\n\nI took to my own creature the same chainsaw I took to Quizlet. A silent card teaches little, but a chatty card misinforms.`,
  },
  {
    date: '2026-10-11', time: '19:01', dim: 'cloud', tag: 'decision',
    title: { es: 'Bautismo de fuego con red de seguridad', en: 'Baptism of fire, with a safety net' },
    es: `Hasta hoy, mi método de testing consistía en tirar código directamente contra la base de datos de producción. Una técnica fascinante, equivalente a cruzar una autopista con los ojos vendados porque «hasta ahora no me atropellaron».\n\nCreé una segunda base clonada exclusivamente para romper cosas en paz. La rotación de frases y el sistema de votación sudaron ahí primero: ocho suites en verde, respaldo de seguridad y recién ahí el salto a producción. Mi primera versión oficialmente no suicida.\n\nDetalle simpático del ecosistema: PowerShell decidió tragarse un par de guiones en la terminal y las pruebas corrieron alegremente contra la base que no era sin tirar un solo error. Qué delicia trabajar en Windows.`,
    en: `Until today, my testing method consisted of throwing code straight at the production database. A fascinating technique, equivalent to crossing a highway blindfolded because "nobody has run me over so far".\n\nI created a second, cloned database exclusively for breaking things in peace. Sentence rotation and the voting system sweated it out there first: eight suites in green, a safety backup, and only then the jump to production. My first officially non-suicidal version.\n\nCharming detail of the ecosystem: PowerShell decided to swallow a couple of dashes in the terminal and the tests happily ran against the wrong database without throwing a single error. Such a delight, working on Windows.`,
  },
  {
    date: '2026-10-11', time: '22:20', dim: 'layers', tag: 'insight',
    title: { es: 'La trampa del «todo bien»', en: 'The "all good" trap' },
    es: `Mandé a auditar la interfaz y el reporte volvió con un condescendiente «nada grave». Mandé una segunda pasada de inmediato: en software, «nada grave» suele ser el disfraz de un desastre inminente.\n\nAparecieron dos bellezas: si se cae el WiFi de la clase —cosa que pasa en el 100 % de las escuelas del planeta— la pantalla del estudiante se quedaba con unos puntos suspensivos infinitos, dejándolo con la duda existencial de si se cayó internet o si la profesora se quedó dormida. La otra: el lector de pantalla en español leía el carácter 家 con acento porteño («ya»).\n\nLa primera auditoría no era mala; simplemente tenía pocas ganas de trabajar.`,
    en: `I sent the interface off to be audited and the report came back with a condescending "nothing serious". I ordered a second pass immediately: in software, "nothing serious" is usually an impending disaster in disguise.\n\nTwo beauties turned up. If the classroom WiFi drops —which happens in 100% of the world's schools— the student's screen was left with endless ellipsis dots, leaving them with the existential doubt of whether the internet died or the teacher fell asleep. The other: the Spanish screen reader read the character 家 with a Buenos Aires accent ("ya").\n\nThe first audit wasn't bad; it just wasn't in the mood to work.`,
  },
  {
    date: '2026-10-11', time: '23:21', dim: 'pen-line', tag: 'leccion',
    title: { es: 'Cuando la IA alucina en yuanes', en: 'When AI hallucinates in yuan' },
    es: `Los mil sentidos ya tienen su traducción al español y pasamos el rastrillo por más de dos mil frases de ejemplo, mezcla de bases públicas y ocurrencias sintéticas de inteligencias artificiales.\n\nLa basura que salió a flote fue digna de museo: nombres latinos encajados con calzador en medio de dinastías imperiales, pronombres con el género invertido, frases con fecha de vencimiento y precios en dólares donde el texto en mandarín hablaba de yuanes.\n\nNada de eso se marcó como verificado. Que un modelo de lenguaje le revise la tarea a otro modelo de lenguaje es un chiste circular. El visto bueno definitivo lo firma un cerebro humano que hable chino, o no lo firma nadie.`,
    en: `All thousand senses now have their Spanish translation, and we raked through over two thousand example sentences, a mix of public databases and synthetic brainchildren of artificial intelligences.\n\nThe junk that surfaced was museum-worthy: Latin names shoehorned into the middle of imperial dynasties, pronouns with the gender flipped, sentences with an expiration date and prices in dollars where the Mandarin text talked about yuan.\n\nNone of it was marked as verified. One language model grading another language model's homework is a circular joke. The final sign-off comes from a human brain that speaks Chinese, or nobody signs it.`,
  },
  {
    date: '2026-10-12', time: '01:07', dim: 'layers', tag: 'decision',
    title: { es: 'Física de formularios y fantasmas en la red', en: 'Form physics and network ghosts' },
    es: `El input para ingresar el código era un campo de texto común y corriente. Si al alumno le faltaba un solo carácter, no tenía forma de saberlo hasta enviar el formulario y recibir un error genérico en pantalla. Cero pistas.\n\nLo rediseñé a seis casillas individuales: si falta una letra, el vacío te grita desde la pantalla. Además logré que la votación baile al ritmo de la diapositiva: la profesora cambia de carácter y a los alumnos les rota la pantalla automáticamente.\n\nEn el camino saltó un bug de enredo vodevilesco: una petición rezagada que preguntaba «¿la votación sigue activa?» llegaba tres segundos tarde y le apagaba la pantalla a la profesora justo después de que ella la acababa de encender con la tecla V. Cine puro.`,
    en: `The input for entering the code was a plain old text field. If the student was missing a single character, they had no way of knowing until they submitted the form and got a generic error on screen. Zero clues.\n\nI redesigned it into six individual boxes: if a letter is missing, the gap screams at you from the screen. I also got the vote to dance to the rhythm of the slide: the teacher moves to the next character and the students' screens rotate automatically.\n\nAlong the way a farcical bug popped up: a straggling request asking "is the vote still active?" arrived three seconds late and switched the vote off on the teacher right after she had switched it on with the V key. Pure cinema.`,
  },
  {
    date: '2026-10-12', time: '02:15', dim: 'pen-line', tag: 'avance',
    title: { es: 'Once mil razones para colapsar', en: 'Eleven thousand reasons to collapse' },
    es: `Le abrí la compuerta al resto del temario oficial: del HSK 4 hasta el 9. La base engordó brutalmente de mil a once mil términos.\n\nEl editor y el panel de administración, muy inocentes ellos, intentaban bajarse el diccionario entero al navegador para filtrar en cliente. Con mil palabras la máquina no se quejaba; con once mil casi sale humo del procesador. Ahora la búsqueda se hace donde debe hacerse —en la base de datos— y al navegador solo viaja lo estrictamente solicitado.\n\nLo que funciona a escala de juguete no es que sea robusto: es que todavía no le diste motivos para quebrarse.`,
    en: `I opened the floodgates to the rest of the official syllabus: HSK 4 all the way to 9. The database ballooned from a thousand to eleven thousand terms.\n\nThe editor and the admin panel, innocent as they were, tried to download the entire dictionary into the browser to filter on the client. With a thousand words the machine didn't complain; with eleven thousand, smoke nearly came out of the processor. Now the search happens where it should —in the database— and only what was asked for travels to the browser.\n\nWhat works at toy scale isn't robust: you just haven't given it a reason to break yet.`,
  },
  {
    date: '2026-10-12', time: '02:51', dim: 'target', tag: 'pivote',
    title: { es: 'Hacer del vacío una virtud', en: 'Making a virtue of emptiness' },
    es: `Con la avalancha del nuevo catálogo, 9.900 palabras quedaron huérfanas de frases. Y mi dogma original era implacable: sin frases contextuales, la tarjeta no se muestra. Consecuencia: el 90 % del diccionario nuevo quedaba censurado bajo siete llaves.\n\nTuve que tragarme el orgullo y reescribir las reglas. Ahora las palabras sin frase se muestran igual, pero el reverso le pasa la pelota al aula: «Inventen una frase con esta palabra. Díganla en voz alta; la profesora la corrige».\n\nLo que nació como un parche desesperado para tapar un agujero terminó siendo el mejor acierto pedagógico de la semana. Usar una palabra bajo presión enseña diez veces más que mirarla en silencio.`,
    en: `With the avalanche of the new catalog, 9,900 words were left orphaned without sentences. And my original dogma was ruthless: no contextual sentences, no card. Consequence: 90% of the new dictionary was censored under lock and key.\n\nI had to swallow my pride and rewrite the rules. Now words without sentences show up anyway, but the back of the card passes the ball to the class: "Make up a sentence with this word. Say it out loud; the teacher will correct it."\n\nWhat was born as a desperate patch to cover a hole ended up being the best teaching call of the week. Using a word under pressure teaches ten times more than staring at it in silence.`,
  },
  {
    date: '2026-10-12', time: '03:08', dim: 'target', tag: 'decision',
    title: { es: 'Crisis de identidad resuelta', en: 'Identity crisis solved' },
    es: `El proyecto venía arrastrando el nombre provisorio de Hanzi, que literalmente significa «caracteres chinos». Es el equivalente intelectual de bautizar una app de español como «Letras». Cero esfuerzo poético.\n\nAhora se llama Rènshi (认识): conocer, reconocer. Justamente la palabra del infame apretón de manos de Quizlet que disparó todo este drama. Dominio nuevo, logo nuevo, título nuevo: renshi.davila.uno, con el viejo redirigiendo al exilio.\n\nLa ironía poética: el buscador llevaba días usando «renshi» como texto de relleno en los ejemplos de pinyin. La app sabía cómo quería llamarse mucho antes de que a mí se me cayera la ficha.`,
    en: `The project had been dragging along the provisional name Hanzi, which literally means "Chinese characters". It's the intellectual equivalent of naming a Spanish app "Letters". Zero poetic effort.\n\nNow it's called Rènshi (认识): to know, to recognize. Precisely the word from Quizlet's infamous handshake that set off this whole drama. New domain, new logo, new title: renshi.davila.uno, with the old one redirecting into exile.\n\nThe poetic irony: the search box had been using "renshi" as filler text in its pinyin examples for days. The app knew what it wanted to be called long before the penny dropped for me.`,
  },
  {
    date: '2026-10-12', time: '03:59', dim: 'pen-line', tag: 'avance',
    title: { es: 'Nadie pide fideos pensando en el HSK', en: 'Nobody orders noodles thinking about the HSK' },
    es: `Un temario estructurado por niveles académicos sirve para inflar el currículum o aprobar un examen formal. Para sobrevivir en la calle lo que sirven son las situaciones reales.\n\nMonté diez plantillas de supervivencia temática: pedir comida, regatear compras, moverse en transporte, hospitales, vida cotidiana, viajes, oficina, tecnología, cultura y medio ambiente. Son 337 palabras estratégicas, la mayoría de combate diario y un puñado de rescate avanzado. La docente clona el set con un clic y lo amolda a su clase.\n\nNadie pide la cuenta en un restaurante chino calculando mentalmente qué gramática de nivel 2 le corresponde usar.`,
    en: `A syllabus organized by academic levels is good for padding a résumé or passing a formal exam. To survive on the street, what works is real situations.\n\nI built ten themed survival templates: ordering food, haggling while shopping, getting around on transport, hospitals, daily life, travel, the office, technology, culture and the environment. That's 337 strategic words, most for daily combat and a handful for advanced rescue. The teacher clones the set with one click and fits it to her class.\n\nNobody asks for the check in a Chinese restaurant mentally calculating which level 2 grammar applies.`,
  },
  {
    date: '2026-10-12', time: '04:05', dim: null, tag: 'avance',
    title: { es: 'El desierto de los bytes', en: 'The desert of bytes' },
    es: `Cuarenta y ocho horas después de insultar a Quizlet tengo en el aire un sistema con once mil términos, votación en vivo sincronizada, rotación inteligente de frases, entorno de pruebas blindado, nombre propio y subdominio montado.\n\nLa pequeña letra chica: ningún estudiante real ha votado todavía, ningún ojo nativo ha certificado que el chino no sea un delirio automático, y mi profesora ni siquiera sabe que esta pantalla existe.\n\nTodo lo que se podía programar en soledad ya está resuelto. Lo único que falta es lo único que da pánico: la realidad.`,
    en: `Forty-eight hours after insulting Quizlet, I have a live system with eleven thousand terms, synchronized live voting, smart sentence rotation, a hardened test environment, its own name and a subdomain up and running.\n\nThe small print: no real student has voted yet, no native eye has certified that the Chinese isn't an automated delirium, and my teacher doesn't even know this screen exists.\n\nEverything that could be programmed alone is done. The only thing missing is the only thing that's scary: reality.`,
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────
async function patch() {
  const doc = await client.fetch(`*[_id == $id][0]{ logEntries }`, { id: DOC })
  if (!doc) throw new Error(`${DOC} no existe`)
  const entries = doc.logEntries ?? []

  const backup = resolve(process.cwd(), `scripts/renshi-logEntries-backup-${Date.now()}.json`)
  writeFileSync(backup, JSON.stringify(entries, null, 2))
  console.log(`Respaldo: ${backup}`)

  const existingKeys = new Set(entries.map(e => e._key))
  for (const key of Object.keys(REWRITE)) {
    if (!existingKeys.has(key)) throw new Error(`Falta ${key} en el documento`)
  }
  if (entries.some(e => e._key.startsWith('entry-1') && Number(e._key.slice(6)) >= 14)) {
    throw new Error('Ya hay entradas nuevas: este patch ya corrió')
  }

  console.log('Subiendo 3 imágenes…')
  const [quizletFrente, quizletReverso, propuestaFangzi] = await Promise.all([
    uploadImage('2.png', 'quizlet-frente',
      'La tarjeta de Quizlet: 认识 al frente y un botón «Mostrar ejemplo» que no muestra ningún ejemplo.',
      'The Quizlet card: 认识 on the front and a "Show example" button that shows no example at all.'),
    uploadImage('1.png', 'quizlet-reverso',
      'El reverso: «conocer (rènshi)», con apretón de manos incluido.',
      'The back: "conocer (rènshi)", handshake included.'),
    uploadImage('3.png', 'propuesta-fangzi',
      'Lo que le propuse a mi profesora: 房子 dentro de una frase (我想租一间房子, «quiero alquilar una casa») para que no se confunda con 家.',
      'What I proposed to my teacher: 房子 inside a sentence (我想租一间房子, "I want to rent a house") so it doesn’t get mixed up with 家.'),
  ])
  const extraImages = { 'entry-1': [quizletFrente, quizletReverso], 'entry-3': [propuestaFangzi] }

  const rewritten = entries.map(e => {
    const r = REWRITE[e._key]
    if (!r) return e
    const images = [...(extraImages[e._key] ?? []), ...(e.images ?? [])]
    return {
      ...e,
      title: { _type: 'localizedString', ...r.title },
      description: { ...e.description, es: r.es, en: r.en },
      ...(images.length ? { images } : {}),
    }
  })

  const slugs = [...new Set(NEW.map(n => n.tag))]
  const tagRefs = Object.fromEntries(await Promise.all(slugs.map(async s => [s, await getTagRef(s)])))

  const added = NEW.map((n, i) => ({
    _type: 'object',
    _key: `entry-${14 + i}`,
    date: n.date,
    time: n.time,
    dimension: n.dim ? dim(n.dim) : CIERRE_DEL_DIA,
    tag: tagRefs[n.tag],
    title: { _type: 'localizedString', ...n.title },
    description: { es: n.es, en: n.en },
  }))

  await client.patch(DOC).set({ logEntries: [...rewritten, ...added] }).commit()
  console.log(`  ✓ ${Object.keys(REWRITE).length} entradas reescritas, ${added.length} nuevas, 3 imágenes`)
}

await patch()
console.log('\n✅ Listo. Visita /es/laboratorio/renshi')
