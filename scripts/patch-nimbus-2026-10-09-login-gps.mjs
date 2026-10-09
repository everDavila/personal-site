/**
 * Patch script — Nimbus 09/10:
 *   - capturas de prueba en las entradas 52, 53 y 54 (ya publicadas)
 *   - 2 entradas nuevas: GPS apagado (55) y login con Google en Android (56)
 * Textos en español de Ever; versión en inglés adaptada. 08 y 10 con el correo difuminado.
 *
 * Uso:
 *   node scripts/patch-nimbus-2026-10-09-login-gps.mjs
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

const DOC = 'nimbus-experiment'
const IMG_DIR = 'C:/Users/ever/Documents/bitacora-borrador/nimbus-2026-10-09'
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
  const existing = await client.fetch(`*[_id == $id][0].logEntries[_key in ["entry-55", "entry-56"]]._key`, { id: DOC })
  if (existing?.length) throw new Error(`Ya existen: ${existing.join(', ')}`)

  const [completado, hito] = await Promise.all([getTagRef('completado'), getTagRef('hito')])

  console.log('Subiendo 11 imágenes…')
  const up = (f, es, en) => uploadImage(`${f}.png`, es, en)
  const [i01, i02, i03, i04, i05, i06, i07, i08, i09, i10, i11] = await Promise.all([
    up('01-home-lima-tras-fix-pantalla-blanca',
      'Nimbus viva en Android después del arreglo: Lima de noche.',
      'Nimbus alive on Android after the fix: Lima at night.'),
    up('02-dialogo-permiso-gps-nativo',
      'Android ya pide la ubicación, y ya la llama Nimbus.',
      'Android now asks for location, and calls it Nimbus.'),
    up('03-dialogo-permiso-notificaciones-nativo',
      'El permiso de notificaciones, nativo.',
      'The notification permission, native.'),
    up('04-tarjeta-invitacion-en-ingles',
      'La tarjeta de invitación: «Paso por ahora» no quema el permiso.',
      'The invitation card: "Not now" doesn’t burn the permission.'),
    up('05-maestro-notificaciones-encendido-real',
      'El interruptor maestro, encendido con permiso real detrás.',
      'The main switch, on with a real permission behind it.'),
    up('06-alertas-atenuadas-sin-permiso',
      'Sin permiso: el maestro apagado y las alertas atenuadas.',
      'No permission: main switch off, alerts dimmed.'),
    up('07-sin-sesion-boton-google',
      'Sin sesión: el botón de Google.',
      'Signed out: the Google button.'),
    up('08-selector-cuentas-google-nativo',
      'El selector de cuentas nativo de Android (correo difuminado).',
      'Android’s native account picker (email blurred).'),
    up('09-login-sin-sincronizar-bug-encontrado',
      'Elegí mi cuenta y Nimbus seguía diciendo que no.',
      'Picked my account; Nimbus still said no.'),
    up('10-login-google-nativo-FUNCIONANDO',
      'Ahora sí: sesión iniciada y aparece Olympus (correo difuminado).',
      'Now it works: signed in, and Olympus shows up (email blurred).'),
    up('11-logout-arreglado-sin-olympus',
      'Cerrar sesión ya cierra todo: Olympus desaparece de la barra.',
      'Signing out now closes everything: Olympus disappears from the bar.'),
  ])

  const entries = [
    {
      _key: 'entry-55',
      date: '2026-10-08',
      time: '22:48',
      dimension: dim('cloud'),
      tag: completado,
      description: {
        es: 'El 21 de septiembre apagué el GPS a propósito para poner a prueba el orgullo de Nimbus. Si le pedías la ubicación a mano, soltaba un error genérico debajo del clima de una ciudad donde ya ni siquiera estabas. Lo anoté como pendiente y ahí durmió, acumulando polvo con la paciencia de un trámite municipal.\n\nDiecisiete días después, deuda saldada. Cuando le pides la ubicación y el teléfono no puede dártela, Nimbus deja de fingir: limpia el clima fantasma y te recibe con la pantalla de bienvenida, diseñada exactamente para no mentir.\n\nBueno, saldada a medias, para ser honestos. En segundo plano sigue aferrado a la última ubicación conocida sin decir ni pío. Pero eso ya no es un bug: es una decisión de diseño. Si no sabe dónde estás, que tenga la decencia de admitirlo; para inventar realidades ya nos sobran los políticos.',
        en: 'On September 21st I turned off my GPS on purpose to test Nimbus’s pride. If you asked for your location by hand, it dropped a generic error under the weather of a city you weren’t even in anymore. I logged it as pending and there it slept, gathering dust with the patience of a city-hall line.\n\nSeventeen days later, debt settled. When you ask for your location and the phone can’t give it, Nimbus stops pretending: it clears the ghost weather and greets you with the welcome screen, designed precisely not to lie.\n\nWell, half settled, to be honest. In the background it still clings to the last known location without a peep. But that’s no longer a bug: it’s a design decision. If it doesn’t know where you are, it should have the decency to admit it; for making up realities, we already have more than enough politicians.',
      },
    },
    {
      _key: 'entry-56',
      date: '2026-10-09',
      time: '00:32',
      dimension: dim('code-2'),
      tag: hito,
      images: [i07, i08, i09, i10, i11],
      description: {
        es: 'En la web, iniciar sesión con Google toma dos toques y cero dramas. En Android fue todo un drama coreano 🫶.\n\nEl botón abría Chrome por su cuenta, pedía la cuenta y te dejaba varado afuera: pasaje de solo ida, sin boleto de regreso a la app. Lo cambiamos por el inicio de sesión nativo del sistema y llegó la segunda sorpresa: elegías tu cuenta, el selector se despedía con reverencia impecable y Nimbus seguía jurando con cara de palo: «You\'re not signed in».\n\nIniciar, iniciaba. El detalle es que en el teléfono convivían dos sesiones en mundos paralelos: la de Android y la de la app. El plugin solo le avisaba a la primera, mientras la pantalla que manda seguía esperando noticias que nunca iban a llegar. Tuvimos que presentarlas a mano para que por fin se hablaran.\n\nPero el despecho volvió por la puerta falsa: tocabas «Sign out» y no pasaba absolutamente nada. Cerraba una puerta y dejaba la otra abierta de par en par. Dos entidades que comparten el mismo techo pero no se comunican nunca terminan bien. Ni en el software, ni en las parejas.',
        en: 'On the web, signing in with Google takes two taps and zero drama. On Android it was a full-blown K-drama 🫶.\n\nThe button opened Chrome on its own, asked for your account and left you stranded outside: a one-way ticket, no return to the app. We swapped it for the system’s native sign-in and the second surprise arrived: you picked your account, the picker bowed out with flawless manners, and Nimbus kept swearing with a straight face: "You’re not signed in".\n\nOh, it signed in. The catch is that two sessions were living in parallel worlds on the phone: Android’s and the app’s. The plugin only told the first one, while the screen in charge kept waiting for news that was never coming. We had to introduce them by hand so they’d finally talk.\n\nBut the heartbreak came back through the side door: you tapped "Sign out" and absolutely nothing happened. It closed one door and left the other wide open. Two entities sharing the same roof without ever talking never end well. Not in software, not in couples.',
      },
    },
  ]

  console.log('Agregando capturas a 52, 53 y 54 y las entradas 55 y 56…')
  // append() sobre logEntries[_key==...].images no aplica nada y tampoco falla:
  // se reescribe el arreglo completo de cada entrada con set()
  const doc = await client.getDocument(DOC)
  const imagesOf = (key) => doc.logEntries.find(e => e._key === key)?.images ?? []
  const at = (key) => `logEntries[_key=="${key}"].images`
  await client
    .patch(DOC)
    .set({
      [at('entry-52')]: [...imagesOf('entry-52'), i01],
      [at('entry-53')]: [...imagesOf('entry-53'), i02, i03],
      [at('entry-54')]: [...imagesOf('entry-54'), i04, i05, i06],
    })
    .append('logEntries', entries)
    .commit()
  console.log('\n✅ Listo.')
}

await run()
