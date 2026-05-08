import Link from 'next/link'
import CakeImage from '@/components/atoms/cakeImage'

interface CakeCardProps {
  cake: any
}

export default function CakeCard({ cake }: CakeCardProps) {
  const img = cake.images?.[0]
  const image = img ? {
    src: img.public_id || img.url,
    alt: img.context?.custom?.alt || img.alt || cake.title,
  } : null

  const categorySlug = cake.categoriesCollection?.items?.[0]?.slug
  const href = categorySlug
    ? `/stoebern/${categorySlug}/${cake.slug}`
    : `/stoebern/${cake.slug}`

  return (
    <article className="group">
      <Link href={href} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {image ? (
            <CakeImage src={image.src} alt={image.alt} width={600} height={600} />
          ) : null}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        <div className="pt-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {cake.title}
          </h3>
        </div>
      </Link>
    </article>
  )
}
