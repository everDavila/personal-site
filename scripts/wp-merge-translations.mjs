/**
 * Merge translated WordPress posts into a single Sanity document.
 *
 * Each pair/group has one "primary" document (ES) that keeps the slug.
 * Content from secondary documents (EN, PT…) is copied into the primary's
 * locale fields, then secondary documents are deleted.
 *
 * Usage:
 *   node scripts/wp-merge-translations.mjs          # preview only
 *   node scripts/wp-merge-translations.mjs --commit  # actually merge
 */

import { readFileSync } from 'fs'
import { createClient } from '@sanity/client'

const DRY = !process.argv.includes('--commit')

const env = {}
try {
  const raw = readFileSync('.env.local', 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
} catch {
  console.error('Could not read .env.local'); process.exit(1)
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token:     env.SANITY_TOKEN,
  useCdn:    false,
})

// ─── Translation groups ───────────────────────────────────────────────────────
// primary: the document that STAYS (receives all locale content)
// secondaries: documents to merge into primary, then delete

const GROUPS = [
  {
    primary: 'del-queso-al-arroz',
    secondaries: [{ slug: 'from-cheese-to-rice', locale: 'en' }],
  },
  {
    primary: 'si-me-recuerdas-que-sea-con-drama',
    secondaries: [{ slug: 'if-you-remember-me-let-it-be-with-drama', locale: 'en' }],
  },
  {
    primary: 'me-quieres-o-no-porque-tengo-cuentas-que-pagar',
    secondaries: [{ slug: 'waiting-for-a-sign-or-just-a-waste-of-time', locale: 'en' }],
  },
  {
    primary: 'adaptacion-a-la-velocidad-de-la-luz-lecciones-de-la-innovacion-china',
    secondaries: [{ slug: 'adaptation-at-lightning-speed-a-masterclass-in-adaptability', locale: 'en' }],
  },
  {
    primary: 'china-lo-vuelve-a-hacer-openai-gasto-millones-en-su-ia-deepseek-lo-hizo-con-el-vuelto-del-pan',
    secondaries: [{ slug: 'china-does-it-again-openai-spent-millions-on-ai-deepseek-did-it-with-pocket-change', locale: 'en' }],
  },
  {
    primary: 'san-valentin-y-otras-tragedias-modernas',
    secondaries: [
      { slug: 'valentines-day-love-chaos-and-other-greek-tragedies', locale: 'en' },
      { slug: 'dia-dos-namorados-e-otras-tragedias-modernas',        locale: 'pt' },
    ],
  },
  {
    primary: 'aprender-con-inteligencia-no-solo-la-artificial',
    secondaries: [{ slug: 'learning-with-intelligence-not-just-artificial', locale: 'en' }],
  },
]

// ─── Run ─────────────────────────────────────────────────────────────────────

console.log(DRY ? '— DRY RUN (preview only) —\n' : '— COMMITTING CHANGES —\n')

for (const group of GROUPS) {
  const primaryDoc = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ _id, title, excerpt, body }`,
    { slug: group.primary }
  )

  if (!primaryDoc) {
    console.log(`⚠  primary not found: ${group.primary}`)
    continue
  }

  console.log(`▶  ${group.primary}`)

  let patch = client.patch(primaryDoc._id)
  const toDelete = []

  for (const { slug, locale } of group.secondaries) {
    const secDoc = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{ _id, title, excerpt, body }`,
      { slug }
    )

    if (!secDoc) {
      console.log(`   ⚠  secondary not found: ${slug}`)
      continue
    }

    const titleVal   = secDoc.title?.[locale]
    const excerptVal = secDoc.excerpt?.[locale]
    const bodyVal    = secDoc.body?.[locale]

    console.log(`   ← [${locale}] ${slug}`)
    if (titleVal)   console.log(`      title.${locale}: "${titleVal.slice(0, 60)}…"`)
    if (excerptVal) console.log(`      excerpt.${locale}: ${excerptVal.length} chars`)
    if (bodyVal)    console.log(`      body.${locale}: ${bodyVal.length} blocks`)

    if (titleVal)   patch = patch.set({ [`title.${locale}`]:   titleVal })
    if (excerptVal) patch = patch.set({ [`excerpt.${locale}`]: excerptVal })
    if (bodyVal)    patch = patch.set({ [`body.${locale}`]:    bodyVal })

    toDelete.push(secDoc._id)
  }

  if (!DRY) {
    await patch.commit()
    for (const id of toDelete) await client.delete(id)
    console.log(`   ✓ merged and deleted ${toDelete.length} secondary doc(s)`)
  }

  console.log()
}

if (DRY) {
  console.log('─────────────────────────────────────────────')
  console.log('Preview OK. Run with --commit to apply changes.')
}
