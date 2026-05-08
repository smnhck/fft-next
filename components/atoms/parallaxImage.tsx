'use client'

import { useEffect, useRef } from 'react'
import { CldImage } from 'next-cloudinary'

interface ParallaxImageProps {
  src: string
  alt: string
  speed?: number
}

export default function ParallaxImage({ src, alt, speed = 0.4 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const parent = el.parentElement
    if (!parent) return

    function onScroll() {
      const rect = parent!.getBoundingClientRect()
      const viewH = window.innerHeight
      // How far the element is through the viewport: 0 = just entering bottom, 1 = just left top
      const progress = (viewH - rect.top) / (viewH + rect.height)
      const offset = (progress - 0.5) * rect.height * speed
      el!.style.transform = `translate3d(0, ${offset}px, 0)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return (
    <div ref={ref} className="absolute inset-0 h-[130%] -top-[15%]">
      <CldImage
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        crop="fill"
        gravity="auto"
      />
    </div>
  )
}
