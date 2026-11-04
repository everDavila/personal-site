/**
 * Patch — Rènshi: bitácora del 13 al 20 de octubre (entry-31 a entry-43)
 * Frases temáticas, inicio docente, tres agentes, foco, tinta, gramática, Lab,
 * reverso docente, votos, frase maestra y el tropiezo de los worktrees.
 * Sube 5 capturas (sin datos personales). Guarda respaldo de logEntries antes de escribir.
 *
 * Uso: node scripts/patch-renshi-2026-10-20-agentes-lab.mjs
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
const IMG_DIR = 'D:/reposGIT/chinese-lesson/bitacora-capturas'
const dim = (icon) => ({ _type: 'reference', _ref: `dim-${icon}` })

async function getTagRef(slug) {
  const id = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug })
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

async function uploadImage(file, key, captionEs, captionEn) {
  const asset = await client.assets.upload('image', createReadStream(`${IMG_DIR}/${file}`), {
    filename: `renshi-${key}${file.slice(file.lastIndexOf('.'))}`,
  })
  return {
    _type: 'image',
    _key: key,
    asset: { _type: 'reference', _ref: asset._id },
    caption: { es: captionEs, en: captionEn },
  }
}

async function run() {
  const doc = await client.getDocument(DOC)
  const existing = doc.logEntries.filter(e => /^entry-(3[1-9]|4[0-3])$/.test(e._key)).map(e => e._key)
  if (existing.length) throw new Error(`Ya existen: ${existing.join(', ')}`)

  const backup = resolve(process.cwd(), `scripts/renshi-logEntries-backup-${Date.now()}.json`)
  writeFileSync(backup, JSON.stringify(doc.logEntries, null, 2))
  console.log(`Respaldo: ${backup}`)

  const [avance, decision, leccion, exploracion, fallo] = await Promise.all(
    ['avance', 'decision', 'leccion', 'exploracion', 'fallo'].map(getTagRef)
  )

  console.log('Subiendo 5 capturas…')
  const [imgInicio, imgGramatica, imgTarjeta, imgVotos, imgEditor] = await Promise.all([
    uploadImage('2026-10-16/01-inicio-docente-escritorio.png', 'inicio-docente',
      'La primera versión del inicio docente: prolija, pero demasiado.',
      'The first version of the teacher home: tidy, but too much.'),
    uploadImage('2026-10-19/01-gramatica-respuesta-modelo.jpg', 'gramatica-modelo',
      'El piloto de gramática: la franja de laboratorio y una frase correcta en verde.',
      'The grammar pilot: the lab banner and a correct sentence in green.'),
    uploadImage('2026-10-20/06-tarjeta-con-frase-maestra.png', 'tarjeta-frase-maestra',
      'El reverso rediseñado: 我想家 como frase maestra.',
      'The redesigned card back: 我想家 as the master sentence.'),
    uploadImage('2026-10-20/03-comprension-del-grupo-con-votos.png', 'comprension-votos',
      'La profesora ve el voto del alumno en vivo.',
      'The teacher sees the student’s vote live.'),
    uploadImage('2026-10-20/05-editor-admin-despues-estrella-y-flechas.png', 'editor-admin',
      'El editor del admin: estrella de frase maestra y flechas de orden.',
      'The admin editor: master-sentence star and order arrows.'),
  ])

  const entries = [
    {
      _key: 'entry-31', date: '2026-10-13', time: '16:04',
      dimension: dim('pen-line'), tag: avance,
      title: { es: 'Una frase por palabra, y dos herramientas que mentían', en: 'One sentence per word, and two tools that lied' },
      description: {
        es: `HSK 4, 5 y 6 casi no tenían frases de ejemplo. Y mi regla es conocida: sin frase, no hay tarjeta. Pedí tres por palabra, luego dos, luego una. Primero cobertura, la perfección puede esperar.\n\nSe escribieron 85 frases y la base pasó de 2654 a 2739. Todas quedan marcadas como «sin revisar»: ninguna IA aprueba su propio trabajo.\n\nDe paso descubrí que dos herramientas mentían. El validador solo conocía los niveles 1 a 3. Y las consultas se cortaban en mil filas, así que HSK 5 parecía no tener 数据 y HSK 6 no tener 生态. Las palabras estaban ahí; el script juraba que no.\n\nAntes de culpar a los datos, conviene interrogar a quien los cuenta.`,
        en: `HSK 4, 5 and 6 barely had example sentences. And my rule is well known: no sentence, no card. I asked for three per word, then two, then one. Coverage first, perfection can wait.\n\n85 sentences were written and the database went from 2654 to 2739. All of them are marked "unreviewed": no AI approves its own work.\n\nAlong the way I found out two tools were lying. The validator only knew levels 1 to 3. And the queries got cut off at a thousand rows, so HSK 5 seemed to lack 数据 and HSK 6 seemed to lack 生态. The words were there; the script swore they weren't.\n\nBefore blaming the data, it's worth interrogating whoever is counting it.`,
      },
    },
    {
      _key: 'entry-32', date: '2026-10-17', time: '09:18',
      dimension: dim('layers'), tag: decision, images: [imgInicio],
      title: { es: 'Primero lo llené, luego lo vacié', en: 'First I filled it, then I emptied it' },
      description: {
        es: `La profesora entraba y caía directo en una lista. Armé un espacio de preparación: acciones, lecciones para continuar y biblioteca. Quedó prolijo. Quedó demasiado.\n\nAl día siguiente lo reduje a dos bloques: lo que ella fijó y sus lecciones recientes. Fuera el saludo grande y las tarjetas de crear; siguen en el menú, pero ya no estorban.\n\nY una regla: una colección fijada solo se abre. La unidad de una clase es la lección. Presentar cientos de palabras de golpe no es una clase, es un diccionario con luces.\n\nTampoco inventé «editada hoy» ni «próxima clase», porque esos datos no existen. Una pantalla no debería prometer lo que la base de datos no sabe.`,
        en: `The teacher would log in and land straight on a list. I built a preparation space: actions, lessons to continue and a library. It came out tidy. It came out too much.\n\nThe next day I cut it down to two blocks: what she pinned and her recent lessons. Out went the big greeting and the create cards; they're still in the menu, but they no longer get in the way.\n\nAnd one rule: a pinned collection only opens. The unit of a class is the lesson. Presenting hundreds of words at once isn't a class, it's a dictionary with lights.\n\nI also didn't make up "edited today" or "next class", because that data doesn't exist. A screen shouldn't promise what the database doesn't know.`,
      },
    },
    {
      _key: 'entry-33', date: '2026-10-17', time: '17:31',
      dimension: dim('target'), tag: decision,
      title: { es: 'Nadie aprende más de 100 hanzi en una clase', en: 'Nobody learns more than 100 hanzi in one class' },
      description: {
        es: `Para presentar una selección grande, la app pedía confirmación desde las 500 palabras. Pregunté por qué 500. No había razón; era un número que sonaba bien. Quedó en 100: nadie aprende más de 100 hanzi en una sola clase.\n\nCon «Quitar» pasaba algo parecido: obligaba a elegir entre perder el historial o llenarse de basura. Ahora pregunta: archivar o borrar. Lo archivado vuelve con sus clases y votos.\n\nY en el editor, agregar palabras de una en una era lento. Ahora se marcan varias, aunque vengan de búsquedas distintas, y entran de golpe.\n\nPreguntarle «¿por qué?» a mis propios números sigue siendo el mejor test.`,
        en: `To present a big selection, the app asked for confirmation from 500 words. I asked why 500. There was no reason; it was a number that sounded good. It's now 100: nobody learns more than 100 hanzi in a single class.\n\n"Remove" was similar: it forced a choice between losing the history and filling up with junk. Now it asks: archive or delete. Whatever is archived comes back with its classes and votes.\n\nAnd in the editor, adding words one by one was slow. Now you tick several, even from different searches, and they go in at once.\n\nAsking "why?" about my own numbers is still the best test.`,
      },
    },
    {
      _key: 'entry-34', date: '2026-10-17', time: '18:42',
      dimension: dim('book-open'), tag: leccion,
      title: { es: 'Tres agentes, diez ramas', en: 'Three agents, ten branches' },
      description: {
        es: `Entre el 17 y el 18 trabajaron en paralelo Claude Code, Codex y Cline, cada uno en su rincón. Antes de subir nada pedí ver todas las ramas. Eran diez. Entraron cinco; una se descartó porque chocaba con otra en el mismo componente.\n\nCodex reportó que había corregido 36 frases de español peninsular en producción. Lo comprobé en solo lectura: cero de 2739 frases con «vosotros», «coche» u «ordenador». Fiarse está bien. Verificar, mejor.\n\nTambién pregunté cuántas veces Codex había roto el código. Ninguna caída es suya hasta donde se puede saber, porque git no registra qué agente hizo cada commit. Lo que sí deja son cabos sueltos: pruebas sin actualizar y estados reportados antes de tiempo.`,
        en: `Between the 17th and the 18th, Claude Code, Codex and Cline worked in parallel, each in its own corner. Before pushing anything I asked to see all the branches. There were ten. Five got in; one was dropped because it collided with another in the same component.\n\nCodex reported it had fixed 36 Peninsular Spanish sentences in production. I checked in read-only: zero out of 2739 sentences with "vosotros", "coche" or "ordenador". Trusting is fine. Verifying is better.\n\nI also asked how many times Codex had broken the code. No outage is its fault as far as anyone can tell, because git doesn't record which agent made each commit. What it does leave behind are loose ends: tests not updated and statuses reported ahead of time.`,
      },
    },
    {
      _key: 'entry-35', date: '2026-10-18', time: '16:30',
      dimension: dim('target'), tag: decision,
      title: { es: 'Reemplazar el Quizlet y el PowerPoint', en: 'Replacing Quizlet and the PowerPoint' },
      description: {
        es: `Comparé Renshi con Gushi, Chinesimple, HSKLord, Hack Chinese y HanyuGuide. Todas sirven para estudiar solo o para asignar tareas. Ninguna junta presentar, frases, trazo y votación en vivo.\n\nAhí quedó claro el lugar de Renshi. No compite con las apps de estudio individual. Reemplaza lo que la profesora arma hoy con Quizlet y un PowerPoint para la clase en vivo.\n\nLo fijé como foco: cada mejora se mide por cuánto mejora esa clase. Una regla sencilla para saber cuándo decir que no.`,
        en: `I compared Renshi with Gushi, Chinesimple, HSKLord, Hack Chinese and HanyuGuide. They all work for studying alone or for assigning homework. None of them puts together presenting, sentences, strokes and live voting.\n\nThat made Renshi's place clear. It doesn't compete with solo-study apps. It replaces what the teacher builds today with Quizlet and a PowerPoint for the live class.\n\nI set it as the focus: every improvement is measured by how much it improves that class. A simple rule for knowing when to say no.`,
      },
    },
    {
      _key: 'entry-36', date: '2026-10-18', time: '17:30',
      dimension: dim('layers'), tag: avance,
      title: { es: '东西 tiene nota y no veo nada', en: '东西 has a note and I see nothing' },
      description: {
        es: `Esa fue mi queja. Resultó que, de 237 fragmentos chinos citados en matices y notas, solo 106 coincidían con una palabra del catálogo. El resto eran frases enteras que la app no sabía partir.\n\nAhora se parten en palabras (一边吃饭一边聊天 se vuelve 一边 · 吃饭 · 一边 · 聊天) y cada pieza abre su ayuda.\n\nLas preguntas más útiles siguen siendo las distraídas.`,
        en: `That was my complaint. It turned out that, out of 237 Chinese fragments quoted in nuances and notes, only 106 matched a word in the catalog. The rest were whole phrases the app didn't know how to split.\n\nNow they're split into words (一边吃饭一边聊天 becomes 一边 · 吃饭 · 一边 · 聊天) and each piece opens its help.\n\nThe most useful questions are still the absent-minded ones.`,
      },
    },
    {
      _key: 'entry-37', date: '2026-10-18', time: '20:08',
      dimension: dim('layers'), tag: avance,
      title: { es: 'La tinta que parecía lija', en: 'The ink that looked like sandpaper' },
      description: {
        es: `El anverso de la tarjeta ahora puede mostrar el trazo liso o con tinta china: borde de pincel, tinta corrida, carga desigual, papel de arroz y una punta roja que recorre el trazo. Se activa con el botón «Tinta» o la tecla I.\n\nLa primera versión parecía lija. La segunda, por fin, tinta. Probé con la CPU frenada cuatro veces y aguanta.`,
        en: `The front of the card can now show the stroke smooth or in Chinese ink: brush edge, bleeding ink, uneven load, rice paper and a red tip that runs along the stroke. It turns on with the "Ink" button or the I key.\n\nThe first version looked like sandpaper. The second, at last, like ink. I tested with the CPU throttled four times and it holds.`,
      },
    },
    {
      _key: 'entry-38', date: '2026-10-19', time: '00:03',
      dimension: dim('target'), tag: exploracion, images: [imgGramatica],
      title: { es: 'Armar la frase, no recitar la regla', en: 'Build the sentence, don’t recite the rule' },
      description: {
        es: `Gushi publica además un plan de gramática con 428 puntos. Mi pregunta: ¿tarjetas de solo gramática? Mi respuesta: no. «Regla delante, definición detrás» es el error de Quizlet con otro disfraz. El frente siempre debe ser una frase.\n\nArmé un piloto en /lab/gramatica: 12 puntos de HSK 1 y 24 consignas. Escribes tu frase en chino y la revisa en tres colores. Verde si coincide con una modelo, rojo si cae en un error típico, amarillo si usa las piezas en orden pero no es una modelo. El amarillo dice «puede estar bien», nunca «está mal».\n\nPorque comparar cadenas no es corregir chino, y prefiero que la app dude a que mienta. Las consignas son borrador de IA, sin revisión humana.`,
        en: `Gushi also publishes a grammar plan with 428 points. My question: grammar-only cards? My answer: no. "Rule on the front, definition on the back" is Quizlet's mistake in another disguise. The front must always be a sentence.\n\nI built a pilot at /lab/gramatica: 12 HSK 1 points and 24 prompts. You type your sentence in Chinese and it checks it in three colors. Green if it matches a model, red if it falls into a typical mistake, yellow if it uses the pieces in order but isn't a model. Yellow says "might be fine", never "wrong".\n\nBecause comparing strings is not correcting Chinese, and I'd rather the app doubt than lie. The prompts are an AI draft, with no human review.`,
      },
    },
    {
      _key: 'entry-39', date: '2026-10-19', time: '01:34',
      dimension: dim('target'), tag: decision,
      title: { es: 'El laboratorio, a la vista', en: 'The lab, in plain sight' },
      description: {
        es: `Pedí que lo que probamos se vea y sirva para pedir ideas. Nació /lab: experimentos en prueba (Escritura, Gramática) y ya implementados (Tinta china, El alumno vota). Cada página lleva su franja: amarilla «Piloto en prueba», verde «Ya forma parte de Renshi».\n\nLa franja nació de algo práctico: si grabo la pantalla, el video tiene que dejar claro que es un experimento. Lo implementado se queda para contar cómo llegó; la votación tiene su propia línea de tiempo, de campo de texto a aviso de conexión.\n\nTerminar algo es opcional. Dejar claro que no está terminado, no.`,
        en: `I asked for what we test to be visible and useful for asking for ideas. /lab was born: experiments in testing (Writing, Grammar) and already implemented ones (Chinese ink, Students vote). Each page carries its banner: yellow "Pilot in testing", green "Already part of Renshi".\n\nThe banner came from something practical: if I record the screen, the video has to make it clear it's an experiment. What's implemented stays to tell how it got there; voting has its own timeline, from a text field to a connection notice.\n\nFinishing something is optional. Making it clear it isn't finished, is not.`,
      },
    },
    {
      _key: 'entry-40', date: '2026-10-20', time: '00:07',
      dimension: dim('layers'), tag: leccion, images: [imgTarjeta],
      title: { es: 'El panel que medía cero píxeles', en: 'The panel that was zero pixels tall' },
      description: {
        es: `Rediseñé el reverso de la tarjeta de la profesora: palabra y «Cómo se forma» fijas arriba, solo se desplazan las frases, y Matiz, Otros usos y Nota cultural pasan a un panel a la derecha. La barra de controles se esconde a los tres segundos sin ratón.\n\nEn el celular, el panel de detalles medía cero píxeles. Existía, estaba ahí, y no se veía. Un grid con altura completa y filas automáticas aplastaba las secciones. Se arregló con una sola clase.\n\nA veces el bug no está roto. Está comprimido.`,
        en: `I redesigned the back of the teacher's card: word and "How it's formed" fixed at the top, only the sentences scroll, and Nuance, Other uses and Cultural note move to a panel on the right. The control bar hides after three seconds without a mouse.\n\nOn the phone, the details panel was zero pixels tall. It existed, it was there, and you couldn't see it. A full-height grid with automatic rows was squashing the sections. One class fixed it.\n\nSometimes the bug isn't broken. It's compressed.`,
      },
    },
    {
      _key: 'entry-41', date: '2026-10-20', time: '00:23',
      dimension: dim('target'), tag: decision, images: [imgVotos],
      title: { es: 'El grupo se califica solo', en: 'The group rates itself' },
      description: {
        es: `Salen los cuatro botones de la profesora, las teclas 1 a 4 y el veredicto combinado. La tarjeta muestra solo la barra y el conteo de los votos de los alumnos.\n\nLa profesora ya no califica al grupo: lo hace el grupo. Es más honesto y le quita trabajo en plena clase. Dejé anotada una idea: recomendar qué palabras reforzar según los votos.`,
        en: `The teacher's four buttons, the 1 to 4 keys and the combined verdict are gone. The card shows only the bar and the count of the students' votes.\n\nThe teacher no longer rates the group: the group does. It's more honest and takes work off her in the middle of class. I noted an idea: recommend which words to reinforce based on the votes.`,
      },
    },
    {
      _key: 'entry-42', date: '2026-10-20', time: '01:14',
      dimension: dim('target'), tag: decision, images: [imgEditor],
      title: { es: 'La frase maestra pasa a ser una decisión', en: 'The master sentence becomes a decision' },
      description: {
        es: `Había definido la frase maestra como «la primera frase». Con la rotación entre clases, eso marcaba cualquiera. En 家 salía 大家好, donde 家 ni siquiera significa «casa». Se quitó ese mismo día.\n\nVolvió como una estrella en el admin: una por sentido, la frase que sale siempre y primero. La copia de una profesora la hereda. De paso rediseñé el editor, porque yo mismo no encontraba Matiz ni Otros usos: existían, pero con otros nombres y en cajas dentro de cajas.\n\nRegla nueva: cada ejemplo usa la palabra en el sentido al que pertenece, y todo sentido tiene frase maestra.`,
        en: `I had defined the master sentence as "the first sentence". With rotation between classes, that flagged just any sentence. In 家 it came out as 大家好, where 家 doesn't even mean "home". It was removed the same day.\n\nIt came back as a star in the admin: one per sense, the sentence that always comes out, and first. A teacher's copy inherits it. While at it I redesigned the editor, because even I couldn't find Nuance or Other uses: they existed, but under other names and in boxes inside boxes.\n\nNew rule: every example uses the word in the sense it belongs to, and every sense has a master sentence.`,
      },
    },
    {
      _key: 'entry-43', date: '2026-10-20', time: '11:30',
      dimension: dim('book-open'), tag: fallo,
      title: { es: '«Descartar» no es borrar', en: '"Discard" is not "delete"' },
      description: {
        es: `Quería dejar fuera de la conversación dos worktrees de Codex. Al descartarlos se borraron archivos sin respaldo: el tar falló y el borrado corrió igual. Decidí no recuperarlos.\n\nQuedó escrito en la memoria de los agentes: «descartar» no es borrar. Una palabra que significa «dejar de mirar» no debería funcionar como comando.`,
        en: `I wanted to leave two of Codex's worktrees out of the conversation. When they were discarded, files got deleted with no backup: the tar failed and the deletion ran anyway. I decided not to recover them.\n\nIt's now written in the agents' memory: "discard" is not "delete". A word that means "stop looking" shouldn't work as a command.`,
      },
    },
  ]

  await client.patch(DOC).append('logEntries', entries).commit()
  console.log(`\n✅ Listo: ${entries.length} entradas (entry-31 a entry-43).`)
}

await run()
