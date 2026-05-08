/**
 * Contentful Content Type Migration
 *
 * Creates/updates content types: category (extend), testimonial (new), page (extend cake fields).
 * The existing Cake and Category types are already close to what we need.
 *
 * Usage: node scripts/migrate-content-types.mjs
 * Requires: CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in .env
 */

import { readFileSync } from 'fs'

// Load .env manually (no dotenv dependency needed)
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
    console.error(`API error ${res.status} for ${path}:`, JSON.stringify(data, null, 2))
    throw new Error(`API ${res.status}: ${data.message}`)
  }
  return data
}

async function getContentType(id) {
  const res = await fetch(`${BASE}/content_types/${id}`, {
    headers: {
      'Authorization': `Bearer ${CMA_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
    },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

async function upsertContentType(id, name, description, fields) {
  const existing = await getContentType(id)

  if (existing) {
    console.log(`  Updating existing content type: ${id}`)
    // Merge new fields with existing ones (don't remove existing fields)
    const existingFieldIds = new Set(existing.fields.map(f => f.id))
    const mergedFields = [...existing.fields]
    for (const field of fields) {
      if (!existingFieldIds.has(field.id)) {
        mergedFields.push(field)
        console.log(`    Adding field: ${field.id}`)
      }
    }

    const updated = await api(`/content_types/${id}`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(existing.sys.version) },
      body: JSON.stringify({ name, description, fields: mergedFields }),
    })

    // Activate
    await api(`/content_types/${id}/published`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(updated.sys.version) },
    })
    console.log(`  ✓ ${id} updated and published`)
  } else {
    console.log(`  Creating new content type: ${id}`)
    const created = await api(`/content_types/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        description,
        displayField: fields.find(f => f.id === 'title' || f.id === 'name')?.id || fields[0].id,
        fields,
      }),
    })

    // Activate
    await api(`/content_types/${id}/published`, {
      method: 'PUT',
      headers: { 'X-Contentful-Version': String(created.sys.version) },
    })
    console.log(`  ✓ ${id} created and published`)
  }
}

async function main() {
  console.log('Contentful Content Type Migration')
  console.log('==================================\n')

  // 1. Extend Cake with new fields
  console.log('1. Extending Cake content type...')
  const cakeNewFields = [
    {
      id: 'featured',
      name: 'Featured',
      type: 'Boolean',
      required: false,
      localized: false,
    },
    {
      id: 'servings',
      name: 'Servings',
      type: 'Integer',
      required: false,
      localized: false,
    },
    {
      id: 'allergens',
      name: 'Allergens',
      type: 'Array',
      required: false,
      localized: false,
      items: { type: 'Symbol' },
    },
    {
      id: 'sortOrder',
      name: 'Sort Order',
      type: 'Integer',
      required: false,
      localized: false,
    },
  ]
  await upsertContentType('cake', 'Cake', 'A cake or baked good entry', cakeNewFields)

  // 2. Extend Category with order field
  console.log('\n2. Extending Category content type...')
  const categoryNewFields = [
    {
      id: 'sortOrder',
      name: 'Sort Order',
      type: 'Integer',
      required: false,
      localized: false,
    },
  ]
  await upsertContentType('category', 'Category', 'A cake category', categoryNewFields)

  // 3. Create Testimonial content type
  console.log('\n3. Creating Testimonial content type...')
  const testimonialFields = [
    {
      id: 'quote',
      name: 'Quote',
      type: 'Text',
      required: true,
      localized: false,
    },
    {
      id: 'author',
      name: 'Author',
      type: 'Symbol',
      required: true,
      localized: false,
    },
    {
      id: 'rating',
      name: 'Rating',
      type: 'Integer',
      required: false,
      localized: false,
      validations: [{ range: { min: 1, max: 5 } }],
    },
    {
      id: 'date',
      name: 'Date',
      type: 'Date',
      required: false,
      localized: false,
    },
  ]
  await upsertContentType('testimonial', 'Testimonial', 'Customer testimonial / review', testimonialFields)

  // 4. Create a proper static Page content type (separate from existing Page which has stage reference)
  console.log('\n4. Creating StaticPage content type...')
  const staticPageFields = [
    {
      id: 'title',
      name: 'Title',
      type: 'Symbol',
      required: true,
      localized: false,
    },
    {
      id: 'slug',
      name: 'Slug',
      type: 'Symbol',
      required: true,
      localized: false,
      validations: [{ unique: true }],
    },
    {
      id: 'content',
      name: 'Content',
      type: 'RichText',
      required: false,
      localized: false,
    },
    {
      id: 'seoTitle',
      name: 'SEO Title',
      type: 'Symbol',
      required: false,
      localized: false,
    },
    {
      id: 'seoDescription',
      name: 'SEO Description',
      type: 'Symbol',
      required: false,
      localized: false,
    },
  ]
  await upsertContentType('staticPage', 'Static Page', 'Static content pages (Impressum, Datenschutz, Über mich)', staticPageFields)

  console.log('\n✓ All content types migrated successfully!')
}

main().catch(err => {
  console.error('\n✗ Migration failed:', err.message)
  process.exit(1)
})
