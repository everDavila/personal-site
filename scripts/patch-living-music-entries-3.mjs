/**
 * Patch — LivingMusic: entrada 14
 * 05/07/2026 03:20 — Art direction session: 4 frases de Wonderwall
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

const dim = (icon) => ({ _type: 'reference', _ref: `dim-${icon}` })

async function getTagRef(slug) {
  const id = await client.fetch(
    `*[_type == "logTag" && slug.current == $slug][0]._id`, { slug }
  )
  if (!id) throw new Error(`Tag no encontrado: ${slug}`)
  return { _type: 'reference', _ref: id }
}

async function run() {
  const decision = await getTagRef('decision')

  const entry = {
    _key: 'entry-14',
    date: '2026-07-05',
    time: '03:20',
    dimension: dim('pen-line'),
    tag: decision,
    description: {
      es: `Después de elegir Wonderwall como primer caso de estudio empezamos a simular las cuatro frases del arco emocional aplicando el vocabulario del manifiesto. Lo que sigue es el acta de la sesión — las decisiones tomadas, las que rechacé y por qué.

Frase 1. La sugerencia inicial fue Archive. La rechacé. Archive ya sabe lo que es — tiene presencia, tiene carácter definido, ocupa espacio. Wonderwall arranca antes de saber lo que es. Necesita una voz que todavía no confíe en sí misma. Voice. Horizon. Una tipografía que existiera en el límite entre aparecer y no estar todavía.

Frase 2. Aquí sí. Whisper, Resistir, Papel — perfecto tal cual. Pero quiero agregar algo que no estaba en el vocabulario original: el papel no vuelve a su estado inicial después de plegarse. Hay una deformación que persiste aunque sea invisible. Eso tiene que estar en la animación: cuando aparezca la siguiente línea debería conservar algo de la anterior. Un residuo. Una pequeña distorsión. Porque la canción recuerda, aunque la letra no lo diga. Eso es cine.

Frase 3. Discrepo con Machine. Machine implica precisión y Wonderwall nunca es precisa — es humana, irregular, imperfecta. Cambié la propuesta: Pulse. No es máquina, no es susurro. Es corazón. Late. Y donde había Metal propuse Materia Cuerda. La tensión de Wonderwall no es industrial. Es orgánica. Como una cuerda de guitarra que vibra después de ser pulsada y sigue vibrando más de lo que debería. Mucho más coherente con Oasis.

Frase 4. El cambio más fuerte. Expandir no funciona — parece una recompensa, y Wonderwall nunca termina de resolver. El coro no dice "todo está bien". Dice "creo que eres tú". Todavía hay duda. Todavía hay pregunta. La frase tiene que crecer sin cerrar. Ese vocabulario está por definirse. Es la parte más difícil de traducir al sistema — y probablemente la más importante.

Cuatro frases. El manifiesto está siendo puesto a prueba antes de estar terminado. Así es exactamente como debería funcionar.`,
      en: `After choosing Wonderwall as the first case study we simulated the four key phrases of the emotional arc, applying the manifesto vocabulary. What follows is the session record — the decisions made, the ones I rejected and why.

Phrase 1. Initial suggestion was Archive. Rejected. Archive already knows what it is — it has presence, defined character, it takes up space. Wonderwall starts before knowing what it is. It needs a voice that doesn't yet trust itself. Voice. Horizon. A typeface that exists on the edge between appearing and not being there yet.

Phrase 2. This one yes. Whisper, Resistir, Paper — perfect as is. But I want to add something that wasn't in the original vocabulary: paper doesn't return to its initial state after being folded. There's a deformation that persists even if invisible. That has to be in the animation: when the next line appears it should retain something of the previous one. A residue. A small distortion. Because the song remembers, even if the lyrics don't say so. That's cinema.

Phrase 3. I disagree with Machine. Machine implies precision and Wonderwall is never precise — it's human, irregular, imperfect. Changed the proposal: Pulse. Not machine, not whisper. It's heart. It beats. And where Metal was I proposed Material String. Wonderwall's tension isn't industrial. It's organic. Like a guitar string that vibrates after being plucked and keeps vibrating longer than it should. Much more coherent with Oasis.

Phrase 4. The strongest change. Expand doesn't work — it feels like a reward, and Wonderwall never fully resolves. The chorus doesn't say "everything is fine." It says "I don't know how." There's still doubt. The phrase has to grow without closing. That vocabulary is still to be defined. It's probably the hardest part to translate into the system — and probably the most important.

Four phrases. The manifesto is being tested before it's finished. That's exactly how it should work.`,
    },
  }

  console.log('Appending entrada 14 (art direction Wonderwall)…')
  await client
    .patch('living-music-experiment')
    .append('logEntries', [entry])
    .commit()

  console.log('\n✅ Entrada 14 agregada.')
}

await run()
