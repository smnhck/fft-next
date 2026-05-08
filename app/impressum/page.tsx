import type { Metadata } from 'next'
import { getStaticPage } from '@/lib/api'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum — Franzis fabelhafte Törtchen',
}

export default async function Impressum() {
  const page = await getStaticPage('impressum')

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Impressum</h1>
      {page?.content?.json ? (
        <div className="prose max-w-none">
          {documentToReactComponents(page.content.json as any)}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Angaben gemäß §5 TMG
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Franzis fabelhafte Törtchen</span><br />
              Franziska Weiß-Hauck<br />
              Meerweinstraße 12<br />
              35394 Gießen
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Kontakt
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Telefon:{' '}
              <a href="tel:+491776274267" className="text-primary hover:underline">
                0177 627 4267
              </a><br />
              E-Mail:{' '}
              <a href="mailto:kontakt@franzis-fabelhafte-törtchen.de" className="text-primary hover:underline">
                kontakt@franzis-fabelhafte-törtchen.de
              </a>
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Umsatzsteuer-ID
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG:<br />
              <span className="font-mono text-gray-900">DE 343230019</span>
            </p>
          </section>
        </div>
      )}
    </main>
  )
}
