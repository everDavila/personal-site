/**
 * Patch — Nimbus: bitácora del 09 y 10 de octubre (entry-57 a entry-65)
 * Guiños, poses remotas, push invisible, Compartir, sombra, calor, harto, niebla y cierre.
 * Guarda un respaldo de logEntries antes de escribir. No duplica si ya se corrió.
 *
 * Uso: node scripts/patch-nimbus-2026-10-10-poses-push.mjs
 * Requiere SANITY_TOKEN en .env.local
 */

import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync } from 'fs'
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

const DOC = 'nimbus-experiment'
const dim = (icon) => ({ _type: 'reference', _ref: `dim-${icon}` })

async function getTagRef(slug) {
  const id = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug })
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

async function run() {
  const doc = await client.getDocument(DOC)
  const existing = doc.logEntries.filter(e => /^entry-(5[7-9]|6[0-5])$/.test(e._key)).map(e => e._key)
  if (existing.length) throw new Error(`Ya existen: ${existing.join(', ')}`)

  const backup = resolve(process.cwd(), `scripts/nimbus-logEntries-backup-${Date.now()}.json`)
  writeFileSync(backup, JSON.stringify(doc.logEntries, null, 2))
  console.log(`Respaldo: ${backup}`)

  const [avance, decision, hito, leccion] = await Promise.all(
    ['avance', 'decision', 'hito', 'leccion'].map(getTagRef)
  )

  const entries = [
    {
      _key: 'entry-57',
      date: '2026-10-09',
      time: '11:49',
      dimension: dim('layers'),
      tag: avance,
      title: { es: 'Nimbus ya no es un póster', en: 'Nimbus is no longer a poster' },
      description: {
        es: `Hasta hoy Nimbus era un dibujo muy bien puesto delante del clima. Bonito, pero con la reactividad de un cuadro.\n\nAhora hay guiños. Lo tocas y reacciona. Si hace frío o nieva, tirita en lugar de rebotar, que es lo mínimo que se le puede pedir a alguien en su situación. Y el toque solo cuenta si le das al dibujo, no al cuadro transparente que lo rodea. Antes podías ofender a Nimbus tocando el aire.\n\nPequeñas cosas, pero un personaje que nota cuando lo molestas ya tiene carácter. Lo siguiente es ver cuánto aguanta.`,
        en: `Until today Nimbus was a very nicely placed drawing in front of the weather. Pretty, but about as reactive as a painting.\n\nNow there are winks. You touch it and it reacts. If it's cold or snowing, it shivers instead of bouncing, which is the least you can ask of someone in its position. And the touch only counts if you hit the drawing, not the transparent box around it. Before, you could offend Nimbus by tapping the air.\n\nSmall things, but a character that notices when you bother it already has personality. Next, to see how much it can take.`,
      },
    },
    {
      _key: 'entry-58',
      date: '2026-10-09',
      time: '14:19',
      dimension: dim('cloud'),
      tag: decision,
      title: { es: 'Que Olimpo haga el trabajo sucio', en: 'Let Olimpo do the dirty work' },
      description: {
        es: `Cambiar una pose de Nimbus significaba recompilar la app. Para cambiar un dibujo. Una solución de otra época, de cuando también se pedía permiso para usar el teléfono.\n\nArmé la subida de poses desde Olimpo: subes el archivo, una Cloud Function lo procesa y la app lo recibe sin pasar por Android Studio. El calendario de eventos sigue la misma lógica: editable desde el panel y con rangos de fecha.\n\nTambién quedó escrita una decisión de producto: quién es el protagonista del clima y quién es solo secundario.`,
        en: `Changing a Nimbus pose meant recompiling the app. To change a drawing. A solution from another era, back when you also had to ask permission to use the phone.\n\nI built pose uploads from Olimpo: you upload the file, a Cloud Function processes it and the app receives it without going through Android Studio. The event calendar follows the same logic: editable from the panel and with date ranges.\n\nA product decision also got written down: who is the protagonist of the weather and who is just secondary.`,
      },
    },
    {
      _key: 'entry-59',
      date: '2026-10-10',
      time: '01:16',
      dimension: dim('code-2'),
      tag: leccion,
      title: { es: 'Guardado, dijo el botón', en: 'Saved, said the button' },
      description: {
        es: `El botón Compartir mostraba «guardado». No había guardado nada. Dentro de la app nativa, la descarga con el truco de siempre no hace nada visible, pero el código celebraba igual.\n\nPrimero lo remendé para compartir al menos el texto con el enlace. Después lo arreglé de verdad: la app escribe la imagen en un archivo temporal y abre el selector real de Android, con la miniatura puesta.\n\nUn botón que dice «listo» sin estarlo es peor que uno que falla. Al menos el que falla tiene la decencia de avisar.`,
        en: `The Share button said "saved". It had saved nothing. Inside the native app, the usual download trick does nothing visible, but the code celebrated anyway.\n\nFirst I patched it to at least share the text with the link. Then I fixed it properly: the app writes the image to a temporary file and opens Android's real share sheet, thumbnail included.\n\nA button that says "done" when it isn't is worse than one that fails. At least the one that fails has the decency to tell you.`,
      },
    },
    {
      _key: 'entry-60',
      date: '2026-10-10',
      time: '01:26',
      dimension: dim('book-open'),
      tag: hito,
      title: { es: 'Entregado, dijo FCM. Mentira', en: 'Delivered, said FCM. Lie' },
      description: {
        es: `Probé una campaña manual de push. Firebase respondió «entregado» en todos los intentos. En mi teléfono, un Huawei Pura 70 Pro, no apareció nada. Entregado, entregado y silencio absoluto.\n\nDescarté sospechosos uno por uno. Hasta envié desde la consola de Firebase, sin una sola línea mía de por medio, y tampoco llegaba. El panel era inocente. El problema vivía en el dispositivo.\n\nEran tres cosas. La app nunca volvía a registrar el token al abrir. Android no tenía un canal de notificación propio, así que caía en el de «importancia baja». Y en primer plano, Chrome rechazaba mi manera de mostrar el aviso con un «Illegal constructor».\n\nEl interruptor de Ajustes decía «activado» porque miraba el permiso, no si el token seguía vivo. Mentía con total tranquilidad. Ahora llega con banner y sonido, y en el P9 Lite también.`,
        en: `I tested a manual push campaign. Firebase answered "delivered" on every attempt. On my phone, a Huawei Pura 70 Pro, nothing showed up. Delivered, delivered and absolute silence.\n\nI ruled out suspects one by one. I even sent from the Firebase console, without a single line of mine in between, and it didn't arrive either. The panel was innocent. The problem lived on the device.\n\nIt was three things. The app never re-registered the token on launch. Android had no notification channel of its own, so it fell back to the "low importance" one. And in the foreground, Chrome rejected my way of showing the alert with an "Illegal constructor".\n\nThe Settings switch said "on" because it looked at the permission, not at whether the token was still alive. It lied with total calm. Now it arrives with banner and sound, on the P9 Lite too.`,
      },
    },
    {
      _key: 'entry-61',
      date: '2026-10-10',
      time: '02:08',
      dimension: dim('layers'),
      tag: leccion,
      title: { es: 'Nimbus pegado al fondo', en: 'Nimbus glued to the background' },
      description: {
        es: `Quería que Nimbus se sintiera más afuera del escenario. Parecía pegado con cinta. Le puse una sombra elíptica a los pies y un desenfoque mínimo al fondo, para dar algo de profundidad.\n\nLa sombra con desenfoque casi ni se veía. Probé con colores sólidos para entender por qué, y ahí está el hallazgo: un blur sobre algo pequeño y de poca opacidad lo diluye muy por debajo de lo visible. La versión final usa una elipse con borde redondeado, sin gradiente ni desenfoque.\n\nEsa lección me salvó dos veces más esa misma noche.`,
        en: `I wanted Nimbus to feel more outside the stage. It looked taped on. I gave it an elliptical shadow at its feet and a slight blur on the background, to add some depth.\n\nThe blurred shadow was barely visible. I tested with solid colors to understand why, and there's the finding: a blur on something small and low in opacity dilutes it far below visible. The final version uses an ellipse with rounded borders, no gradient or blur.\n\nThat lesson saved me twice more that same night.`,
      },
    },
    {
      _key: 'entry-62',
      date: '2026-10-10',
      time: '03:02',
      dimension: dim('layers'),
      tag: avance,
      title: { es: 'Ondas de calor, versión 1', en: 'Heat waves, version 1' },
      description: {
        es: `Primer clima con animación propia que no sea lluvia, viento o tormenta. Cuando hace calor, suben ondas junto a Nimbus, ancladas a su silueta real y nunca sobre la cara, que ahí no se toca.\n\nTres rondas viéndolo en mi teléfono. Naranja puro sobre cielo naranja desaparecía, así que le puse un núcleo blanco que se apaga hacia el borde. Los bordes no seguían bien el dibujo, y ahora leen la silueta en vez de usar porcentajes. Y eran pocas: de 4 a 7, más una que sale del pecho.\n\nCalor que se ve. Ya era hora.`,
        en: `First weather with its own animation that isn't rain, wind or storm. When it's hot, waves rise next to Nimbus, anchored to its real silhouette and never over the face, which is off limits.\n\nThree rounds watching it on my phone. Pure orange on an orange sky vanished, so I gave it a white core that fades to orange at the edge. The edges didn't follow the drawing well, so now they read the silhouette instead of using percentages. And there were too few: from 4 to 7, plus one coming out of the chest.\n\nHeat you can see. About time.`,
      },
    },
    {
      _key: 'entry-63',
      date: '2026-10-10',
      time: '09:54',
      dimension: dim('pen-line'),
      tag: decision,
      title: { es: 'Nimbus se harta', en: 'Nimbus gets fed up' },
      description: {
        es: `Del segundo al quinto toque seguido, Nimbus saca un globito de texto que va subiendo de tono: pensativo, molesto, advertencia y amenaza de irse. En el quinto toque pasa algo más, pero eso no lo voy a contar: es un huevo de pascua.\n\nLa decisión fue no dibujar una pose nueva de «harto». Triplicaba el arte de cada pose, y para qué, si el texto hace el trabajo. Toda la molestia cae en las palabras.\n\nMe da gusto que el personaje por fin pueda quejarse. Alguien tenía que hacerlo.`,
        en: `From the second to the fifth tap in a row, Nimbus pops out a speech bubble that raises its tone: pensive, annoyed, warning, and a threat to leave. On the fifth tap something else happens, but I won't tell: it's an Easter egg.\n\nThe decision was not to draw a new "fed up" pose. It tripled the art for every pose, and for what, if the text does the job. All the annoyance falls on the words.\n\nI'm glad the character can finally complain. Somebody had to.`,
      },
    },
    {
      _key: 'entry-64',
      date: '2026-10-10',
      time: '11:23',
      dimension: dim('layers'),
      tag: leccion,
      title: { es: 'La niebla que nadie veía', en: 'The fog nobody could see' },
      description: {
        es: `La niebla existía, pero era invisible: un rectángulo con blur sobre un cielo ya gris. Confirmé el crimen inyectándola a mano en una escena real.\n\nMisma lección de la sombra. La reemplacé por cuatro bancos sueltos en forma de elipse, sin desenfoque, arrastrándose a ritmos distintos. Ahora sí hay niebla.\n\nCon esto, todos los climas tienen su animación.`,
        en: `The fog existed, but it was invisible: a rectangle with blur over an already gray sky. I confirmed the crime by injecting it by hand into a real scene.\n\nSame lesson as the shadow. I replaced it with four loose elliptical banks, no blur, dragging along at different paces. Now there is fog.\n\nWith this, every weather has its animation.`,
      },
    },
    {
      _key: 'entry-65',
      date: '2026-10-10',
      time: '12:12',
      dimension: dim('target'),
      tag: avance,
      title: { es: 'Lo que quedó chico pero importa', en: 'Small but it matters' },
      description: {
        es: `Una pose ahora puede servir para varios climas, y existe una franja día/noche. Por fin una lluvia de noche no es igual a una de día. Y todo sin migrar los datos viejos.\n\nTambién hay un botón que lleva directo a Ajustes cuando el permiso de notificaciones se rechazó de verdad, porque pedirlo otra vez es imposible. Y 10 frases nuevas de intensidad 5, porque seis climas tenían ese nivel vacío.\n\nY el primer paso a iOS. Desde Windows no se puede seguir: eso espera una Mac.`,
        en: `A pose can now serve several weathers, and there's a day/night band. At last a night rain isn't the same as a day one. And all of it without migrating the old data.\n\nThere's also a button that takes you straight to Settings when the notification permission was truly denied, because asking again is impossible. And 10 new intensity-5 phrases, because six weathers had that level empty.\n\nAnd the first step toward iOS. From Windows it can't go further: that waits for a Mac.`,
      },
    },
  ]

  await client.patch(DOC).append('logEntries', entries).commit()
  console.log(`\n✅ Listo: ${entries.length} entradas (entry-57 a entry-65).`)
}

await run()
