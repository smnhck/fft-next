/**
 * Normalize all cake slugs to URL-safe characters only (a-z, 0-9, hyphens).
 * Replaces German umlauts, typographic quotes, ampersands, etc.
 *
 * Usage: node scripts/normalize-slugs.mjs [--dry-run]
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
    const data = await res.json()
    console.error(`API error ${res.status} for ${path}:`, data.message || JSON.stringify(data))
    return null
  }
  return res.json()
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
    // Remove typographic quotes
    .replace(/[\u201E\u201C\u201D\u201F\u201A\u2018\u2019\u0022\u0027\u2032\u2033]/g, '')
    // Replace & with "und"
    .replace(/&/g, 'und')
    // Replace any remaining non-slug chars with hyphens
    .replace(/[^a-z0-9-]/g, '-')
    // Collapse multiple hyphens
    .replace(/-{2,}/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
}

async function main() {
  // Fetch all cake entries
  let skip = 0
  const limit = 100
  let total = Infinity
  const entries = []

  while (skip < total) {
    const data = await api(`/entries?content_type=cake&select=sys.id,sys.version,fields.slug,fields.title&limit=${limit}&skip=${skip}`)
    if (!data) break
    total = data.total
    entries.push(...data.items)
    skip += limit
  }

  console.log(`Found ${entries.length} cake entries`)

  let updated = 0
  let skipped = 0

  for (const entry of entries) {
    const oldSlug = entry.fields.slug?.['en-US']
    if (!oldSlug) { skipped++; continue }

    const newSlug = normalizeSlug(oldSlug)
    if (newSlug === oldSlug) { skipped++; continue }

    const title = entry.fields.title?.['en-US'] ?? '(no title)'
    console.log(`  ${title}`)
    console.log(`    ${oldSlug} -> ${newSlug}`)

    if (DRY_RUN) { updated++; continue }

    // Update the entry
    const putData = await api(`/entries/${entry.sys.id}`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(entry.sys.version) },
      body: JSON.stringify({
        fields: { ...entry.fields, slug: { 'en-US': newSlug } },
      }),
    })

    if (putData) {
      // Publish the updated entry
      await api(`/entries/${entry.sys.id}/published`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(putData.sys.version) },
      })
      updated++
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} unchanged${DRY_RUN ? ' (dry run)' : ''}`)
}

main().catch(console.error)
