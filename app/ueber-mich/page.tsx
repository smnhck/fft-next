import type { Metadata } from 'next'
import Image from 'next/image'
import { getStaticPage } from '@/lib/api'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { SOCIAL_LINKS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Über mich',
  description:
    'Lerne Franzi kennen — geprüfte Konditorin aus Gießen mit Leidenschaft für individuelle Torten und Gebäck.',
}

export default async function AboutMe() {
  const page = await getStaticPage('ueber-mich')

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
        Über mich
      </h1>

      <div className="grid md:grid-cols-5 gap-10 items-start">
        {/* Photo placeholder */}
        <div className="md:col-span-2">
          <Image
            src="/img/franzi-weiss-hauck-profil-bild.jpeg"
            alt="Franzi Weiß-Hauck — Konditorin aus Gießen"
            width={600}
            height={800}
            className="rounded-full aspect-square object-cover w-full"
            priority
          />
        </div>

        {/* Story */}
        <div className="md:col-span-3">
          {page?.content?.json ? (
            <div className="prose max-w-none">
              {documentToReactComponents(page.content.json as any)}
            </div>
          ) : (
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                Hallo, ich bin Franzi — geprüfte Konditorin der
                Handwerkskammer und Tortenenthusiastin aus Gießen.
              </p>
              <p>
                Schon als Kind habe ich mit meiner Oma Plätzchen gebacken und
                dabei die Liebe zum Backen entdeckt. Was damals als Hobby
                begann, ist heute meine Berufung: individuelle Torten, Kuchen
                und Gebäck für eure ganz besonderen Anlässe.
              </p>
              <p>
                Jede meiner Kreationen wird mit viel Liebe, frischen Zutaten
                und handwerklichem Können gefertigt. Dabei sind der Fantasie
                kaum Grenzen gesetzt — ob klassische Sahnetorte,
                mehrstöckige Hochzeitstorte oder kreative Motivtorte.
              </p>
              <p>
                Ich freue mich darauf, auch für Dich etwas Besonderes zu
                zaubern!
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8">
            <a
              href={SOCIAL_LINKS.whatsapp}
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
              Schreib mir auf WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
