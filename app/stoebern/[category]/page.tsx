import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllCategories, getCakesByCategory, getAllCakes } from '@/lib/api'
import CakesGallery from '@/components/molecules/cakesGallery'

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map(cat => ({ category: cat.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> {
  const categories = await getAllCategories()
  const category = categories.find(c => c.slug === params.category)
  const title = category?.title ?? params.category
  return {
    title,
    description: `Entdecke Franzis ${title} — handgemacht in Gießen mit Liebe und Leidenschaft.`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const categories = await getAllCategories()
  const category = categories.find(c => c.slug === params.category)

  if (!category) notFound()

  // Try category-filtered query, fall back to all cakes filtered client-side
  let cakes = await getCakesByCategory(params.category)
  if (!cakes.length) {
    const allCakes = await getAllCakes(500)
    cakes = allCakes.filter(cake =>
      cake.categoriesCollection?.items.some(c => c.slug === params.category)
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {category.title}
      </h1>
      {category.description && (
        <p className="text-gray-600 mb-8 max-w-2xl">{category.description}</p>
      )}
      <CakesGallery cakes={cakes} showCategoryFilter={false} />
    </main>
  )
}
