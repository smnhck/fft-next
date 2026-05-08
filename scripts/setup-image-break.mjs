/**
 * 1. Create "Image Break" content type in Contentful
 * 2. Create an initial entry with current values
 * 3. Add reference to homepage
 *
 * Usage: node scripts/setup-image-break.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from 'fs'

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

async function main() {
  // Step 1: Check if content type already exists
  console.log('Checking if imageBreak content type exists...')
  const existing = await api('/content_types/imageBreak')

  if (!existing) {
    console.log('Creating "Image Break" content type...')
    if (!DRY_RUN) {
      const ct = await api('/content_types/imageBreak', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Image Break',
          description: 'Full-width image section with overlay text, used as a visual break on the homepage.',
          displayField: 'title',
          fields: [
            {
              id: 'title',
              name: 'Title',
              type: 'Symbol',
              required: true,
              localized: false,
              validations: [{ size: { max: 100 } }],
            },
            {
              id: 'text',
              name: 'Text',
              type: 'Symbol',
              required: true,
              localized: false,
              validations: [{ size: { max: 200 } }],
            },
            {
              id: 'image',
              name: 'Image',
              type: 'Object',
              required: false,
              localized: false,
            },
          ],
        }),
      })
      if (!ct) { console.error('Failed to create content type'); return }

      // Publish the content type
      const published = await api('/content_types/imageBreak/published', {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(ct.sys.version) },
      })
      if (!published) { console.error('Failed to publish content type'); return }
      console.log('Content type created and published.')
    } else {
      console.log('[DRY RUN] Would create imageBreak content type')
    }
  } else {
    console.log('Content type already exists.')
  }

  // Step 2: Check if an entry already exists
  console.log('\nChecking for existing imageBreak entries...')
  const entries = await api('/entries?content_type=imageBreak&limit=1')

  let entryId = entries?.items?.[0]?.sys?.id

  if (!entryId) {
    console.log('Creating initial Image Break entry...')
    if (!DRY_RUN) {
      const entry = await api('/entries', {
        method: 'POST',
        headers: { 'X-Contentful-Content-Type': 'imageBreak' },
        body: JSON.stringify({
          fields: {
            title: { 'en-US': 'Image Break' },
            text: { 'en-US': 'Backen. Leidenschaft.' },
          },
        }),
      })
      if (!entry) { console.error('Failed to create entry'); return }
      entryId = entry.sys.id

      // Publish
      const pub = await api(`/entries/${entryId}/published`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(entry.sys.version) },
      })
      if (!pub) { console.error('Failed to publish entry'); return }
      console.log(`Entry created and published: ${entryId}`)
    } else {
      console.log('[DRY RUN] Would create imageBreak entry with text "Backen. Leidenschaft."')
    }
  } else {
    console.log(`Entry already exists: ${entryId}`)
  }

  console.log('\nDone! Entry ID:', entryId || '(dry run)')
}

main().catch(console.error)
