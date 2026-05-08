// ─── Types ──────────────────────────────────────────────────────────────────

export interface CakeImage {
  url: string
  alt?: string
}

export interface CategoryImage {
  public_id: string
  context?: { custom?: { alt?: string } }
}

export interface Category {
  sys: { id: string }
  title: string
  slug: string
  description?: string
  image?: CategoryImage[]
  sortOrder?: number
}

export interface Cake {
  sys: { id: string }
  title: string
  slug: string
  teaser?: string
  description?: { json: unknown }
  categoriesCollection?: { items: Category[] }
  images?: CakeImage[]
  featured?: boolean
  servings?: number
  allergens?: string[]
  sortOrder?: number
}

export interface Testimonial {
  sys: { id: string }
  quote: string
  author: string
  rating?: number
  date?: string
}

export interface StaticPage {
  sys: { id: string }
  title: string
  slug: string
  content?: { json: unknown }
  seoTitle?: string
  seoDescription?: string
}

// ─── GraphQL Fragments ─────────────────────────────────────────────────────

// Lightweight fields for list views (no description rich text)
const CAKE_LIST_FIELDS = `
  sys { id }
  title
  slug
  teaser
  categoriesCollection {
    items {
      sys { id }
      title
      slug
    }
  }
  images
  featured
  sortOrder
`

// Full fields including rich text description
const CAKE_FIELDS = `
  sys { id }
  title
  slug
  teaser
  description { json }
  categoriesCollection {
    items {
      sys { id }
      title
      slug
    }
  }
  images
  featured
  servings
  allergens
  sortOrder
`

const CATEGORY_FIELDS = `
  sys { id }
  title
  slug
  description
  image
  sortOrder
`

const TESTIMONIAL_FIELDS = `
  sys { id }
  quote
  author
  rating
  date
`

const STATIC_PAGE_FIELDS = `
  sys { id }
  title
  slug
  content { json }
  seoTitle
  seoDescription
`

// ─── Fetch helper ───────────────────────────────────────────────────────────

async function fetchGraphQL(
  query: string,
  preview = false,
  tags: string[] = ['cakes'],
) {
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
      next: { tags },
    },
  )
  const json = await res.json()
  if (json.errors) {
    console.error('Contentful GraphQL errors:', JSON.stringify(json.errors))
  }
  return json
}

// ─── Cake queries ───────────────────────────────────────────────────────────

export async function getAllCakes(
  limit = 100,
  isDraftMode = false,
): Promise<Cake[]> {
  // Contentful GraphQL has a complexity limit. Paginate in batches of 100.
  const batchSize = Math.min(limit, 100)
  const allItems: Cake[] = []
  let skip = 0

  while (allItems.length < limit) {
    const res = await fetchGraphQL(
      `query {
        cakeCollection(
          where: { slug_exists: true }
          order: title_ASC
          limit: ${batchSize}
          skip: ${skip}
          preview: ${isDraftMode}
        ) {
          total
          items { ${CAKE_LIST_FIELDS} }
        }
      }`,
      isDraftMode,
    )
    const items = res?.data?.cakeCollection?.items ?? []
    const total = res?.data?.cakeCollection?.total ?? 0
    allItems.push(...items)
    skip += batchSize
    if (items.length < batchSize || allItems.length >= total) break
  }

  return allItems.slice(0, limit)
}

export async function getCakesByCategory(
  categorySlug: string,
  limit = 100,
  isDraftMode = false,
): Promise<Cake[]> {
  const res = await fetchGraphQL(
    `query {
      cakeCollection(
        where: {
          slug_exists: true
          categories: { slug: "${categorySlug}" }
        }
        order: sortOrder_ASC
        limit: ${limit}
        preview: ${isDraftMode}
      ) {
        items { ${CAKE_LIST_FIELDS} }
      }
    }`,
    isDraftMode,
  )
  return res?.data?.cakeCollection?.items ?? []
}

export async function getFeaturedCakes(
  limit = 9,
  isDraftMode = false,
): Promise<Cake[]> {
  const res = await fetchGraphQL(
    `query {
      cakeCollection(
        where: { featured: true, slug_exists: true }
        order: sortOrder_ASC
        limit: ${limit}
        preview: ${isDraftMode}
      ) {
        items { ${CAKE_LIST_FIELDS} }
      }
    }`,
    isDraftMode,
  )
  return res?.data?.cakeCollection?.items ?? []
}

export async function getCake(
  slug: string,
  isDraftMode = false,
): Promise<Cake | undefined> {
  const res = await fetchGraphQL(
    `query {
      cakeCollection(
        where: { slug: "${slug}" }
        limit: 1
        preview: ${isDraftMode}
      ) {
        items { ${CAKE_FIELDS} }
      }
    }`,
    isDraftMode,
  )
  return res?.data?.cakeCollection?.items?.[0]
}

// ─── Stage queries ──────────────────────────────────────────────────────────

export interface Stage {
  backgroundImage?: CategoryImage[]
}

export async function getStage(
  isDraftMode = false,
): Promise<Stage | undefined> {
  const res = await fetchGraphQL(
    `query {
      stageCollection(
        limit: 1
        preview: ${isDraftMode}
      ) {
        items {
          backgroundImage
        }
      }
    }`,
    isDraftMode,
    ['stage'],
  )
  return res?.data?.stageCollection?.items?.[0]
}

// ─── Image Break queries ────────────────────────────────────────────────────

export interface ImageBreak {
  title: string
  text: string
  image?: CategoryImage[]
}

export async function getImageBreak(
  isDraftMode = false,
): Promise<ImageBreak | undefined> {
  const res = await fetchGraphQL(
    `query {
      imageBreakCollection(
        limit: 1
        preview: ${isDraftMode}
      ) {
        items {
          title
          text
          image
        }
      }
    }`,
    isDraftMode,
    ['imageBreak'],
  )
  return res?.data?.imageBreakCollection?.items?.[0]
}

// ─── Category queries ───────────────────────────────────────────────────────

export async function getAllCategories(
  isDraftMode = false,
): Promise<Category[]> {
  const res = await fetchGraphQL(
    `query {
      categoryCollection(
        order: sortOrder_ASC
        preview: ${isDraftMode}
      ) {
        items { ${CATEGORY_FIELDS} }
      }
    }`,
    isDraftMode,
    ['categories'],
  )
  return res?.data?.categoryCollection?.items ?? []
}

export async function getCategory(
  slug: string,
  isDraftMode = false,
): Promise<Category | undefined> {
  const res = await fetchGraphQL(
    `query {
      categoryCollection(
        where: { slug: "${slug}" }
        limit: 1
        preview: ${isDraftMode}
      ) {
        items { ${CATEGORY_FIELDS} }
      }
    }`,
    isDraftMode,
    ['categories'],
  )
  return res?.data?.categoryCollection?.items?.[0]
}

// ─── Testimonial queries ────────────────────────────────────────────────────

export async function getAllTestimonials(
  isDraftMode = false,
): Promise<Testimonial[]> {
  const res = await fetchGraphQL(
    `query {
      testimonialCollection(
        order: date_DESC
        preview: ${isDraftMode}
      ) {
        items { ${TESTIMONIAL_FIELDS} }
      }
    }`,
    isDraftMode,
    ['testimonials'],
  )
  return res?.data?.testimonialCollection?.items ?? []
}

// ─── Static page queries ────────────────────────────────────────────────────

export async function getStaticPage(
  slug: string,
  isDraftMode = false,
): Promise<StaticPage | undefined> {
  const res = await fetchGraphQL(
    `query {
      staticPageCollection(
        where: { slug: "${slug}" }
        limit: 1
        preview: ${isDraftMode}
      ) {
        items { ${STATIC_PAGE_FIELDS} }
      }
    }`,
    isDraftMode,
    ['pages'],
  )
  return res?.data?.staticPageCollection?.items?.[0]
}
