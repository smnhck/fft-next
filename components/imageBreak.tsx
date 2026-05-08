import { getImageBreak } from '@/lib/api'
import ParallaxImage from '@/components/atoms/parallaxImage'

export default async function ImageBreak() {
  const data = await getImageBreak()
  if (!data) return null

  const imageId = data.image?.[0]?.public_id
  const imageAlt = data.image?.[0]?.context?.custom?.alt ?? data.title

  return (
    <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
      {imageId ? (
        <ParallaxImage src={imageId} alt={imageAlt} speed={0.3} />
      ) : null}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center px-4">
        <p className="font-display text-4xl md:text-5xl text-white leading-tight">
          {data.text}
        </p>
      </div>
    </section>
  )
}
