/**
 * Update the teaser field of all cakes in Contentful with the description
 * from the migration JSON files (cakes.json + cakes_new.json).
 *
 * Usage: node scripts/update-teasers.mjs [--dry-run]
 */

import { readFileSync } from 'fs'

const envFile = readFileSync('.env', 'utf-8')
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
    const idx = l.indexOf('=')
    return idx > 0 ? [l.substring(0, idx).trim(), l.substring(idx + 1).trim()] : null
  }).filter(Boolean)
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
  const text = await res.text()
  if (!res.ok) {
    let msg
    try { msg = JSON.parse(text).message } catch { msg = text }
    console.error(`API error ${res.status} for ${path}:`, msg)
    return null
  }
  return text ? JSON.parse(text) : null
}

function normalizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/ê/g, 'e').replace(/é/g, 'e').replace(/è/g, 'e')
    .replace(/â/g, 'a').replace(/à/g, 'a')
    .replace(/ô/g, 'o').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/[\u201E\u201C\u201D\u201F\u201A\u2018\u2019\u0022\u0027\u2032\u2033]/g, '')
    .replace(/&/g, 'und')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Build cake → description mapping from migration JSON files
function buildDescriptionLookup() {
  const lookup = new Map() // normalized slug → description

  for (const file of ['migration/cakes.json', 'migration/cakes_new.json']) {
    let raw
    try { raw = JSON.parse(readFileSync(file, 'utf-8')) } catch { continue }
    const tableEntry = raw.find(e => e.type === 'table')
    if (!tableEntry?.data) continue

    for (const cake of tableEntry.data) {
      if (!cake.identifier || !cake.description) continue
      const normalized = normalizeSlug(cake.identifier)
      lookup.set(normalized, cake.description)
      // Also by title for fuzzy matching
      if (cake.title) lookup.set(cake.title.toLowerCase(), cake.description)
    }
  }

  return lookup
}

async function main() {
  const descLookup = buildDescriptionLookup()
  console.log(`Built lookup with ${descLookup.size} entries from migration files`)

  // Fetch all cake entries
  let skip = 0
  const limit = 100
  let total = Infinity
  const entries = []

  while (skip < total) {
    const data = await api(`/entries?content_type=cake&select=sys.id,sys.version,fields.slug,fields.title,fields.teaser&limit=${limit}&skip=${skip}`)
    if (!data) break
    total = data.total
    entries.push(...data.items)
    skip += limit
  }

  console.log(`Found ${entries.length} cake entries in Contentful\n`)

  let updated = 0
  let skipped = 0
  let unmatched = 0
  const unmatchedList = []

  for (const entry of entries) {
    const slug = entry.fields.slug?.['en-US']
    const title = entry.fields.title?.['en-US'] ?? '(no title)'

    // Try matching by slug, then by title
    let description = descLookup.get(slug)
    if (!description) description = descLookup.get(title.toLowerCase())

    if (!description) {
      unmatchedList.push({ title, slug })
      unmatched++
      continue
    }

    const currentTeaser = entry.fields.teaser?.['en-US'] ?? ''
    if (currentTeaser === description) {
      skipped++
      continue
    }

    console.log(`  ${title}`)
    if (DRY_RUN) {
      console.log(`    OLD: ${currentTeaser.substring(0, 60)}...`)
      console.log(`    NEW: ${description.substring(0, 60)}...`)
    }

    if (DRY_RUN) { updated++; continue }

    // Fetch full entry for all fields
    const fullEntry = await api(`/entries/${entry.sys.id}`)
    if (!fullEntry) continue

    const putData = await api(`/entries/${entry.sys.id}`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(fullEntry.sys.version) },
      body: JSON.stringify({
        fields: {
          ...fullEntry.fields,
          teaser: { 'en-US': description },
        },
      }),
    })

    if (putData) {
      await api(`/entries/${entry.sys.id}/published`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(putData.sys.version) },
      })
      updated++
    }
  }

  if (unmatchedList.length > 0) {
    console.log(`\n--- UNMATCHED (${unmatchedList.length}) ---`)
    for (const u of unmatchedList) {
      console.log(`  "${u.title}" (slug: ${u.slug})`)
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} already correct, ${unmatched} unmatched${DRY_RUN ? ' (dry run)' : ''}`)
}

main().catch(console.error)
