/**
 * Scrape all cakes from the live FFT website
 *
 * Strategy: collect all /toertchen/ slugs from category listing pages,
 * then scrape each detail page for accurate title, description, and images.
 *
 * Usage: node scripts/scrape-cakes.mjs
 * Output: scripts/scraped-cakes.json
 */

import { writeFileSync } from 'fs'

const BASE_URL = 'https://franzis-fabelhafte-toertchen.de'

const CATEGORIES = [
  { slug: 'torten-und-toertchen', title: 'Torten & Törtchen' },
  { slug: 'hochzeitstorten', title: 'Hochzeitstorten' },
  { slug: 'flaumiges-hefegebaeck', title: 'Flaumiges Hefegebäck' },
  { slug: 'kuchen-und-muffins', title: 'Kuchen, Muffins & Cupcakes' },
  { slug: 'plaetzchen-kekse-und-kleingebaeck', title: 'Plätzchen, Kekse & Kleingebäck' },
  { slug: 'cake-pops', title: 'Cake Pops' },
]

async function fetchHTML(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

/** Extract unique /toertchen/ slugs from a category listing page */
function extractSlugsFromListing(html) {
  const slugs = new Set()
  const pattern = /href="\/toertchen\/([^"]+)"/g
  let m
  while ((m = pattern.exec(html)) !== null) {
    let slug = m[1].replace(/\/$/, '')
    // Decode HTML entities
    slug = slug.replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    slugs.add(slug)
  }
  return [...slugs]
}

/** Extract thumbnail image URLs from listing page, paired with slugs */
function extractThumbnails(html) {
  const thumbnails = {}
  // Look for patterns where an image is inside an <a> linking to /toertchen/
  const cardPattern = /<a[^>]*href="\/toertchen\/([^"]+)"[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*>/gi
  let m
  while ((m = cardPattern.exec(html)) !== null) {
    let slug = m[1].replace(/\/$/, '').replace(/&amp;/g, '&')
    const imgUrl = m[2]
    if (!thumbnails[slug]) {
      thumbnails[slug] = imgUrl.startsWith('http') ? imgUrl : `${BASE_URL}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`
    }
  }
  return thumbnails
}

/** Scrape a cake detail page for title, teaser, description, images */
async function scrapeDetailPage(slug) {
  const url = `${BASE_URL}/toertchen/${encodeURIComponent(slug).replace(/%26/g, '&')}`
  const html = await fetchHTML(url)

  // Extract title from <h1> or first large heading
  let title = ''
  const h1Match = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html)
  if (h1Match) {
    title = h1Match[1].replace(/<[^>]+>/g, '').trim()
  }

  // Extract teaser/ingredients from a list or structured content
  let teaser = ''
  // Look for ingredient list (often in <ul> or repeated <p> near the content)
  const listPattern = /<ul[^>]*class="[^"]*ingredient[^"]*"[^>]*>([\s\S]*?)<\/ul>/i
  const listMatch = listPattern.exec(html)
  if (listMatch) {
    teaser = listMatch[1]
      .replace(/<li[^>]*>/gi, '')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .join('\n')
  }

  // Extract description — look for main content paragraphs
  let description = ''
  // Try: paragraph(s) after the h1
  const contentAfterH1 = html.split(/<\/h1>/i)[1] || ''
  const paragraphs = contentAfterH1.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || []
  const descParts = paragraphs
    .map(p => p.replace(/<[^>]+>/g, '').trim())
    .filter(t => t.length > 10 && !t.includes('©') && !t.includes('Impressum'))
    .slice(0, 3)
  if (descParts.length) {
    description = descParts.join(' ')
  }

  // Extract images
  const images = []
  const imgPattern = /src="([^"]*(?:storage\/uploads)[^"]*)"/gi
  let imgM
  while ((imgM = imgPattern.exec(html)) !== null) {
    const imgUrl = imgM[1]
    images.push(imgUrl.startsWith('http') ? imgUrl : `${BASE_URL}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`)
  }

  return { title, teaser, description, images }
}

async function main() {
  console.log('Scraping cakes from franzis-fabelhafte-toertchen.de')
  console.log('===================================================\n')

  // Phase 1: Collect all slugs per category
  const slugsByCategory = new Map()

  for (const category of CATEGORIES) {
    console.log(`Scanning category: ${category.title} (/${category.slug})...`)
    try {
      const html = await fetchHTML(`${BASE_URL}/${category.slug}`)
      const slugs = extractSlugsFromListing(html)
      const thumbnails = extractThumbnails(html)
      slugsByCategory.set(category.slug, { slugs, thumbnails })
      console.log(`  Found ${slugs.length} entries`)
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`)
      slugsByCategory.set(category.slug, { slugs: [], thumbnails: {} })
    }
  }

  const totalSlugs = [...slugsByCategory.values()].reduce((sum, v) => sum + v.slugs.length, 0)
  console.log(`\nTotal slugs found: ${totalSlugs}`)

  // Phase 2: Scrape each detail page
  console.log('\nScraping detail pages...\n')
  const allCakes = []
  let scraped = 0
  let failed = 0

  for (const category of CATEGORIES) {
    const { slugs, thumbnails } = slugsByCategory.get(category.slug)

    for (const slug of slugs) {
      try {
        const detail = await scrapeDetailPage(slug)

        allCakes.push({
          title: detail.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          slug,
          teaser: detail.teaser,
          description: detail.description,
          category: { slug: category.slug, title: category.title },
          thumbnailUrl: thumbnails[slug] || null,
          images: detail.images,
        })

        scraped++
        if (scraped % 10 === 0) {
          console.log(`  Progress: ${scraped}/${totalSlugs}`)
        }
      } catch (err) {
        console.warn(`  ⚠ Failed: ${slug} — ${err.message}`)
        // Still add with fallback title
        allCakes.push({
          title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          slug,
          teaser: '',
          description: '',
          category: { slug: category.slug, title: category.title },
          thumbnailUrl: thumbnails[slug] || null,
          images: [],
          scrapeError: err.message,
        })
        failed++
        scraped++
      }

      // Polite delay
      await new Promise(r => setTimeout(r, 200))
    }
  }

  // Write output
  const output = {
    scrapedAt: new Date().toISOString(),
    totalCakes: allCakes.length,
    failedDetailPages: failed,
    categories: CATEGORIES,
    cakes: allCakes,
  }

  writeFileSync('scripts/scraped-cakes.json', JSON.stringify(output, null, 2))
  console.log(`\n✓ Saved ${allCakes.length} cakes to scripts/scraped-cakes.json`)
  console.log(`  (${failed} detail pages failed — titles derived from slug)`)

  // Summary
  console.log('\nSummary:')
  for (const cat of CATEGORIES) {
    const count = allCakes.filter(c => c.category.slug === cat.slug).length
    console.log(`  ${cat.title}: ${count} entries`)
  }
}

main().catch(err => {
  console.error('Scraping failed:', err)
  process.exit(1)
})
