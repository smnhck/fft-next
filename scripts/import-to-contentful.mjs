/**
 * Import scraped cakes into Contentful
 *
 * Reads scraped-cakes.json and creates entries in Contentful.
 * Also creates category entries and downloads/uploads images.
 *
 * Prerequisites:
 *   1. Run: node scripts/migrate-content-types.mjs
 *   2. Run: node scripts/scrape-cakes.mjs
 *
 * Usage: node scripts/import-to-contentful.mjs
 *
 * Flags:
 *   --dry-run     Preview what would be created without making changes
 *   --skip-images Skip image upload (faster for testing)
 *   --categories-only  Only create category entries
 */

import { readFileSync } from 'fs'

// Load .env
const envFile = readFileSync('.env', 'utf-8')
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
    const [k, ...v] = l.split('=')
    return [k.trim(), v.join('=').trim()]
  })
)

const SPACE_ID = env.CONTENTFUL_SPACE_ID
const CMA_TOKEN = env.CONTENTFUL_MANAGEMENT_TOKEN
const ENV_ID = 'master'
const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}`
const LOCALE = 'en-US' // Contentful default locale

const DRY_RUN = process.argv.includes('--dry-run')
const SKIP_IMAGES = process.argv.includes('--skip-images')
const CATEGORIES_ONLY = process.argv.includes('--categories-only')

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${CMA_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) {
    if (res.status === 409) {
      console.warn(`  ⚠ Conflict (already exists): ${path}`)
      return null
    }
    console.error(`API error ${res.status}:`, data.message || JSON.stringify(data))
    return null
  }
  return data
}

async function createEntry(contentTypeId, fields, entryId) {
  const headers = {}
  if (entryId) headers['X-Contentful-Content-Type'] = contentTypeId

  const body = {
    fields: Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, { [LOCALE]: value }])
    ),
  }

  const path = entryId
    ? `/entries/${entryId}`
    : `/entries`

  const method = entryId ? 'PUT' : 'POST'

  if (!entryId) {
    headers['X-Contentful-Content-Type'] = contentTypeId
  }

  const entry = await api(path, { method, headers, body: JSON.stringify(body) })
  return entry
}

async function publishEntry(entryId, version) {
  return api(`/entries/${entryId}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(version) },
  })
}

async function uploadImage(url, title) {
  if (SKIP_IMAGES) return null

  try {
    // Create upload from URL
    const asset = await api('/assets', {
      method: 'POST',
      body: JSON.stringify({
        fields: {
          title: { [LOCALE]: title },
          file: {
            [LOCALE]: {
              contentType: 'image/jpeg',
              fileName: `${title.replace(/[^a-zA-Z0-9-]/g, '-')}.jpg`,
              upload: url,
            },
          },
        },
      }),
    })

    if (!asset) return null

    // Process the asset
    await api(`/assets/${asset.sys.id}/files/${LOCALE}/process`, { method: 'PUT' })

    // Wait for processing
    await new Promise(r => setTimeout(r, 2000))

    // Get updated asset (with new version after processing)
    const processed = await api(`/assets/${asset.sys.id}`)
    if (!processed) return null

    // Publish
    await api(`/assets/${asset.sys.id}/published`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(processed.sys.version) },
    })

    return asset.sys.id
  } catch (err) {
    console.warn(`  ⚠ Failed to upload image for ${title}: ${err.message}`)
    return null
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  if (DRY_RUN) console.log('🏃 DRY RUN — no changes will be made\n')

  console.log('Importing content to Contentful')
  console.log('================================\n')

  // 1. Create categories
  console.log('1. Creating categories...')
  const CATEGORIES = [
    { title: 'Torten & Törtchen', slug: 'torten-und-toertchen', order: 1 },
    { title: 'Hochzeitstorten', slug: 'hochzeitstorten', order: 2 },
    { title: 'Flaumiges Hefegebäck', slug: 'flaumiges-hefegebaeck', order: 3 },
    { title: 'Kuchen, Muffins & Cupcakes', slug: 'kuchen-und-muffins', order: 4 },
    { title: 'Plätzchen, Kekse & Kleingebäck', slug: 'plaetzchen-kekse-und-kleingebaeck', order: 5 },
    { title: 'Cake Pops', slug: 'cake-pops', order: 6 },
  ]

  const categoryIds = {}

  for (const cat of CATEGORIES) {
    const entryId = `cat-${slugify(cat.title)}`

    if (DRY_RUN) {
      console.log(`  Would create category: ${cat.title} (${entryId})`)
      categoryIds[cat.slug] = entryId
      continue
    }

    const entry = await createEntry('category', {
      title: cat.title,
      slug: cat.slug,
      sortOrder: cat.order,
    }, entryId)

    if (entry) {
      await publishEntry(entry.sys.id, entry.sys.version)
      console.log(`  ✓ ${cat.title}`)
      categoryIds[cat.slug] = entry.sys.id
    } else {
      // Try to fetch existing
      const existing = await api(`/entries/${entryId}`)
      if (existing) categoryIds[cat.slug] = existing.sys.id
      console.log(`  ⊘ ${cat.title} (already exists)`)
    }
  }

  if (CATEGORIES_ONLY) {
    console.log('\n✓ Categories created. Exiting (--categories-only).')
    return
  }

  // 2. Import cakes
  console.log('\n2. Importing cakes...')

  let scrapedData
  try {
    scrapedData = JSON.parse(readFileSync('scripts/scraped-cakes.json', 'utf-8'))
  } catch {
    console.error('✗ Could not read scripts/scraped-cakes.json')
    console.error('  Run: node scripts/scrape-cakes.mjs first')
    process.exit(1)
  }

  const cakes = scrapedData.cakes
  console.log(`  Found ${cakes.length} cakes to import\n`)

  let created = 0
  let skipped = 0
  let failed = 0

  for (const cake of cakes) {
    const cakeSlug = cake.slug.replace(/\/$/, '')
    const catSlug = cake.category.slug
    const catId = categoryIds[catSlug]

    if (DRY_RUN) {
      console.log(`  Would create: ${cake.title} [${cake.category.title}]`)
      created++
      continue
    }

    // Build fields
    const fields = {
      title: cake.title,
      slug: cakeSlug,
      teaser: cake.teaser || '',
    }

    // Link to category
    if (catId) {
      // Categories is a multi-reference field on Cake
      // We set it as an array of links
      fields.categories = [
        { sys: { type: 'Link', linkType: 'Entry', id: catId } }
      ]
    }

    // Create the entry
    const entry = await createEntry('cake', fields)

    if (entry) {
      await publishEntry(entry.sys.id, entry.sys.version)
      created++
      if (created % 10 === 0) console.log(`  Progress: ${created}/${cakes.length}`)
    } else {
      failed++
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n✓ Import complete!`)
  console.log(`  Created: ${created}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Failed: ${failed}`)
}

main().catch(err => {
  console.error('Import failed:', err)
  process.exit(1)
})
