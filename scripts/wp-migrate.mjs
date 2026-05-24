/**
 * WordPress → Sanity migration script
 *
 * Usage:
 *   node scripts/wp-migrate.mjs path/to/wordpress-export.xml
 *
 * Requires SANITY_TOKEN in .env.local (write token from sanity.io/manage).
 * Reads NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET from .env.local.
 *
 * Run ONCE. Re-running will create duplicates (check Sanity Studio first).
 */

import { readFileSync } from 'fs'
import { createRequire } from 'module'
import { createClient } from '@sanity/client'

const require = createRequire(import.meta.url)
const { XMLParser } = require('fast-xml-parser')

// ─── Config ──────────────────────────────────────────────────────────────────

const xmlFile = process.argv[2]
if (!xmlFile) {
  console.error('Usage: node scripts/wp-migrate.mjs wordpress-export.xml')
  process.exit(1)
}

// Load .env.local manually (Next.js env files aren't auto-loaded in plain Node)
const env = {}
try {
  const raw = readFileSync('.env.local', 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
  }
} catch {
  console.error('Could not read .env.local — make sure it exists and has SANITY_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token:     env.SANITY_TOKEN,
  useCdn:    false,
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _keyN = 0
const uid = () => `k${String(++_keyN).padStart(6, '0')}`

function decodeEntities(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g,      (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ''))
}

// ─── Inline mark parser ───────────────────────────────────────────────────────
// Converts inner HTML of a block element into Portable Text spans + markDefs

function parseInline(html) {
  const markDefs = []
  const spans    = []
  const stack    = []                    // active marks

  const tokens = html.split(/(<[^>]*>)/).filter(Boolean)

  for (const token of tokens) {
    if (!token.startsWith('<')) {
      const text = decodeEntities(token)
      if (!text) continue
      const marks = stack.map(m => typeof m === 'string' ? m : m._key)
      spans.push({ _type: 'span', _key: uid(), text, marks })
      continue
    }

    const isClosing = token.startsWith('</')
    const tag = (token.match(/<\/?([a-z][a-z0-9]*)/i)?.[1] || '').toLowerCase()
    const canonical = { b: 'strong', i: 'em', strong: 'strong', em: 'em' }

    if (isClosing) {
      // pop the most-recent matching mark off the stack
      for (let i = stack.length - 1; i >= 0; i--) {
        const m = stack[i]
        if (m === canonical[tag] || (typeof m === 'object' && tag === 'a')) {
          stack.splice(i, 1)
          break
        }
      }
    } else if (tag === 'br') {
      spans.push({ _type: 'span', _key: uid(), text: '\n', marks: [] })
    } else if (canonical[tag]) {
      stack.push(canonical[tag])
    } else if (tag === 'a') {
      const href = (token.match(/href=["']([^"']*)["']/) || [])[1] || ''
      const def  = { _type: 'link', _key: uid(), href }
      markDefs.push(def)
      stack.push(def)
    }
    // Other tags (span, code, img …): ignore the tag, text content is still captured
  }

  return {
    spans:    spans.filter(s => s.text),
    markDefs,
  }
}

// ─── Block parser ─────────────────────────────────────────────────────────────

function htmlToBlocks(rawHtml) {
  if (!rawHtml) return []

  const blocks = []
  const html = rawHtml
    .replace(/\r\n|\r/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')

  // Regex to capture one block-level element at a time
  const blockRe = /<(h[1-6]|p|ul|ol|blockquote)(?:[^>]*)>([\s\S]*?)<\/\1>/gi
  let lastEnd    = 0
  let m

  while ((m = blockRe.exec(html)) !== null) {
    // Text between blocks → treat as paragraph
    const between = html.slice(lastEnd, m.index).trim()
    if (between) {
      const text = stripTags(between)
      if (text) blocks.push(makeBlock('normal', text))
    }

    const [, tag, inner] = m
    const t = tag.toLowerCase()

    if (t === 'ul' || t === 'ol') {
      const liRe = /<li(?:[^>]*)>([\s\S]*?)<\/li>/gi
      let li
      while ((li = liRe.exec(inner)) !== null) {
        const { spans, markDefs } = parseInline(li[1])
        if (spans.length) {
          blocks.push({
            _type: 'block', _key: uid(),
            style: 'normal',
            listItem: t === 'ul' ? 'bullet' : 'number',
            level: 1,
            markDefs,
            children: spans,
          })
        }
      }
    } else {
      const style = t === 'p' ? 'normal'
        : t === 'blockquote' ? 'blockquote'
        : t   // h2, h3, h4…
      const { spans, markDefs } = parseInline(inner)
      if (spans.length) {
        blocks.push({ _type: 'block', _key: uid(), style, markDefs, children: spans })
      }
    }

    lastEnd = m.index + m[0].length
  }

  // Remaining text after last block tag
  const tail = html.slice(lastEnd).trim()
  if (tail) {
    const text = stripTags(tail)
    if (text) blocks.push(makeBlock('normal', text))
  }

  return blocks
}

function makeBlock(style, text) {
  return {
    _type: 'block', _key: uid(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: uid(), text, marks: [] }],
  }
}

// ─── Parse WXR XML ───────────────────────────────────────────────────────────

const parser = new XMLParser({
  ignoreAttributes:        false,
  attributeNamePrefix:     '@_',
  textNodeName:            '#text',
  isArray:                 (name) => ['item', 'category'].includes(name),
  cdataPropName:           '__cdata',
  allowBooleanAttributes:  true,
})

const xml    = readFileSync(xmlFile, 'utf8')
const parsed = parser.parse(xml)
const items  = parsed?.rss?.channel?.item ?? []

const posts = items.filter(item => {
  const type   = item['wp:post_type']?.['__cdata'] ?? item['wp:post_type']
  const status = item['wp:status']?.['__cdata']    ?? item['wp:status']
  return type === 'post' && status === 'publish'
})

console.log(`Found ${posts.length} published posts`)

// ─── Collect categories ───────────────────────────────────────────────────────

const categoryMap = new Map()  // WP nice-name → Sanity doc ID

for (const post of posts) {
  const cats = Array.isArray(post.category) ? post.category : post.category ? [post.category] : []
  for (const cat of cats) {
    const name = cat['__cdata'] ?? cat['#text'] ?? String(cat)
    const slug = cat['@_nicename'] ?? name.toLowerCase().replace(/\s+/g, '-')
    if (slug && !categoryMap.has(slug)) {
      categoryMap.set(slug, null)   // placeholder, filled after upload
    }
  }
}

console.log(`Creating ${categoryMap.size} categories…`)

for (const [slug] of categoryMap) {
  try {
    const existing = await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]._id`,
      { slug }
    )
    if (existing) {
      categoryMap.set(slug, existing)
      console.log(`  ↳ category already exists: ${slug}`)
      continue
    }
    const doc = await client.create({
      _type: 'category',
      title: slug.replace(/-/g, ' '),
      slug:  { _type: 'slug', current: slug },
    })
    categoryMap.set(slug, doc._id)
    console.log(`  ✓ created category: ${slug}`)
  } catch (err) {
    console.error(`  ✗ category ${slug}:`, err.message)
  }
}

// ─── Create posts ─────────────────────────────────────────────────────────────

let created = 0, skipped = 0, failed = 0

for (const item of posts) {
  const titleRaw   = item.title?.['__cdata']              ?? item.title ?? ''
  const slugRaw    = item['wp:post_name']?.['__cdata']    ?? item['wp:post_name'] ?? ''
  const dateRaw    = item.pubDate ?? ''
  const contentRaw = item['content:encoded']?.['__cdata'] ?? item['content:encoded'] ?? ''
  const excerptRaw = item['excerpt:encoded']?.['__cdata'] ?? item['excerpt:encoded'] ?? ''

  const title   = decodeEntities(String(titleRaw)).trim()
  const slug    = String(slugRaw).trim()
  const date    = dateRaw ? new Date(dateRaw).toISOString() : new Date().toISOString()
  const excerpt = stripTags(String(excerptRaw)).trim()
  const blocks  = htmlToBlocks(String(contentRaw))

  if (!slug) {
    console.warn(`  ⚠ skipping post with no slug: "${title}"`)
    skipped++
    continue
  }

  // Check if post already exists
  try {
    const existing = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]._id`,
      { slug }
    )
    if (existing) {
      console.log(`  ↳ already exists, skipping: ${slug}`)
      skipped++
      continue
    }
  } catch {}

  // Build category references
  const cats = Array.isArray(item.category) ? item.category : item.category ? [item.category] : []
  const categories = cats
    .map(cat => {
      const nicename = cat['@_nicename'] ?? ''
      const id = categoryMap.get(nicename)
      return id ? { _type: 'reference', _ref: id, _key: uid() } : null
    })
    .filter(Boolean)

  const doc = {
    _type: 'post',
    originalLanguage: 'es',
    title:       { es: title },
    slug:        { _type: 'slug', current: slug },
    publishedAt: date,
    excerpt:     excerpt ? { es: excerpt } : undefined,
    body:        blocks.length ? { es: blocks } : undefined,
    categories:  categories.length ? categories : undefined,
  }

  try {
    await client.create(doc)
    console.log(`  ✓ ${slug}`)
    created++
  } catch (err) {
    console.error(`  ✗ ${slug}:`, err.message)
    failed++
  }
}

console.log(`\nDone — created: ${created} | skipped: ${skipped} | failed: ${failed}`)
