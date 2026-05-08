import type { MetadataRoute } from 'next'
import { getAllCakes, getAllCategories } from '@/lib/api'

const BASE_URL = 'https://franzis-fabelhafte-toertchen.de'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cakes, categories] = await Promise.all([
    getAllCakes(500),
    getAllCategories(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/stoebern`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/kontakt`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ueber-mich`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/impressum`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/datenschutz`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/agb`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/stoebern/${cat.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const cakePages: MetadataRoute.Sitemap = cakes
    .filter((cake) => cake.categoriesCollection?.items?.[0]?.slug)
    .map((cake) => ({
      url: `${BASE_URL}/stoebern/${cake.categoriesCollection!.items[0].slug}/${cake.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [...staticPages, ...categoryPages, ...cakePages]
}
