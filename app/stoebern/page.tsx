import type { Metadata } from 'next'
import { getAllCakes } from '@/lib/api'
import CakesGallery from '@/components/molecules/cakesGallery'

export const metadata: Metadata = {
  title: 'Stöbern',
  description: 'Entdecke Franzis Kreationen: Torten, Cupcakes, Hefegebäck, Kekse, Cake Pops und Hochzeitstorten.',
}

export default async function Stoebern() {
  const cakes = await getAllCakes(500)

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Stöbern
      </h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Entdecke meine Kreationen — von Torten über Hefegebäck bis hin zu Cake Pops.
      </p>
      <CakesGallery cakes={cakes} />
    </main>
  )
}
