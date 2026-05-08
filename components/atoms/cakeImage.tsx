'use client'

import { CldImage } from 'next-cloudinary'

interface CakeImageProps {
  width: number
  height: number
  src: string
  alt: string
  fill?: boolean
  priority?: boolean
  className?: string
}

export default function CakeImage({ width, height, src, alt, fill, priority, className }: CakeImageProps) {
  // Extract Cloudinary public ID from full Cloudinary URLs, otherwise use as-is
  const cloudinaryRegex = /\/upload\/(?:[a-z_]+\/)*(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/
  const match = src.match(cloudinaryRegex)
  const publicId = match ? match[1] : src
  const isExternalUrl = !match && src.startsWith('http')

  return (
    <CldImage
      {...(fill ? { fill } : { width, height })}
      src={isExternalUrl ? src : publicId}
      alt={alt}
      crop="fill"
      gravity="auto"
      {...(priority ? { priority } : {})}
      {...(className ? { className } : {})}
      {...(isExternalUrl ? { deliveryType: 'fetch' } : {})}
    />
  )
}
