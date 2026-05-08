import type { Metadata } from 'next'
import { getStaticPage } from '@/lib/api'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung — Franzis fabelhafte Törtchen',
}

export default async function Datenschutz() {
  const page = await getStaticPage('datenschutz')

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>
      <div className="prose max-w-none [&>section]:mb-10 [&>section>h2]:font-bold [&>section>h2]:text-xl [&>section>h2]:md:text-2xl [&>section>h2]:mb-3">
        {page?.content?.json ? (
          documentToReactComponents(page.content.json as any)
        ) : (
          <>
            <section>
              <h2>1. Verantwortliche</h2>
              <p>
                Franziska Weiß-Hauck<br />
                Franzis fabelhafte Törtchen<br />
                Meerweinstraße 12<br />
                35394 Gießen<br />
                E-Mail: kontakt@franzis-fabelhafte-törtchen.de<br />
                Telefon: 0177 627 4267
              </p>
            </section>

            <section>
              <h2>2. Allgemeines zur Datenverarbeitung</h2>
              <p>
                Der Schutz Deiner persönlichen Daten ist mir sehr wichtig. Diese
                Datenschutzerklärung informiert Dich darüber, welche personenbezogenen
                Daten bei der Nutzung dieser Website erhoben werden und wie diese
                verwendet werden. Die Verarbeitung erfolgt stets im Einklang mit der
                Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz
                (BDSG).
              </p>
              <p>
                Über diese Website werden keine Bestellungen abgewickelt. Die
                Kontaktaufnahme erfolgt ausschließlich über externe Kanäle (WhatsApp,
                E-Mail, Telefon).
              </p>
            </section>

            <section>
              <h2>3. Hosting</h2>
              <p>
                Diese Website wird bei <strong>Vercel Inc.</strong> (440 N Baxter St,
                Los Angeles, CA 90012, USA) gehostet. Die Serverless Functions werden
                in der Region Frankfurt (Deutschland) ausgeführt.
              </p>
              <p>
                Beim Aufruf dieser Website werden automatisch Informationen in
                sogenannten Server-Logfiles gespeichert, die Dein Browser automatisch
                übermittelt. Dies sind:
              </p>
              <ul>
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Seite</li>
                <li>Referrer-URL (die zuvor besuchte Seite)</li>
                <li>Verwendeter Browser und Betriebssystem</li>
              </ul>
              <p>
                Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f
                DSGVO. Mein berechtigtes Interesse liegt in der Sicherstellung eines
                störungsfreien Betriebs der Website.
              </p>
              <p>
                Vercel ist unter dem EU-US Data Privacy Framework zertifiziert. Weitere
                Informationen findest Du in der{' '}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklärung von Vercel
                </a>
                .
              </p>
            </section>

            <section>
              <h2>4. Content-Delivery-Network (CDN) &mdash; Cloudinary</h2>
              <p>
                Zur Auslieferung und Optimierung von Bildern nutze ich den Dienst{' '}
                <strong>Cloudinary Ltd.</strong> (111 W Evelyn Ave, Suite 206,
                Sunnyvale, CA 94086, USA). Beim Laden von Bildern wird eine Verbindung
                zu den Servern von Cloudinary hergestellt, wobei Deine IP-Adresse
                übertragen wird.
              </p>
              <p>
                Die Nutzung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Mein
                berechtigtes Interesse liegt in der schnellen und effizienten
                Bereitstellung von Bildinhalten. Weitere Informationen findest Du in
                der{' '}
                <a
                  href="https://cloudinary.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklärung von Cloudinary
                </a>
                .
              </p>
            </section>

            <section>
              <h2>5. Content-Management-System &mdash; Contentful</h2>
              <p>
                Zur Verwaltung der Inhalte dieser Website nutze ich das
                Content-Management-System <strong>Contentful GmbH</strong> (Max-Urich-Straße 3,
                13355 Berlin, Deutschland). Die Inhalte werden serverseitig abgerufen;
                es findet keine direkte Verbindung zwischen Deinem Browser und
                Contentful statt.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen
                findest Du in der{' '}
                <a
                  href="https://www.contentful.com/legal/privacy-at-contentful/privacy-notice/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklärung von Contentful
                </a>
                .
              </p>
            </section>

            <section>
              <h2>6. Webanalyse &mdash; Vercel Speed Insights</h2>
              <p>
                Diese Website nutzt <strong>Vercel Speed Insights</strong> zur Messung
                der Ladegeschwindigkeit und Performance. Dabei werden anonymisierte
                Leistungsdaten (Core Web Vitals) erhoben. Es werden keine Cookies
                gesetzt und keine personenbezogenen Daten gespeichert.
              </p>
              <p>
                Die Nutzung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Mein
                berechtigtes Interesse liegt in der Optimierung der Website-Performance.
              </p>
            </section>

            <section>
              <h2>7. Externe Links &mdash; WhatsApp, Facebook, Instagram</h2>
              <p>
                Diese Website enthält Links zu externen Diensten:
              </p>
              <ul>
                <li>
                  <strong>WhatsApp</strong> (Meta Platforms Ireland Ltd.) &mdash; zur
                  direkten Kontaktaufnahme. Beim Klick auf den Link wird die
                  WhatsApp-App bzw. -Website geöffnet. Erst dann gelten die{' '}
                  <a
                    href="https://www.whatsapp.com/legal/privacy-policy-eea"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Datenschutzbestimmungen von WhatsApp
                  </a>
                  .
                </li>
                <li>
                  <strong>Facebook</strong> und <strong>Instagram</strong> (Meta
                  Platforms Ireland Ltd.) &mdash; Links zu meinen Social-Media-Profilen.
                  Es werden keine Daten an Meta übertragen, solange Du nicht auf den
                  Link klickst.
                </li>
              </ul>
              <p>
                Es werden auf dieser Website keine Social-Media-Plugins eingebunden und
                keine Tracking-Pixel von Meta verwendet.
              </p>
            </section>

            <section>
              <h2>8. Cookies</h2>
              <p>
                Diese Website verwendet ausschließlich technisch notwendige Cookies, die
                für den Betrieb der Website erforderlich sind. Es werden keine
                Tracking-Cookies oder Cookies zu Werbezwecken eingesetzt.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Du kannst Deinen
                Browser so einstellen, dass keine Cookies gespeichert werden. Dies kann
                jedoch die Funktionalität der Website einschränken.
              </p>
            </section>

            <section>
              <h2>9. Schriftarten</h2>
              <p>
                Diese Website verwendet ausschließlich lokal eingebundene Schriftarten.
                Es findet keine Verbindung zu externen Font-Diensten (z.&nbsp;B. Google
                Fonts) statt.
              </p>
            </section>

            <section>
              <h2>10. Deine Rechte</h2>
              <p>Du hast gemäß DSGVO folgende Rechte:</p>
              <ul>
                <li>
                  <strong>Auskunftsrecht</strong> (Art. 15 DSGVO) &mdash; Du kannst
                  Auskunft über Deine gespeicherten personenbezogenen Daten verlangen.
                </li>
                <li>
                  <strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO) &mdash; Du
                  kannst die Berichtigung unrichtiger Daten verlangen.
                </li>
                <li>
                  <strong>Recht auf Löschung</strong> (Art. 17 DSGVO) &mdash; Du
                  kannst die Löschung Deiner Daten verlangen, sofern keine
                  gesetzlichen Aufbewahrungspflichten entgegenstehen.
                </li>
                <li>
                  <strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18
                  DSGVO)
                </li>
                <li>
                  <strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)
                </li>
                <li>
                  <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) &mdash; Du kannst
                  jederzeit der Verarbeitung Deiner Daten widersprechen.
                </li>
              </ul>
              <p>
                Zur Ausübung Deiner Rechte kannst Du Dich jederzeit an die oben
                genannte Verantwortliche wenden.
              </p>
            </section>

            <section>
              <h2>11. Beschwerderecht bei einer Aufsichtsbehörde</h2>
              <p>
                Du hast das Recht, Dich bei einer Datenschutz-Aufsichtsbehörde über
                die Verarbeitung Deiner personenbezogenen Daten zu beschweren. Die
                zuständige Aufsichtsbehörde ist:
              </p>
              <p>
                Der Hessische Beauftragte für Datenschutz und Informationsfreiheit<br />
                Gustav-Stresemann-Ring 1<br />
                65189 Wiesbaden<br />
                Telefon: 0611 1408-0<br />
                E-Mail: poststelle@datenschutz.hessen.de<br />
                <a
                  href="https://datenschutz.hessen.de"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://datenschutz.hessen.de
                </a>
              </p>
            </section>

            <section>
              <h2>12. Aktualität dieser Datenschutzerklärung</h2>
              <p>
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Mai
                2026. Durch die Weiterentwicklung der Website oder aufgrund geänderter
                gesetzlicher Vorgaben kann eine Anpassung dieser Datenschutzerklärung
                erforderlich werden.
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
