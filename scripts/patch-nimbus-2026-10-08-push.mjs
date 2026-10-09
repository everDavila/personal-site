/**
 * Patch script — 8 entradas de Nimbus sobre notificaciones push (07/10 y 08/10)
 * Textos en español de Ever; versión en inglés adaptada.
 *
 * Uso:
 *   node scripts/patch-nimbus-2026-10-08-push.mjs
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

const IMG_DIR = 'C:/Users/ever/Documents/bitacora-borrador/nimbus-2026-10-08'
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
  // No duplicar si ya se corrió
  const existing = await client.fetch(`*[_id == "nimbus-experiment"][0].logEntries[_key in $keys]._key`, {
    keys: ['entry-47', 'entry-48', 'entry-49', 'entry-50', 'entry-51', 'entry-52', 'entry-53', 'entry-54'],
  })
  if (existing?.length) throw new Error(`Ya existen: ${existing.join(', ')}`)

  const [hito, leccion, insight, avance, decision, fallo] = await Promise.all([
    getTagRef('hito'), getTagRef('leccion'), getTagRef('insight'),
    getTagRef('avance'), getTagRef('decision'), getTagRef('fallo'),
  ])

  console.log('Subiendo imagen…')
  const imgPush = await uploadImage(
    'push-android-primera-automatica.png',
    'Abajo, la primera notificación automática de Nimbus en Android: un cambio brusco de temperatura, real y detectado por su cuenta. Arriba, una de prueba enviada a mano desde Firebase.',
    'Bottom: Nimbus’s first automatic notification on Android, a real sudden temperature change it caught on its own. Top: a test sent by hand from Firebase.'
  )

  const entries = [
    {
      _key: 'entry-47',
      date: '2026-10-07',
      time: '17:55',
      dimension: dim('zap'),
      tag: hito,
      description: {
        es: 'Nimbus ya puede hablarte sin que nadie le dé permiso de palabra.\n\nProbé la cadena completa: permiso, registro del teléfono, Firebase y la notificación en la pantalla de bloqueo. Llegó. Parece un trámite menor, pero es la primera vez que Nimbus abre la boca por cuenta propia.\n\nDos decisiones de supervivencia. Firebase en vez de inventar la rueda con un backend casero: Android solo respeta ese dialecto y no me sobra vida para mantener dos sistemas. Y nada de obligar a iniciar sesión con Google: para el usuario común esa cuenta ni existe. Nimbus reconoce el teléfono y se ahorra el interrogatorio.\n\nAhora viene lo verdaderamente difícil: que lo que tenga que decir no sea una soberana pérdida de tiempo.',
        en: 'Nimbus can now talk to you without anyone giving it the floor.\n\nI tested the whole chain: permission, phone registration, Firebase, and the notification on the lock screen. It arrived. Sounds like paperwork, but it’s the first time Nimbus opens its mouth on its own.\n\nTwo survival decisions. Firebase instead of reinventing the wheel with a homemade backend: Android only respects that dialect, and I don’t have enough life left to maintain two systems. And no forced Google sign-in: for the average user, that account doesn’t even exist. Nimbus recognizes the phone and skips the interrogation.\n\nNow comes the genuinely hard part: making sure what it has to say isn’t a monumental waste of time.',
      },
    },
    {
      _key: 'entry-48',
      date: '2026-10-08',
      time: '00:39',
      dimension: dim('cloud'),
      tag: leccion,
      description: {
        es: 'La llave de las notificaciones vivía en un archivo que no se subía a ningún lado. Por seguridad, impecable; por memoria, un desastre.\n\nEstaba metida en la carpeta de pruebas. Borré la carpeta y la clave se fue con ella. Mandé dos deploys con absoluta tranquilidad: el build pasaba, la consola sonreía y en producción nada se movía. Me di cuenta recién cuando un teléfono de verdad se quedó mudo.\n\nLo que no viaja con el repositorio, no sobrevive a la mudanza.',
        en: 'The key to the notifications lived in a file that never got uploaded anywhere. Flawless for security; a disaster for memory.\n\nIt was tucked inside the test folder. I deleted the folder and the key went with it. I shipped two deploys in complete peace: the build passed, the console smiled, and in production nothing moved. I only noticed when a real phone went silent.\n\nWhat doesn’t travel with the repo doesn’t survive the move.',
      },
    },
    {
      _key: 'entry-49',
      date: '2026-10-08',
      time: '01:29',
      dimension: dim('cloud'),
      tag: insight,
      description: {
        es: 'Con Nimbus abierta en primer plano, la notificación llegaba y nadie se dignaba a pintarla. El clásico: faltaba el oyente en guardia mientras la app estaba despierta. Eso se resolvió en diez minutos.\n\nEl misterio vino después: en mi navegador de escritorio reinaba un silencio sepulcral. Me pasé media hora buscando fantasmas en el código, pero el código era inocente. El culpable era Brave: sus escudos asumen que Firebase es un espía y lo ejecutan sin juicio previo.\n\nEn Chrome y en Android, con la app viva o durmiendo, entra sin pestañear. Esta vez el bug no era mío. Hay que celebrarlo.',
        en: 'With Nimbus open in the foreground, the notification arrived and nobody bothered to draw it. A classic: there was no listener on duty while the app was awake. Ten minutes to fix.\n\nThe mystery came after: on my desktop browser, dead silence. I spent half an hour hunting ghosts in the code, but the code was innocent. The culprit was Brave: its shields assume Firebase is a spy and execute it without trial.\n\nOn Chrome and Android, app awake or asleep, it lands without blinking. For once, the bug wasn’t mine. That deserves a celebration.',
      },
    },
    {
      _key: 'entry-50',
      date: '2026-10-08',
      time: '01:34',
      dimension: dim('code-2'),
      tag: avance,
      description: {
        es: 'Las alertas dejaron de depender de que alguien presione un botón como operador de telégrafo.\n\nCada media hora, Nimbus revisa el cielo de quienes pidieron avisos y advierte si asoma lluvia o un cambio brusco de temperatura. No interroga usuario por usuario: agrupa por cuadrículas de unos 11 kilómetros para no quemar cuotas. Respeta las horas de sueño y no te repite el mismo chiste dos veces al día.\n\nAl mediodía saltó la primera grieta: si viajabas, la alerta seguía pendiente del clima de la ciudad que dejaste atrás. Ahora persigue tus coordenadas reales.\n\nAvisarle a Lima que está granizando en Cusco no estaba en el libreto.',
        en: 'Alerts no longer depend on someone pressing a button like a telegraph operator.\n\nEvery half hour, Nimbus checks the sky for everyone who asked for alerts and warns them if rain is coming or the temperature takes a sudden turn. It doesn’t question users one by one: it groups them into grid cells of about 11 kilometers so as not to burn through quotas. It respects sleeping hours and won’t tell you the same joke twice in a day.\n\nBy noon the first crack appeared: if you traveled, the alert kept watching the weather in the city you’d left behind. Now it follows your real coordinates.\n\nTelling Lima it’s hailing in Cusco was not in the script.',
      },
    },
    {
      _key: 'entry-51',
      date: '2026-10-08',
      time: '12:14',
      dimension: dim('pen-line'),
      tag: decision,
      description: {
        es: 'Los textos de las notificaciones estaban directo en el código. Uno por evento, genéricos y ni siquiera escritos por mí. Una tristeza.\n\nAhora viven en Olimpo: los ajusto, los pruebo y salen al aire sin tocar un solo deploy. Nimbus saca uno al azar y tiene la decencia de no repetir el último que te mandó a la pantalla.\n\nEse mismo día armé en mi sitio un monitor de estado de ánimo con frases rotativas. Dos frentes distintos, la misma lección: un chiste contado dos veces deja de tener gracia; tres veces, ya es spam.',
        en: 'The notification texts lived straight in the code. One per event, generic, and not even written by me. Tragic.\n\nNow they live in Olimpo: I tweak them, test them, and they go live without a single deploy. Nimbus picks one at random and has the decency not to repeat the last one it put on your screen.\n\nThat same day I built a mood monitor on my site with rotating phrases. Two different fronts, same lesson: a joke told twice stops being funny; three times, it’s spam.',
      },
    },
    {
      _key: 'entry-52',
      date: '2026-10-08',
      time: '14:44',
      dimension: dim('cloud'),
      tag: fallo,
      description: {
        es: 'Compilé la primera APK de Nimbus y me recibió una pantalla en blanco. Ni un error en rojo, ni un aviso de socorro, nada. Parecía que el motor simplemente se negaba a arrancar.\n\nArrancar, arrancaba. El detalle es que buscaba sus recursos en /nimbus/, la ruta donde vive dentro de mi web; y claro, dentro del sistema de archivos de un teléfono esa carpeta existe solo en mi imaginación. Android ahora tiene su propio empaquetado y su propia raíz.\n\nUna pantalla en blanco no es la ausencia de un fallo. Es un fallo con demasiado orgullo para hablar.',
        en: 'I built Nimbus’s first APK and was greeted by a blank screen. No red error, no distress signal, nothing. It looked like the engine simply refused to start.\n\nOh, it started. The catch is that it was looking for its resources in /nimbus/, the path where it lives on my website; and of course, inside a phone’s file system that folder exists only in my imagination. Android now has its own packaging and its own root.\n\nA blank screen isn’t the absence of a failure. It’s a failure too proud to speak.',
      },
    },
    {
      _key: 'entry-53',
      date: '2026-10-08',
      time: '20:22',
      dimension: dim('flask-conical'),
      tag: avance,
      images: [imgPush],
      description: {
        es: 'Primera vez que Nimbus aterriza en mi teléfono como aplicación de verdad y no como un atajo del navegador con ínfulas de grandeza (Hello PWA).\n\nTres sorpresas de bienvenida. Se instaló bajo el alias de «AppClima» (el nombre genérico del repositorio, cero elegancia). El botón de «Usar mi ubicación» moría en silencio porque nadie le había avisado al manifiesto de Android que íbamos a pedirla. Y las notificaciones de navegador en un entorno nativo no sirven para nada: pedía permisos al vacío y se quedaba esperando. Ahora habla directamente con el gestor del sistema.\n\nYa se llama Nimbus. Ya sabe exactamente dónde estás parado. Esa misma noche me avisó, por su cuenta, que el clima había cambiado de opinión. En inglés, porque así se lo pedí.',
        en: 'First time Nimbus lands on my phone as a real app, not a browser shortcut with delusions of grandeur (hello, PWA).\n\nThree welcome surprises. It installed under the alias "AppClima" (the repo’s generic name, zero elegance). The "Use my location" button died silently because nobody had told the Android manifest we’d be asking for it. And browser notifications are useless in a native environment: it asked for permission into the void and just waited. Now it talks straight to the system’s manager.\n\nIt’s called Nimbus now. It knows exactly where you’re standing. That same night it told me, on its own, that the weather had changed its mind. In English, because that’s how I asked it to.',
      },
    },
    {
      _key: 'entry-54',
      date: '2026-10-08',
      time: '20:22',
      dimension: dim('layers'),
      tag: decision,
      description: {
        es: 'Mirando el panel en mi propio teléfono, el interruptor juraba que las alertas estaban «activadas». No había ningún permiso concedido en Android. El toggle mentía con un descaro digno de político en campaña.\n\nLo reconstruimos desde el suelo. Ahora el switch no confía en su memoria local: interroga al sistema operativo en tiempo real cada vez que lo miras. Y en la pantalla principal pusimos una tarjeta de invitación civilizada: tocar «Paso por ahora» no te quema el permiso del sistema operativo. Te pregunta hasta tres veces espaciadas por catorce días; si insistes en ignorarla, asume el mensaje y se calla para siempre.\n\nUna app puede insistir si tiene motivos. Lo que no tiene perdón es que te mienta en la cara.',
        en: 'Looking at the panel on my own phone, the switch swore alerts were "on". Android hadn’t granted a single permission. The toggle was lying with the nerve of a politician on the campaign trail.\n\nWe rebuilt it from the ground up. Now the switch doesn’t trust its local memory: it asks the operating system in real time every time you look at it. And on the home screen we added a civilized invitation card: tapping "Not now" doesn’t burn the system permission. It asks up to three times, fourteen days apart; if you keep ignoring it, it takes the hint and goes quiet forever.\n\nAn app can insist if it has reasons. What’s unforgivable is lying to your face.',
      },
    },
  ]

  console.log('Appending 8 entradas a Nimbus…')
  await client.patch('nimbus-experiment').append('logEntries', entries).commit()
  console.log('\n✅ Listo.')
}

await run()
