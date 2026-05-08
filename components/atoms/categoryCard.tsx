'use client'

import Link from 'next/link'
import { CldImage } from 'next-cloudinary'

interface CategoryCardProps {
  title: string
  imageId?: string
  imageAlt?: string
  href: string
}

export default function CategoryCard({ title, imageId, imageAlt, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {imageId ? (
          <CldImage
            alt={imageAlt ?? title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            src={imageId}
            crop="fill"
            gravity="auto"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
        <p className="absolute bottom-4 left-4 text-white font-semibold text-lg">
          {title}
        </p>
      </div>
    </Link>
  )
}
