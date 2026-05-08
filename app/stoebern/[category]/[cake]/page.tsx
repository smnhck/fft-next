import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { getCake, getAllCakes, getCakesByCategory } from '@/lib/api'
import { SOCIAL_LINKS } from '@/lib/constants'
import CakeCard from '@/components/molecules/cakeCard'
import CakeGallery from '@/components/atoms/cakeGallery'
import JsonLd from '@/components/atoms/jsonLd'

function MetaInfo({ servings, allergens }: { servings?: number; allergens?: string[] }) {
  const hasServings = servings != null
  const hasAllergens = allergens != null && allergens.length > 0
  if (!hasServings && !hasAllergens) return null

  return (
    <div className="flex flex-wrap gap-4 mb-6 text-sm">
      {hasServings && (
        <span className="inline-flex items-center gap-1.5 bg-black-5 px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {servings} Portionen
        </span>
      )}
      {hasAllergens && (
        <span className="inline-flex items-center gap-1.5 bg-black-5 px-3 py-1.5 rounded-full">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {allergens!.join(', ')}
        </span>
      )}
    </div>
  )
}

export async function generateStaticParams() {
  const cakes = await getAllCakes(500)
  return cakes
    .filter(cake => cake.categoriesCollection?.items?.[0]?.slug)
    .map(cake => ({
      category: cake.categoriesCollection!.items[0].slug,
      cake: cake.slug,
    }))
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; cake: string }
}): Promise<Metadata> {
  const cake = await getCake(params.cake)
  const title = cake?.title ?? 'Torte'
  const description = cake?.teaser ?? undefined
  const img = cake?.images?.[0] as any
  const image = img?.secure_url || img?.url
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default async function CakePage({
  params,
}: {
  params: { category: string; cake: string }
}) {
  const cake = await getCake(params.cake)

  if (!cake) notFound()

  const category = cake.categoriesCollection?.items?.[0]
  const whatsappMsg = encodeURIComponent(
    `Hallo liebe Franzi, ich interessiere mich für „${cake.title}". Ich bräuchte eine Torte für folgendes Datum:`
  )
  const whatsappHref = `https://wa.me/491776274267?text=${whatsappMsg}`

  // Similar cakes from same category
  let similarCakes: typeof cake[] = []
  if (category) {
    const categoryCakes = await getCakesByCategory(category.slug)
    similarCakes = categoryCakes
      .filter(c => c.slug !== cake.slug)
      .slice(0, 4)
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Stöbern', item: 'https://franzis-fabelhafte-toertchen.de/stoebern' },
      ...(category
        ? [{ '@type': 'ListItem', position: 2, name: category.title, item: `https://franzis-fabelhafte-toertchen.de/stoebern/${category.slug}` }]
        : []),
      { '@type': 'ListItem', position: category ? 3 : 2, name: cake.title },
    ],
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <JsonLd data={breadcrumbSchema} />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li>
            <Link href="/stoebern" className="hover:text-primary transition-colors">
              Stöbern
            </Link>
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/stoebern/${category.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {category.title}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">
            {cake.title}
          </li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image gallery */}
        <CakeGallery images={cake.images ?? []} title={cake.title} />

        {/* Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {cake.title}
          </h1>

          {cake.teaser && (
            <p className="text-gray-600 mb-6 text-lg">{cake.teaser}</p>
          )}

          {/* Meta info */}
          <MetaInfo servings={cake.servings} allergens={cake.allergens} />

          {/* Rich text description */}
          {cake.description?.json ? (
            <div className="prose max-w-none mb-8">
              {documentToReactComponents(cake.description.json as any)}
            </div>
          ) : null}

          {/* Category tags */}
          {cake.categoriesCollection && cake.categoriesCollection.items.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {cake.categoriesCollection.items.map((cat) => (
                <Link
                  key={cat.sys.id}
                  href={`/stoebern/${cat.slug}`}
                  className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          )}

          {/* WhatsApp CTA */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-primary text-white font-bold py-3 px-6 hover:bg-primary-dark transition-colors"
          >
            <Image
              src="/img/icons/whatsapp.svg"
              alt=""
              width={22}
              height={22}
              aria-hidden="true"
            />
            Jetzt anfragen
          </a>
        </div>
      </div>

      {/* Similar cakes */}
      {similarCakes.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Ähnliche Kreationen
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {similarCakes.map((c) => (
              <CakeCard key={c.sys.id} cake={c} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
