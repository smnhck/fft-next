/**
 * Migrate delta between live website data and Contentful CMS.
 *
 * Actions:
 *   1. Create new cake entries (8 new cakes)
 *   2. Delete removed cake (Nougat Cake Pops mit Marzipan)
 *   3. Update missing teasers (45 cakes)
 *   4. Upload missing images to Cloudinary + update Contentful (56 cakes)
 *   5. Fix "and" -> "und" slug inconsistency (11 cakes)
 *
 * Usage: node scripts/migrate-delta.mjs [--dry-run] [--skip-images]
 */

import { readFileSync } from 'fs'

// ─── Config ──────────────────────────────────────────────────────────────────
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
const LIVE_BASE_URL = 'https://franzis-fabelhafte-toertchen.de'

const CLOUDINARY_CLOUD = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_KEY = env.CLOUDINARY_API_KEY
const CLOUDINARY_SECRET = env.CLOUDINARY_API_SECRET

const DRY_RUN = process.argv.includes('--dry-run')
const SKIP_IMAGES = process.argv.includes('--skip-images')

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
    try {
      const data = JSON.parse(text)
      console.error(`  API error ${res.status} for ${path}:`, data.message || text.slice(0, 200))
    } catch {
      console.error(`  API error ${res.status} for ${path}:`, text.slice(0, 200))
    }
    return null
  }
  // Some responses (e.g. DELETE) return no body
  const text = await res.text()
  if (!text) return { ok: true }
  return JSON.parse(text)
}

function normalizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/ê/g, 'e').replace(/é/g, 'e').replace(/è/g, 'e')
    .replace(/â/g, 'a').replace(/à/g, 'a').replace(/ô/g, 'o').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/[\u201E\u201C\u201D\u201F\u201A\u2018\u2019\u0022\u0027\u2032\u2033]/g, '')
    .replace(/&/g, 'und')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uploadToCloudinary(imageUrl, publicId) {
  const timestamp = Math.floor(Date.now() / 1000)
  const { createHash } = await import('crypto')
  const signStr = `folder=fft&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_SECRET}`
  const signature = createHash('sha1').update(signStr).digest('hex')

  const form = new URLSearchParams()
  form.append('file', imageUrl)
  form.append('public_id', publicId)
  form.append('folder', 'fft')
  form.append('timestamp', String(timestamp))
  form.append('api_key', CLOUDINARY_KEY)
  form.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const err = await res.text()
    console.error(`  Cloudinary upload error:`, err.slice(0, 200))
    return null
  }
  return res.json()
}

// ─── Load data ───────────────────────────────────────────────────────────────

function loadJson(path) {
  const raw = JSON.parse(readFileSync(path, 'utf-8'))
  // PHPMyAdmin export format: array with header, database, then table with data
  const tableEntry = raw.find(r => r.type === 'table')
  return tableEntry?.data ?? raw
}

const liveCakes = loadJson('migration/cakes_new.json')
const liveImages = loadJson('migration/cake_images_new.json')

// Build image lookup: cake_id -> sorted images
const imagesByCakeId = {}
for (const img of liveImages) {
  if (!imagesByCakeId[img.cake_id]) imagesByCakeId[img.cake_id] = []
  imagesByCakeId[img.cake_id].push(img)
}
for (const id of Object.keys(imagesByCakeId)) {
  imagesByCakeId[id].sort((a, b) => Number(a.priority || 0) - Number(b.priority || 0))
}

// Build live lookup by normalized slug
const liveLookup = new Map()
for (const cake of liveCakes) {
  const norm = normalizeSlug(cake.identifier)
  liveLookup.set(norm, cake)
}

// Category slug -> Contentful entry ID mapping
const categoryMap = {}

async function fetchCategoryIds() {
  const data = await api('/entries?content_type=category&select=sys.id,fields.slug&limit=20')
  if (!data) return
  for (const item of data.items) {
    const slug = item.fields.slug?.[LOCALE]
    if (slug) categoryMap[slug] = item.sys.id
  }
}

async function fetchAllCFEntries() {
  let skip = 0
  const limit = 100
  const entries = []
  let total = Infinity
  while (skip < total) {
    const data = await api(`/entries?content_type=cake&limit=${limit}&skip=${skip}`)
    if (!data) break
    total = data.total
    entries.push(...data.items)
    skip += limit
  }
  return entries
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Starting migration...`)
  console.log(`Skip images: ${SKIP_IMAGES}`)

  await fetchCategoryIds()
  console.log(`Category map:`, categoryMap)

  const cfEntries = await fetchAllCFEntries()
  console.log(`Fetched ${cfEntries.length} Contentful entries`)

  // Build CF lookup by normalized slug
  const cfLookup = new Map()
  for (const entry of cfEntries) {
    const slug = entry.fields.slug?.[LOCALE]
    if (slug) cfLookup.set(slug, entry)
  }

  // Also build a lookup with further normalization for matching
  // (handles cases like birthday-queens-cake vs birthday-queen-s-cake)
  const cfByNormSlug = new Map()
  for (const entry of cfEntries) {
    const slug = entry.fields.slug?.[LOCALE]
    if (slug) cfByNormSlug.set(slug, entry)
  }

  let stats = { created: 0, deleted: 0, teaserUpdated: 0, imagesUpdated: 0, slugFixed: 0, errors: 0 }

  // ──── 1. Fix "and" -> "und" slugs ─────────────────────────────────────────
  console.log('\n── Fixing "and" -> "und" slugs ──')
  for (const entry of cfEntries) {
    const slug = entry.fields.slug?.[LOCALE]
    if (!slug || !slug.includes('-and-')) continue
    const newSlug = slug.replace(/-and-/g, '-und-')
    // Verify the new slug doesn't already exist
    if (cfLookup.has(newSlug)) {
      console.log(`  SKIP ${slug} -> ${newSlug} (already exists)`)
      continue
    }
    console.log(`  ${slug} -> ${newSlug}`)
    // Always update in-memory lookups so subsequent steps see the new slugs
    cfLookup.delete(slug)
    cfLookup.set(newSlug, entry)
    cfByNormSlug.delete(slug)
    cfByNormSlug.set(newSlug, entry)
    entry.fields.slug[LOCALE] = newSlug

    if (!DRY_RUN) {
      const updated = await api(`/entries/${entry.sys.id}`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(entry.sys.version) },
        body: JSON.stringify({ fields: entry.fields }),
      })
      if (updated) {
        await api(`/entries/${entry.sys.id}/published`, {
          method: 'PUT',
          headers: { 'X-Contentful-Version': String(updated.sys.version) },
        })
        stats.slugFixed++
      } else {
        stats.errors++
      }
    } else {
      stats.slugFixed++
    }
  }

  // ──── 2. Delete removed cake ──────────────────────────────────────────────
  console.log('\n── Deleting removed cakes ──')
  for (const [slug, entry] of cfLookup) {
    const norm = normalizeSlug(slug)
    if (!liveLookup.has(norm) && !liveLookup.has(slug)) {
      // Check if it's truly not in live data with fuzzy match
      const title = entry.fields.title?.[LOCALE] ?? slug
      console.log(`  DELETE: "${title}" (slug: ${slug})`)
      if (!DRY_RUN) {
        // Unpublish first
        await api(`/entries/${entry.sys.id}/published`, { method: 'DELETE' })
        // Then delete
        const deleted = await api(`/entries/${entry.sys.id}`, { method: 'DELETE' })
        if (deleted !== null || deleted === undefined) {
          stats.deleted++
        } else {
          stats.errors++
        }
      } else {
        stats.deleted++
      }
    }
  }

  // Rebuild CF lookup after deletions (refresh for matching)
  // Re-fetch to get updated versions
  const cfEntriesRefreshed = DRY_RUN ? cfEntries : await fetchAllCFEntries()
  const cfRefreshed = new Map()
  for (const entry of cfEntriesRefreshed) {
    const slug = entry.fields.slug?.[LOCALE]
    if (slug) cfRefreshed.set(slug, entry)
  }

  // ──── 3. Create new cakes ─────────────────────────────────────────────────
  console.log('\n── Creating new cakes ──')
  for (const [normSlug, liveCake] of liveLookup) {
    // Check if exists in CF (try both normalized and raw)
    if (cfRefreshed.has(normSlug)) continue

    // Also try matching with slightly different normalization
    let found = false
    for (const cfSlug of cfRefreshed.keys()) {
      if (cfSlug === normSlug || normalizeSlug(cfSlug) === normSlug) {
        found = true
        break
      }
    }
    if (found) continue

    const catSlug = normalizeSlug(liveCake.category || '')
    const catId = categoryMap[catSlug]
    const slug = normSlug

    console.log(`  CREATE: "${liveCake.title}" (slug: ${slug}, category: ${catSlug})`)

    if (!DRY_RUN) {
      const fields = {
        title: { [LOCALE]: liveCake.title },
        slug: { [LOCALE]: slug },
        teaser: { [LOCALE]: liveCake.teaser_text || '' },
      }
      if (catId) {
        fields.categories = {
          [LOCALE]: [{ sys: { type: 'Link', linkType: 'Entry', id: catId } }]
        }
      }

      const created = await api('/entries', {
        method: 'POST',
        headers: { 'X-Contentful-Content-Type': 'cake' },
        body: JSON.stringify({ fields }),
      })
      if (created) {
        await api(`/entries/${created.sys.id}/published`, {
          method: 'PUT',
          headers: { 'X-Contentful-Version': String(created.sys.version) },
        })
        stats.created++
        // Add to refreshed map for image upload step
        cfRefreshed.set(slug, created)
      } else {
        stats.errors++
      }
    } else {
      stats.created++
    }
  }

  // ──── 4. Update missing teasers ───────────────────────────────────────────
  console.log('\n── Updating missing teasers ──')
  // Re-fetch entries to get latest versions
  const cfFinal = DRY_RUN ? cfEntriesRefreshed : await fetchAllCFEntries()
  const cfFinalMap = new Map()
  for (const entry of cfFinal) {
    const slug = entry.fields.slug?.[LOCALE]
    if (slug) cfFinalMap.set(slug, entry)
  }

  for (const [normSlug, liveCake] of liveLookup) {
    const cfEntry = cfFinalMap.get(normSlug)
    if (!cfEntry) continue

    const cfTeaser = cfEntry.fields.teaser?.[LOCALE]?.trim()
    const liveTeaser = liveCake.teaser_text?.trim()

    if (!liveTeaser) continue
    if (cfTeaser) continue // Already has a teaser

    const title = cfEntry.fields.title?.[LOCALE] ?? normSlug
    console.log(`  TEASER: "${title}"`)

    if (!DRY_RUN) {
      if (!cfEntry.fields.teaser) cfEntry.fields.teaser = {}
      cfEntry.fields.teaser[LOCALE] = liveTeaser

      const updated = await api(`/entries/${cfEntry.sys.id}`, {
        method: 'PUT',
        headers: { 'X-Contentful-Version': String(cfEntry.sys.version) },
        body: JSON.stringify({ fields: cfEntry.fields }),
      })
      if (updated) {
        await api(`/entries/${cfEntry.sys.id}/published`, {
          method: 'PUT',
          headers: { 'X-Contentful-Version': String(updated.sys.version) },
        })
        stats.teaserUpdated++
        // Update version for subsequent operations
        cfEntry.sys.version = updated.sys.version + 1
      } else {
        stats.errors++
      }
    } else {
      stats.teaserUpdated++
    }
  }

  // ──── 5. Upload missing images ────────────────────────────────────────────
  if (!SKIP_IMAGES) {
    console.log('\n── Uploading missing images ──')

    // Re-fetch to get latest versions after teaser updates
    const cfForImages = DRY_RUN ? cfFinal : await fetchAllCFEntries()
    const cfImgMap = new Map()
    for (const entry of cfForImages) {
      const slug = entry.fields.slug?.[LOCALE]
      if (slug) cfImgMap.set(slug, entry)
    }

    for (const [normSlug, liveCake] of liveLookup) {
      const cfEntry = cfImgMap.get(normSlug)
      if (!cfEntry) continue

      const cfImages = cfEntry.fields.images?.[LOCALE]
      const cfImageCount = Array.isArray(cfImages) ? cfImages.length : (cfImages ? 1 : 0)

      const liveImgs = imagesByCakeId[liveCake.id] || []
      if (liveImgs.length === 0) continue
      if (cfImageCount >= liveImgs.length) continue

      const title = cfEntry.fields.title?.[LOCALE] ?? normSlug
      console.log(`  IMAGES: "${title}" (CF: ${cfImageCount}, Live: ${liveImgs.length})`)

      if (!DRY_RUN) {
        // Upload all images from live site to Cloudinary and build the images array
        const newImages = []

        for (const img of liveImgs) {
          const filename = img.path.split('/').pop().replace(/\.[^.]+$/, '')
          const imageUrl = `${LIVE_BASE_URL}${img.path}`
          const publicId = filename

          console.log(`    Uploading ${filename}...`)
          const result = await uploadToCloudinary(imageUrl, publicId)
          if (result) {
            newImages.push({
              public_id: result.public_id,
              resource_type: result.resource_type,
              type: result.type,
              format: result.format,
              version: result.version,
              url: result.url,
              secure_url: result.secure_url,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
              created_at: result.created_at,
              context: { custom: { alt: img.alt_text || title } },
            })
          }
        }

        if (newImages.length > 0) {
          if (!cfEntry.fields.images) cfEntry.fields.images = {}
          cfEntry.fields.images[LOCALE] = newImages

          const updated = await api(`/entries/${cfEntry.sys.id}`, {
            method: 'PUT',
            headers: { 'X-Contentful-Version': String(cfEntry.sys.version) },
            body: JSON.stringify({ fields: cfEntry.fields }),
          })
          if (updated) {
            await api(`/entries/${cfEntry.sys.id}/published`, {
              method: 'PUT',
              headers: { 'X-Contentful-Version': String(updated.sys.version) },
            })
            stats.imagesUpdated++
          } else {
            stats.errors++
          }
        }
      } else {
        stats.imagesUpdated++
      }
    }
  }

  // ──── Summary ─────────────────────────────────────────────────────────────
  console.log(`\n── Summary ${DRY_RUN ? '(DRY RUN)' : ''} ──`)
  console.log(`  Slugs fixed (and->und): ${stats.slugFixed}`)
  console.log(`  Entries deleted: ${stats.deleted}`)
  console.log(`  Entries created: ${stats.created}`)
  console.log(`  Teasers updated: ${stats.teaserUpdated}`)
  console.log(`  Images updated: ${stats.imagesUpdated}`)
  console.log(`  Errors: ${stats.errors}`)
}

main().catch(console.error)
