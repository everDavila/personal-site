/**
 * Patch script — Nimbus v2.0 estable: hito, lógica de poses (con imagen), decisiones, siguiente paso PWA
 * 19/09/2026
 *
 * Uso:
 *   node scripts/patch-nimbus-v2-estable-2026-09-19.mjs <ruta-a-imagen-de-poses.png>
 */

import { createClient } from '@sanity/client'
import { readFileSync, createReadStream, existsSync } from 'fs'
import { resolve } from 'path'

const imagePath = process.argv[2]
if (!imagePath || !existsSync(imagePath)) {
  throw new Error('Pasa la ruta de la imagen de la tabla de poses como primer argumento.')
}

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
  const [decision, hito] = await Promise.all([getTagRef('decision'), getTagRef('hito')])

  console.log('Subiendo imagen…')
  const asset = await client.assets.upload('image', createReadStream(imagePath), {
    filename: 'nimbus-tabla-de-poses.png',
  })

  const entries = [
    {
      _key: 'entry-22',
      date: '2026-09-19',
      time: '21:40',
      dimension: dim('layout-grid'),
      tag: decision,
      description: {
        es: 'Las ilustraciones de Nimbus no son al azar.\n\nHay 59 poses y ninguna aparece porque sí. Cada una tiene un disparador, una expresión, una pose y, si hace falta, un vestuario. Soleado: cielo despejado, de día, entre 5 y 32 °C. Nimbus entusiasmado, brazos arriba. Calor fuerte: sensación de 33 °C o más. Tumbado en el suelo, sin chaqueta. Lluvia: fastidiado, resignado, boca abierta.\n\nLa imagen es un fragmento de la tabla donde vive todo eso. Sí, es un Excel. Detrás de cada personaje adorable hay una hoja de cálculo con opiniones firmes. La ternura es una disciplina.\n\nPara decidir cuál se muestra, nimbusPose.ts sigue un orden. Primero manda el clima. Si el clima no tiene nada que decir, entran la crisis térmica, la noche o el insomnio, la alegría por una mejora, el amanecer, el atardecer, el lunes harto y, al final, una rotación de "meh". Las fechas especiales mandan sobre todo lo demás.\n\nY la ilustración no cambia con el tema. Nimbus es Nimbus, se ponga el fondo que se ponga.\n\nEs la misma apuesta de siempre: personalidad sin IA generativa. Las reglas también pueden tener carácter.',
        en: 'Nimbus’s illustrations are not random.\n\nThere are 59 poses and none of them shows up just because. Each one has a trigger, an expression, a pose and, when needed, an outfit. Sunny: clear sky, daytime, between 5 and 32 °C. Nimbus is thrilled, arms up. Strong heat: feels like 33 °C or more. Lying on the floor, no jacket. Rain: annoyed, resigned, mouth open.\n\nThe image is a fragment of the table where all of that lives. Yes, it’s a spreadsheet. Behind every adorable character there’s a spreadsheet with strong opinions. Cuteness is a discipline.\n\nTo decide which one to show, nimbusPose.ts follows an order. The weather comes first. If the weather has nothing to say, then thermal crisis, night or insomnia, joy over an improvement, dawn, dusk, a fed-up Monday and, at the end, a "meh" rotation. Special dates override everything else.\n\nAnd the illustration doesn’t change with the theme. Nimbus is Nimbus, whatever the background.\n\nIt’s the same bet as always: personality without generative AI. Rules can have character too.',
      },
      images: [{
        _key: 'poses-table',
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        caption: {
          es: 'Tabla de poses: cada situación tiene su expresión, su pose y su vestuario',
          en: 'Pose table: every situation has its expression, pose and outfit',
        },
      }],
    },
    {
      _key: 'entry-23',
      date: '2026-09-19',
      time: '22:08',
      dimension: dim('zap'),
      tag: hito,
      description: {
        es: 'Nimbus v2.0 está estable. Cincuenta commits, de las 00:18 a las 22:08, en una sola rama. Un día. No lo recomiendo como método.\n\nMadrugada, desde cero: tres pestañas (Inicio, Pronóstico y Nimbus), el motor que decide cuándo Nimbus dice algo nuevo, el hero por capas y la tarjeta "Nimbus · Ahora". Después, el diario, los favoritos, el pronóstico de hoy con su curva de horas, "Nimbus recomienda" y compartir como imagen.\n\nMañana, la piel: selector Claro, Sistema u Oscuro, con un liquid glass neutro en el oscuro y sin morado. Una carpeta, una rama, y la regla escrita para que no vuelva a haber dos versiones del mismo proyecto.\n\nMediodía y tarde, la base: que refrescar no dé 404, ajustes reestructurados, un clima que se actualiza solo cada 10 minutos, contraste AA y la PWA con su manifiesto, service worker y modo sin red.\n\nNoche, la voz: las 59 poses y unas condiciones que hablan según su rango e intensidad.\n\nParte de esto lo hicieron otras instancias de Claude en la misma rama. Yo puse la dirección. Ellas, los commits.',
        en: 'Nimbus v2.0 is stable. Fifty commits, from 00:18 to 22:08, on a single branch. One day. I don’t recommend it as a method.\n\nEarly morning, from scratch: three tabs (Home, Forecast and Nimbus), the engine that decides when Nimbus has something new to say, the layered hero and the "Nimbus · Now" card. After that, the journal, favorites, today’s forecast with its hourly curve, "Nimbus recommends" and sharing as an image.\n\nMorning, the skin: a Light, System or Dark selector, with a neutral liquid glass in dark mode and no purple. One folder, one branch, and the rule written down so there are never two versions of the same project again.\n\nMidday and afternoon, the foundations: refreshing no longer gives a 404, restructured settings, weather that updates itself every 10 minutes, AA contrast and the PWA with its manifest, service worker and offline mode.\n\nNight, the voice: the 59 poses and conditions that speak according to their range and intensity.\n\nPart of this was done by other Claude instances on the same branch. I set the direction. They made the commits.',
      },
    },
    {
      _key: 'entry-24',
      date: '2026-09-19',
      time: '22:30',
      dimension: dim('target'),
      tag: decision,
      description: {
        es: 'Decisiones que quedan de hoy, para no discutirlas conmigo mismo dentro de un mes.\n\nLight por defecto. El morado #7C3AED es solo marca, no un tema. Local primero, nube después. La ilustración es independiente del tema. La hora manda sobre el cielo, y el clima sobre las poses de ánimo. La celebración es solo para fechas festivas (los equinoccios no cuentan, lo siento por los equinoccios). Los puntos de evolución van con tags, no con ramas.\n\nNinguna es espectacular. Por eso mismo conviene dejarlas escritas.',
        en: 'Decisions that remain from today, so I don’t argue with myself about them a month from now.\n\nLight by default. The purple #7C3AED is just the brand, not a theme. Local first, cloud later. The illustration is independent of the theme. Time of day overrides the sky, and the weather overrides mood poses. Celebration is only for holidays (equinoxes don’t count, sorry equinoxes). Evolution points use tags, not branches.\n\nNone of them is spectacular. That’s exactly why they’re worth writing down.',
      },
    },
    {
      _key: 'entry-25',
      date: '2026-09-19',
      time: '22:50',
      dimension: dim('cloud'),
      tag: decision,
      description: {
        es: 'Lo que sigue es convertir Nimbus en una PWA. No es un giro: la arquitectura siempre estuvo pensada para eso.\n\nYa hay manifiesto, service worker, iconos, botón "Instalar Nimbus" y modo sin red. Lo que falta es lo aburrido y lo importante: desplegar el dist/, probarla en un móvil real y revisar las cabeceras de Apache. Hasta ahora todo esto funciona en mi máquina, que como garantía vale lo que vale.\n\nTambién quedan poses sin conectar, el icono de la PWA con el Nimbus viejo (sudadera amarilla en 3D) y un motor de frases al que le faltan ranking, memoria y unas 500 frases. La pestaña Nimbus sigue casi vacía. Sí, la que lleva su nombre. Ya sé.',
        en: 'What comes next is turning Nimbus into a PWA. It’s not a pivot: the architecture was always designed for it.\n\nThere’s already a manifest, a service worker, icons, an "Install Nimbus" button and an offline mode. What’s missing is the boring and important part: deploying the dist/, testing it on a real phone and checking the Apache headers. So far all of this works on my machine, which as a guarantee is worth what it’s worth.\n\nThere are also poses not yet connected, the PWA icon still showing the old Nimbus (yellow 3D hoodie) and a phrase engine that still needs ranking, memory and about 500 phrases. The Nimbus tab is still almost empty. Yes, the one with its name on it. I know.',
      },
    },
  ]

  console.log('Appending 4 entradas a Nimbus…')
  await client.patch('nimbus-experiment').append('logEntries', entries).commit()
  console.log('\n✅ Entradas agregadas correctamente.')
}

await run()
