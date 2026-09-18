/**
 * Patch script — davila.uno: toast narrativo al cambiar de modo (texto final)
 * 18/09/2026
 *
 * Uso:
 *   node scripts/patch-davila-mode-toast-2026-09-18.mjs
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

async function run() {
  console.log('Actualizando texto de la entrada duno-10…')
  await client
    .patch('davila-uno-site')
    .set({
      'logEntries[_key=="duno-10"].description': {
        es: 'Antes, davila.uno pedía elegir entre Tierra y Orbital antes de mostrar el sitio. Funcionaba como idea, pero añadía una decisión innecesaria demasiado pronto.\n\nAhora entra directamente en Tierra y el cambio a Orbital queda disponible durante la navegación.\n\nTambién añadí un mensaje breve al cambiar de modo, solo para dar contexto sobre lo que acaba de pasar.\n\nMenos explicación antes de entrar.\nMás claridad cuando realmente hace falta.',
        en: 'Before, davila.uno asked you to choose between Earth and Orbital before showing the site. It worked as an idea, but it added an unnecessary decision too early.\n\nNow it opens directly in Earth, and the switch to Orbital stays available while browsing.\n\nI also added a short message when switching modes, just to give context on what just happened.\n\nLess explanation before entering.\nMore clarity when it’s actually needed.',
      },
    })
    .commit()

  console.log('\n✅ Entrada actualizada correctamente.')
}

await run()
