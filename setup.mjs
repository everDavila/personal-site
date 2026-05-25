/**
 * Post-clone setup script.
 * Run once after cloning: node setup.mjs
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'

const REQUIRED_VARS = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_TOKEN',
]

// ── 1. Check .env.local ──────────────────────────────────────────────────────
console.log('\n davila.uno — setup\n')

if (!existsSync('.env.local')) {
  console.log('✗ .env.local not found.\n')
  console.log('Create it at the project root with:\n')
  console.log('  NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id')
  console.log('  NEXT_PUBLIC_SANITY_DATASET=production')
  console.log('  SANITY_TOKEN=your_write_token\n')
  console.log('Get values at: https://sanity.io/manage\n')
  process.exit(1)
}

// Check all required vars are present and non-empty
const envContent = readFileSync('.env.local', 'utf8')
const missing = REQUIRED_VARS.filter(key => {
  const match = envContent.match(new RegExp(`^${key}=(.+)`, 'm'))
  return !match || !match[1].replace(/["']/g, '').trim()
})

if (missing.length > 0) {
  console.log(`✗ Missing variables in .env.local:\n`)
  missing.forEach(v => console.log(`  ${v}`))
  console.log('\nAdd them and run this script again.\n')
  process.exit(1)
}

console.log('✓ .env.local found and complete\n')

// ── 2. Install dependencies ──────────────────────────────────────────────────
console.log('Installing dependencies...\n')
execSync('npm install', { stdio: 'inherit' })

// ── 3. Done ──────────────────────────────────────────────────────────────────
console.log('\n✓ Setup complete.\n')
console.log('Next steps:\n')
console.log('  npm run dev\n')
console.log('  → Site:   http://localhost:3000')
console.log('  → Studio: http://localhost:3000/studio\n')
