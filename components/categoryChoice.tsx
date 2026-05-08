import { getAllCategories } from '@/lib/api'
import CategoryCard from './atoms/categoryCard'

export default async function CategoryChoice() {
  const categories = await getAllCategories()
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Feine Auswahl
        </h2>
        <p className="text-gray-500 mb-12 max-w-xl mx-auto">
          Entdecke meine handgemachten Kreationen — von klassischen Torten bis
          hin zu feinen Cake Pops.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.sys.id}
              title={cat.title}
              href={`/stoebern/${cat.slug}`}
              imageId={cat.image?.[0]?.public_id}
              imageAlt={cat.image?.[0]?.context?.custom?.alt}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
