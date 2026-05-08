import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AGB',
  description:
    'Allgemeine Geschäftsbedingungen — Franzis fabelhafte Törtchen',
}

export default function AGB() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        Allgemeine Geschäftsbedingungen
      </h1>

      <div className="prose max-w-none">
        <h2 className="font-bold mt-8">§ 1 Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle
          Bestellungen und Verträge zwischen Franziska Weiß-Hauck, Franzis fabelhafte
          Törtchen, Gießen (nachfolgend &bdquo;Anbieterin&ldquo;) und dem Kunden
          (nachfolgend &bdquo;Kunde&ldquo;). Abweichende Bedingungen des Kunden werden nicht
          anerkannt, es sei denn, die Anbieterin stimmt ihrer Geltung
          ausdrücklich schriftlich zu.
        </p>

        <h2 className="font-bold mt-8">§ 2 Vertragsschluss</h2>
        <ol>
          <li>
            Die Darstellung der Produkte auf der Website stellt kein
            rechtsverbindliches Angebot dar, sondern eine unverbindliche
            Aufforderung zur Bestellung.
          </li>
          <li>
            Ein Vertrag kommt erst durch die ausdrückliche Bestätigung der
            Bestellung durch die Anbieterin zustande (z.&nbsp;B. per WhatsApp,
            E-Mail oder Telefon).
          </li>
          <li>
            Individuelle Absprachen zu Geschmack, Design, Größe, Liefertermin
            und Preis werden bei der Auftragsbestätigung schriftlich festgehalten.
          </li>
        </ol>

        <h2 className="font-bold mt-8">§ 3 Preise und Zahlung</h2>
        <ol>
          <li>
            Alle angegebenen Preise verstehen sich in Euro und enthalten die
            gesetzliche Mehrwertsteuer.
          </li>
          <li>
            Der endgültige Preis richtet sich nach der individuellen
            Vereinbarung und wird dem Kunden vor Auftragsbestätigung mitgeteilt.
          </li>
          <li>
            Die Zahlung erfolgt wahlweise per Barzahlung bei Abholung oder per
            Überweisung auf das Konto der Anbieterin. Bei Überweisung ist der
            Betrag spätestens zwei Wochen vor dem vereinbarten Abhol- bzw.
            Liefertermin auf dem Konto der Anbieterin einzugehen, außer es bestehen andere mündliche oder schriftliche Vereinbarungen.
          </li>
        </ol>

        <h2 className="font-bold mt-8">§ 4 Abholung und Lieferung</h2>
        <ol>
          <li>
            Die Abholung erfolgt am vereinbarten Termin an der Abholadresse der
            Anbieterin in Gießen.
          </li>
          <li>
            Auf Wunsch ist eine Lieferung gegen eine zusätzliche Gebühr möglich.
            Die Lieferkosten werden vorab individuell vereinbart und richten sich
            nach Entfernung und Aufwand.
          </li>
          <li>
            Ab dem Zeitpunkt der Übergabe an den Kunden bzw. an den
            Transportdienstleister geht die Gefahr des zufälligen Untergangs und
            der zufälligen Verschlechterung auf den Kunden über.
          </li>
        </ol>

        <h2 className="font-bold mt-8">§ 5 Stornierung und Rücktritt</h2>
        <ol>
          <li>
            Eine kostenfreie Stornierung der Bestellung ist bis spätestens{' '}
            <strong>zwei Wochen</strong> vor dem vereinbarten Abhol- bzw.
            Liefertermin möglich.
          </li>
          <li>
            Bei einer Stornierung sind bereits
            angefallene Material- und Zutatenkosten vom Kunden zu erstatten.
          </li>
          <li>
            In begründeten Einzelfällen kann die Anbieterin kulanzhalber eine
            kürzere Stornierungsfrist vereinbaren. Ein Anspruch darauf besteht
            nicht.
          </li>
        </ol>

        <h2 className="font-bold mt-8">§ 6 Allergene und Unverträglichkeiten</h2>
        <ol>
          <li>
            Die Anbieterin informiert auf Nachfrage über die verwendeten Zutaten
            und die im Produkt enthaltenen Allergene gemäß der
            Lebensmittelinformationsverordnung (LMIV).
          </li>
          <li>
            Es liegt in der Verantwortung des Kunden, vor der Bestellung auf
            Allergien und Unverträglichkeiten hinzuweisen und sich über die
            enthaltenen Inhaltsstoffe zu informieren.
          </li>
          <li>
            Die Anbieterin übernimmt keine Haftung für allergische Reaktionen
            oder Unverträglichkeiten, sofern der Kunde seiner
            Informationspflicht nicht nachgekommen ist.
          </li>
        </ol>

        <h2 className="font-bold mt-8">§ 7 Gewährleistung und Haftung</h2>
        <ol>
          <li>
            Die Anbieterin gewährleistet, dass alle Produkte mit größter Sorgfalt
            und unter Einhaltung der lebensmittelrechtlichen Vorschriften
            hergestellt werden.
          </li>
          <li>
            Reklamationen sind unverzüglich, spätestens am Tag der Abholung bzw.
            Lieferung, unter Beifügung von Fotos mitzuteilen.
          </li>
          <li>
            Die Haftung der Anbieterin für leicht fahrlässige
            Pflichtverletzungen ist auf den vorhersehbaren, vertragstypischen
            Schaden beschränkt, sofern nicht Schäden an Leben, Körper oder
            Gesundheit betroffen sind.
          </li>
          <li>
            Da es sich um leicht verderbliche, individuell angefertigte Waren
            handelt, ist ein Widerrufsrecht nach § 312g Abs. 2 Nr. 2 und Nr. 4
            BGB ausgeschlossen.
          </li>
        </ol>

        <h2 className="font-bold mt-8">§ 8 Urheberrecht und Bilder</h2>
        <p>
          Die Anbieterin behält sich das Recht vor, Fotos der angefertigten
          Produkte für Werbezwecke (Website, Social Media) zu verwenden, sofern
          der Kunde dem nicht ausdrücklich widerspricht.
        </p>

        <h2 className="font-bold mt-8">§ 9 Schlussbestimmungen</h2>
        <ol>
          <li>
            Es gilt das Recht der Bundesrepublik Deutschland.
          </li>
          <li>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden,
            bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.
          </li>
          <li>
            Gerichtsstand ist, soweit gesetzlich zulässig, Gießen.
          </li>
        </ol>

        <p className="mt-8 text-sm text-gray-500">Stand: März 2026</p>
      </div>
    </main>
  )
}
