/**
 * Seed script — Invitaciones Digitales Express
 *
 * Uso:
 *   node scripts/seed-invitaciones.mjs
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

async function getTagRef(slug) {
  const id = await client.fetch(`*[_type == "logTag" && slug.current == $slug][0]._id`, { slug })
  if (!id) throw new Error(`logTag "${slug}" no encontrado. Corre seed-nimbus.mjs primero.`)
  return { _type: 'reference', _ref: id }
}

async function seed() {
  console.log('Resolviendo tags…')
  const [hipotesis, decision, avance, leccion, insight, duda, validacion, hito] = await Promise.all([
    getTagRef('hipotesis'),
    getTagRef('decision'),
    getTagRef('avance'),
    getTagRef('leccion'),
    getTagRef('insight'),
    getTagRef('duda'),
    getTagRef('validacion'),
    getTagRef('hito'),
  ])
  console.log('  ✓ 8 tags resueltos')

  const item = {
    _type: 'playgroundItem',
    _id:   'invitaciones-digitales-express',
    title: {
      es: 'Invitaciones Digitales Express',
      en: 'Express Digital Invitations',
    },
    slug: { _type: 'slug', current: 'invitaciones-digitales' },
    localizedSlug: {
      es: { _type: 'slug', current: 'invitaciones-digitales' },
      en: { _type: 'slug', current: 'invitaciones-digitales' },
    },
    category: 'tools',
    status:   'completado',
    year:     2026,
    hidden:   false,
    description: {
      es: 'Eliminando la fricción de las invitaciones en PDF.',
      en: 'Removing the friction of PDF invitations.',
    },
    idea: {
      es: 'Un sistema simple para enviar invitaciones web personalizadas mediante enlaces compartidos por WhatsApp.\n\nLos invitados confirman asistencia desde cualquier dispositivo y toda la información queda centralizada automáticamente.',
      en: 'A simple system for sending personalized web invitations via links shared through WhatsApp.\n\nGuests confirm attendance from any device and all the information is automatically centralized.',
    },
    why: {
      es: 'Todo comenzó cuando mi madre recibió una invitación familiar en PDF.\n\nPesaba demasiado, tardaba en abrir y no se adaptaba correctamente al celular.\n\nDespués de observar el problema entendí que el diseño no era el verdadero inconveniente.\n\nEl problema era el PDF.',
      en: 'It all started when my mother received a family invitation as a PDF.\n\nIt was too heavy, slow to open, and didn\'t adapt properly to the phone screen.\n\nAfter observing the problem I understood that design wasn\'t the real issue.\n\nThe problem was the PDF.',
    },
    logEntries: [
      {
        _key: 'inv-1',
        date: '2026-07-15',
        time: '14:12',
        dimension: 'lightbulb',
        tag: hipotesis,
        description: {
          es: 'Estoy empezando a pensar que las invitaciones familiares no necesitan convertirse en aplicaciones.\n\nTal vez solo necesiten dejar de ser PDFs.',
          en: 'Starting to think that family invitations don\'t need to become apps.\n\nMaybe they just need to stop being PDFs.',
        },
      },
      {
        _key: 'inv-2',
        date: '2026-07-15',
        time: '15:26',
        dimension: 'target',
        tag: decision,
        description: {
          es: 'Cada invitado tendrá una URL única.\n\nLa administración debe realizarse desde una herramienta que cualquier familiar pueda entender.\n\nGoogle Sheets es suficiente.',
          en: 'Each guest gets a unique URL.\n\nAdministration should use a tool any family member can understand.\n\nGoogle Sheets is enough.',
        },
      },
      {
        _key: 'inv-3',
        date: '2026-07-15',
        time: '16:10',
        dimension: 'layers',
        tag: duda,
        description: {
          es: '¿Cómo se ve el enlace cuando mi madre lo pega en WhatsApp?\n\nEl preview importa más de lo que pensaba. Si aparece feo o vacío, la gente no confía en el link.\n\nNecesito trabajar el Open Graph antes de la primera prueba real.',
          en: 'How does the link look when my mother pastes it into WhatsApp?\n\nThe preview matters more than I thought. If it looks broken or empty, people won\'t trust the link.\n\nNeed to handle Open Graph before the first real test.',
        },
      },
      {
        _key: 'inv-4',
        date: '2026-07-15',
        time: '17:58',
        dimension: 'code-2',
        tag: avance,
        description: {
          es: 'La primera versión ya funciona.\n\nLas invitaciones se generan correctamente.\n\nLas confirmaciones llegan al Sheet.',
          en: 'The first version works.\n\nInvitations generate correctly.\n\nConfirmations reach the Sheet.',
        },
      },
      {
        _key: 'inv-5',
        date: '2026-07-15',
        time: '18:43',
        dimension: 'book-open',
        tag: leccion,
        description: {
          es: 'El sistema ya funciona.\n\nLa experiencia todavía se siente fría.\n\nParece un formulario.\n\nNo una invitación.',
          en: 'The system works.\n\nThe experience still feels cold.\n\nIt looks like a form.\n\nNot an invitation.',
        },
      },
      {
        _key: 'inv-6',
        date: '2026-07-15',
        time: '19:17',
        dimension: 'lightbulb',
        tag: insight,
        description: {
          es: 'Cada respuesta debería tener una reacción distinta.\n\nSi asiste: "Nos vemos pronto 🎉"\n\nSi no asiste: "Te vamos a extrañar, pero gracias por avisar."',
          en: 'Each response should have a different reaction.\n\nIf attending: "See you soon 🎉"\n\nIf not attending: "We\'ll miss you, but thanks for letting us know."',
        },
      },
      {
        _key: 'inv-7',
        date: '2026-07-15',
        time: '20:04',
        dimension: 'layers',
        tag: avance,
        description: {
          es: 'Agregadas pantallas finales personalizadas según la respuesta.\n\nPequeño cambio.\n\nGran diferencia emocional.',
          en: 'Added personalized final screens based on the response.\n\nSmall change.\n\nBig emotional difference.',
        },
      },
      {
        _key: 'inv-8',
        date: '2026-07-15',
        time: '21:33',
        dimension: 'flask-conical',
        tag: validacion,
        description: {
          es: 'Primera prueba real con un familiar.\n\nAbrió el link desde el WhatsApp, leyó la invitación, confirmó asistencia.\n\nSin confusión. Sin fricción.\n\nEso era exactamente lo que necesitaba ver.',
          en: 'First real test with a family member.\n\nOpened the link from WhatsApp, read the invitation, confirmed attendance.\n\nNo confusion. No friction.\n\nThat was exactly what I needed to see.',
        },
      },
      {
        _key: 'inv-9',
        date: '2026-07-15',
        time: '22:51',
        dimension: 'zap',
        tag: hito,
        description: {
          es: 'Primera invitación real enviada.\n\nEl evento era el cumpleaños de mi madre.\n\nTodas las confirmaciones llegaron en menos de una hora.',
          en: 'First real invitation sent.\n\nThe event was my mother\'s birthday.\n\nAll confirmations arrived within an hour.',
        },
      },
    ],
    repoUrl: null,
    demoUrl: null,
  }

  console.log('\nCreando Invitaciones Digitales Express…')
  await client.createOrReplace(item)
  console.log('  ✓ Invitaciones Digitales creado')
}

await seed()
console.log('\n✅ Seed completo. Visita /es/laboratorio/invitaciones-digitales')
