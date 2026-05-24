/**
 * Fix originalLanguage for migrated WordPress posts.
 *
 * WordPress Polylang adds a category with the locale code ('en', 'es', 'pt', etc.)
 * to each post. This script reads that category and patches each Sanity document:
 *   - Sets the correct originalLanguage
 *   - Moves title / excerpt / body from the .es field to the correct locale field
 *
 * Usage:
 *   node scripts/wp-fix-locales.mjs path/to/wordpress-export.xml
 */

import { readFileSync } from 'fs'
import { createRequire } from 'module'
import { createClient } from '@sanity/client'

const require = createRequire(import.meta.url)
const { XMLParser } = require('fast-xml-parser')

const xmlFile = process.argv[2]
if (!xmlFile) {
  console.error('Usage: node scripts/wp-fix-locales.mjs wordpress-export.xml')
  process.exit(1)
}

const env = {}
try {
  const raw = readFileSync('.env.local', 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
} catch {
  console.error('Could not read .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token:     env.SANITY_TOKEN,
  useCdn:    false,
})

const LOCALES = new Set(['es', 'en', 'pt', 'qu', 'zh'])

const parser = new XMLParser({
  ignoreAttributes:       false,
  attributeNamePrefix:    '@_',
  textNodeName:           '#text',
  isArray:                (name) => ['item', 'category'].includes(name),
  cdataPropName:          '__cdata',
  allowBooleanAttributes: true,
})

const xml    = readFileSync(xmlFile, 'utf8')
const parsed = parser.parse(xml)
const items  = parsed?.rss?.channel?.item ?? []

const posts = items.filter(item => {
  const type   = item['wp:post_type']?.['__cdata'] ?? item['wp:post_type']
  const status = item['wp:status']?.['__cdata']    ?? item['wp:status']
  return type === 'post' && status === 'publish'
})

console.log(`Processing ${posts.length} posts…\n`)

let patched = 0, skipped = 0

for (const item of posts) {
  const slugRaw = item['wp:post_name']?.['__cdata'] ?? item['wp:post_name'] ?? ''
  const slug    = String(slugRaw).trim()
  if (!slug) continue

  // Detect locale from Polylang language category
  const cats = Array.isArray(item.category) ? item.category : item.category ? [item.category] : []
  const localeCat = cats.find(cat => LOCALES.has(cat['@_nicename'] ?? ''))
  const locale = localeCat?.['@_nicename'] ?? 'es'

  // Fetch the Sanity document
  const doc = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ _id, originalLanguage, title, excerpt, body }`,
    { slug }
  )

  if (!doc) {
    console.log(`  ⚠ not found in Sanity: ${slug}`)
    skipped++
    continue
  }

  if (doc.originalLanguage === locale && locale === 'es') {
    // Already correct and content is in the right field
    console.log(`  ✓ already correct (es): ${slug}`)
    skipped++
    continue
  }

  // Build the patch
  let p = client.patch(doc._id).set({ originalLanguage: locale })

  if (locale !== 'es') {
    // Move content from .es → .{locale}
    if (doc.title?.es) {
      p = p.set({ [`title.${locale}`]: doc.title.es }).unset([`title.es`])
    }
    if (doc.excerpt?.es) {
      p = p.set({ [`excerpt.${locale}`]: doc.excerpt.es }).unset([`excerpt.es`])
    }
    if (doc.body?.es) {
      p = p.set({ [`body.${locale}`]: doc.body.es }).unset([`body.es`])
    }
  }

  await p.commit()
  console.log(`  ✓ ${slug}  →  originalLanguage: ${locale}`)
  patched++
}

console.log(`\nDone — patched: ${patched} | skipped: ${skipped}`)
