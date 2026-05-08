'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CldImage } from 'next-cloudinary'

interface LightboxImage {
  src: string
  alt: string
}

interface ImageLightboxProps {
  images: LightboxImage[]
  initialIndex: number
  onClose: () => void
}

export default function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [loading, setLoading] = useState(true)
  const touchStartX = useRef(0)

  const goPrev = useCallback(() => { setLoading(true); setIndex(i => (i > 0 ? i - 1 : images.length - 1)) }, [images.length])
  const goNext = useCallback(() => { setLoading(true); setIndex(i => (i < images.length - 1 ? i + 1 : 0)) }, [images.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    // Prevent body scroll while lightbox is open
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, goPrev, goNext])

  const img = images[index]

  // Extract Cloudinary public ID (same logic as CakeImage)
  const cloudinaryRegex = /\/upload\/(?:[a-z_]+\/)*(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/
  const match = img.src.match(cloudinaryRegex)
  const publicId = match ? match[1] : img.src
  const isExternalUrl = !match && img.src.startsWith('http')

  const overlay = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
      onClick={onClose}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        const diff = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(diff) > 50) {
          diff > 0 ? goPrev() : goNext()
        }
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2"
        aria-label="Schließen"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 text-white/70 text-sm font-medium">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Prev arrow */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); goPrev() }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
          aria-label="Vorheriges Bild"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative w-[90vw] h-[85vh] flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <CldImage
          key={index}
          src={isExternalUrl ? img.src : publicId}
          alt={img.alt}
          fill
          className={`object-contain transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}
          sizes="90vw"
          onLoad={() => setLoading(false)}
          {...(isExternalUrl ? { deliveryType: 'fetch' as any } : {})}
        />
      </div>

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); goNext() }}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
          aria-label="Nächstes Bild"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )

  return createPortal(overlay, document.body)
}
