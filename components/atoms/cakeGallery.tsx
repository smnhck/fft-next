'use client'

import { useState } from 'react'
import CakeImage from '@/components/atoms/cakeImage'
import ImageLightbox from '@/components/atoms/imageLightbox'

interface GalleryImage {
  public_id?: string
  url?: string
  context?: { custom?: { alt?: string } }
}

interface CakeGalleryProps {
  images: GalleryImage[]
  title: string
}

const MAX_THUMBNAILS = 7 // hero + 6 grid items

export default function CakeGallery({ images, title }: CakeGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        Kein Bild vorhanden
      </div>
    )
  }

  const lightboxImages = images.map((img, i) => ({
    src: img.public_id || img.url || '',
    alt: img.context?.custom?.alt || `${title} — Bild ${i + 1}`,
  }))

  const hero = images[0]
  const heroSrc = hero.public_id || hero.url || ''
  const heroAlt = hero.context?.custom?.alt || title

  const rest = images.slice(1)
  const showOverflow = images.length > MAX_THUMBNAILS
  const visibleThumbs = showOverflow ? rest.slice(0, MAX_THUMBNAILS - 2) : rest
  const overflowCount = images.length - MAX_THUMBNAILS + 1
  const overflowThumb = showOverflow ? rest[MAX_THUMBNAILS - 2] : null

  return (
    <>
      <div className="space-y-2">
        {/* Hero image */}
        <div
          className="rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() => setLightboxIndex(0)}
        >
          <CakeImage
            src={heroSrc}
            alt={heroAlt}
            width={800}
            height={600}
            className="w-full"
            priority
          />
        </div>

        {/* Thumbnail grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {visibleThumbs.map((img, i) => {
              const src = img.public_id || img.url || ''
              const alt = img.context?.custom?.alt || `${title} — Bild ${i + 2}`
              return (
                <div
                  key={i}
                  className="aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer relative"
                  onClick={() => setLightboxIndex(i + 1)}
                >
                  <CakeImage src={src} alt={alt} width={300} height={300} fill className="object-cover" />
                </div>
              )
            })}

            {/* Overflow "+N" tile */}
            {showOverflow && overflowThumb && (
              <div
                className="aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer relative"
                onClick={() => setLightboxIndex(MAX_THUMBNAILS - 1)}
              >
                <CakeImage
                  src={overflowThumb.public_id || overflowThumb.url || ''}
                  alt={`${title} — weitere Bilder`}
                  width={300}
                  height={300}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold">
                  +{overflowCount}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
