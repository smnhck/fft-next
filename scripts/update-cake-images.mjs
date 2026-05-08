/**
 * Update Contentful cake entries with thumbnail image URLs from scraped data.
 * These URLs will be served through Cloudinary's fetch delivery for previews.
 *
 * Usage: node scripts/update-cake-images.mjs [--dry-run]
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
const LOCALE = 'en-US'
const DRY_RUN = process.argv.includes('--dry-run')

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${CMA_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      ...options.headers,
    },
  })
  return res
}

async function getAllCakeEntries() {
  const entries = []
  let skip = 0
  const limit = 100

  while (true) {
    const res = await api(`/entries?content_type=cake&limit=${limit}&skip=${skip}`)
    const data = await res.json()
    if (!data.items) break
    entries.push(...data.items)
    if (entries.length >= data.total) break
    skip += limit
  }

  return entries
}

async function main() {
  console.log(DRY_RUN ? '🏃 DRY RUN — no changes will be made\n' : '')

  // Load scraped data
  const scraped = JSON.parse(readFileSync('./scripts/scraped-cakes.json', 'utf-8'))
  const thumbnailMap = new Map()
  for (const cake of scraped.cakes) {
    if (cake.thumbnailUrl) {
      thumbnailMap.set(cake.slug, cake.thumbnailUrl)
    }
  }
  console.log(`Loaded ${thumbnailMap.size} thumbnail URLs from scraped data\n`)

  // Fetch all cake entries from Contentful
  const entries = await getAllCakeEntries()
  console.log(`Found ${entries.length} cake entries in Contentful\n`)

  let updated = 0
  let skipped = 0
  let noImage = 0

  for (const entry of entries) {
    const slug = entry.fields.slug?.[LOCALE]
    if (!slug) {
      skipped++
      continue
    }

    const thumbnailUrl = thumbnailMap.get(slug)
    if (!thumbnailUrl) {
      noImage++
      continue
    }

    // Check if images field already has data
    const currentImages = entry.fields.images?.[LOCALE]
    if (currentImages && currentImages.length > 0 && currentImages[0].url) {
      skipped++
      continue
    }

    // Set images field with thumbnail URL
    const newImages = [{ url: thumbnailUrl, alt: entry.fields.title?.[LOCALE] || slug }]

    if (DRY_RUN) {
      console.log(`  Would update: ${slug} → ${thumbnailUrl}`)
      updated++
      continue
    }

    // Update entry
    entry.fields.images = { [LOCALE]: newImages }

    const version = entry.sys.version
    const putRes = await api(`/entries/${entry.sys.id}`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(version) },
      body: JSON.stringify({ fields: entry.fields }),
    })

    if (!putRes.ok) {
      const err = await putRes.json()
      console.error(`  ✗ Failed ${slug}:`, err.message || JSON.stringify(err))
      continue
    }

    // Publish the updated entry
    const updatedEntry = await putRes.json()
    const publishRes = await api(`/entries/${entry.sys.id}/published`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(updatedEntry.sys.version) },
    })

    if (publishRes.ok) {
      updated++
      if (updated % 20 === 0) console.log(`  Progress: ${updated} updated`)
    } else {
      const err = await publishRes.json()
      console.warn(`  ⚠ Updated but failed to publish ${slug}:`, err.message || '')
      updated++
    }

    // Rate limit: ~5 req/sec
    await new Promise(r => setTimeout(r, 400))
  }

  console.log(`\n✓ Done`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Skipped (already had images): ${skipped}`)
  console.log(`  No thumbnail available: ${noImage}`)
}

main().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})
