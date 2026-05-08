import Link from 'next/link'
import { getStage } from '@/lib/api'
import ParallaxImage from '@/components/atoms/parallaxImage'

export default async function Stage() {
  const stage = await getStage()
  const bgImage = stage?.backgroundImage?.[0]

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background image with parallax */}
      {bgImage?.public_id ? (
        <ParallaxImage
          src={bgImage.public_id}
          alt={bgImage.context?.custom?.alt ?? 'Franzis fabelhafte Törtchen'}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/img/hero.jpg)' }}
        />
      )}
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content — frosted glass panel */}
      <div className="relative z-10 w-full px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-8 md:p-12 max-w-lg">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-primary mb-3 leading-tight">
              Franzis fabelhafte Törtchen
            </h1>
            <p className="text-lg md:text-xl text-gray-800 mb-2 font-semibold">
              Handgemacht in Gießen
            </p>
            <p className="text-gray-600 mb-8">
              Torten, Kuchen, Kekse & allerlei süße Sünden — individuell
              nach Deinen Wünschen, für jeden besonderen Anlass.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/stoebern"
                className="inline-flex items-center justify-center py-3 px-6 bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Kreationen entdecken
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center py-3 px-6 border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Anfrage stellen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
