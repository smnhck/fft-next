/**
 * Set missing categories on cake entries in Contentful.
 * Uses migration JSON files (cakes.json + cakes_new.json) as source of truth.
 *
 * Usage: node scripts/set-categories.mjs [--dry-run]
 */

import { readFileSync } from 'fs'

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
const DRY_RUN = process.argv.includes('--dry-run')

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${CMA_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    let msg
    try { msg = JSON.parse(text).message } catch { msg = text }
    console.error(`API error ${res.status} for ${path}:`, msg)
    return null
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

function normalizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/ê/g, 'e').replace(/é/g, 'e').replace(/è/g, 'e')
    .replace(/â/g, 'a').replace(/à/g, 'a')
    .replace(/ô/g, 'o').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/[\u201E\u201C\u201D\u201F\u201A\u2018\u2019\u0022\u0027\u2032\u2033]/g, '')
    .replace(/&/g, 'und')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Build cake → category mapping from migration JSON files
function buildCategoryLookup() {
  const lookup = new Map() // normalized slug → category slug

  for (const file of ['migration/cakes.json', 'migration/cakes_new.json']) {
    let raw
    try { raw = JSON.parse(readFileSync(file, 'utf-8')) } catch { continue }
    const tableEntry = raw.find(e => e.type === 'table')
    if (!tableEntry?.data) continue

    for (const cake of tableEntry.data) {
      if (!cake.identifier || !cake.category) continue
      const normalized = normalizeSlug(cake.identifier)
      lookup.set(normalized, cake.category)
      // Also store by title for fuzzy matching
      lookup.set(cake.title?.toLowerCase(), cake.category)
    }
  }

  return lookup
}

async function main() {
  const categoryLookup = buildCategoryLookup()
  console.log(`Built lookup with ${categoryLookup.size} entries from migration files`)

  // 1. Fetch all categories from Contentful to get entry IDs
  const catData = await api('/entries?content_type=category&select=sys.id,fields.slug,fields.title&limit=100')
  if (!catData) { console.error('Failed to fetch categories'); return }

  const categoryIdBySlug = new Map()
  for (const cat of catData.items) {
    const slug = cat.fields.slug?.['en-US']
    if (slug) categoryIdBySlug.set(slug, cat.sys.id)
  }
  console.log(`Found ${categoryIdBySlug.size} categories in Contentful:`, [...categoryIdBySlug.keys()].join(', '))

  // 2. Fetch all cake entries
  let skip = 0
  const limit = 100
  let total = Infinity
  const entries = []

  while (skip < total) {
    const data = await api(`/entries?content_type=cake&select=sys.id,sys.version,fields.slug,fields.title,fields.categories&limit=${limit}&skip=${skip}`)
    if (!data) break
    total = data.total
    entries.push(...data.items)
    skip += limit
  }

  console.log(`Found ${entries.length} cake entries total`)

  // 3. Find cakes without categories
  const missing = []
  const alreadySet = []

  for (const entry of entries) {
    const cats = entry.fields.categories?.['en-US']
    if (cats && cats.length > 0) {
      alreadySet.push(entry)
      continue
    }
    missing.push(entry)
  }

  console.log(`${alreadySet.length} cakes already have categories`)
  console.log(`${missing.length} cakes are missing categories\n`)

  // 4. Match and update
  let updated = 0
  let unmatched = 0
  const unmatchedList = []

  for (const entry of missing) {
    const slug = entry.fields.slug?.['en-US']
    const title = entry.fields.title?.['en-US'] ?? '(no title)'

    // Try matching: normalized slug first, then title
    let catSlug = categoryLookup.get(slug)
    if (!catSlug) catSlug = categoryLookup.get(title?.toLowerCase())

    if (!catSlug) {
      unmatchedList.push({ title, slug })
      unmatched++
      continue
    }

    const catId = categoryIdBySlug.get(catSlug)
    if (!catId) {
      console.log(`  WARNING: Category slug "${catSlug}" not found in Contentful for "${title}"`)
      unmatchedList.push({ title, slug, reason: `category "${catSlug}" not in Contentful` })
      unmatched++
      continue
    }

    console.log(`  ${title} → ${catSlug}`)

    if (DRY_RUN) { updated++; continue }

    // Fetch full entry to get all fields
    const fullEntry = await api(`/entries/${entry.sys.id}`)
    if (!fullEntry) continue

    // Set category link
    const putData = await api(`/entries/${entry.sys.id}`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(fullEntry.sys.version) },
      body: JSON.stringify({
        fields: {
          ...fullEntry.fields,
          categories: {
            'en-US': [{
              sys: { type: 'Link', linkType: 'Entry', id: catId }
            }]
          }
        }
      }),
    })

    if (putData) {
      // Publish
      await api(`/entries/${entry.sys.id}/published`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(putData.sys.version) },
      })
      updated++
    }
  }

  if (unmatchedList.length > 0) {
    console.log(`\n--- UNMATCHED CAKES (${unmatchedList.length}) ---`)
    for (const u of unmatchedList) {
      console.log(`  "${u.title}" (slug: ${u.slug})${u.reason ? ` — ${u.reason}` : ''}`)
    }
  }

  console.log(`\nDone: ${updated} updated, ${unmatched} unmatched, ${alreadySet.length} already had categories${DRY_RUN ? ' (dry run)' : ''}`)
}

main().catch(console.error)
