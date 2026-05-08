import type { Metadata } from 'next'
import Image from 'next/image'
import { SOCIAL_LINKS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Kontaktiere Franzi für deine individuelle Tortenbestellung. Per WhatsApp, E-Mail oder Kontaktformular.',
}

const CONTACT_CARDS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Adresse',
    value: 'Gießen, Hessen',
    detail: 'Meerweinstr. 12, 35394 Gießen',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'Handy',
    value: '+49 177 627 4267',
    href: 'tel:+491776274267',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'E-Mail',
    value: 'info@franzis-fabelhafte-toertchen.de',
    href: 'mailto:info@franzis-fabelhafte-toertchen.de',
  },
] as const

export default function Kontakt() {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
        Kontakt
      </h1>
      <p className="text-gray-600 mb-12 text-center max-w-xl mx-auto">
        Du hast eine Frage oder möchtest eine Torte bestellen? Schreib mir
        einfach — am liebsten per WhatsApp!
      </p>

      {/* WhatsApp primary CTA */}
      <div className="bg-primary p-8 md:p-10 text-center text-white mb-12">
        <h2 className="text-2xl font-bold mb-3">Am schnellsten per WhatsApp</h2>
        <p className="opacity-90 mb-6 max-w-md mx-auto">
          Schick mir einfach eine Nachricht und ich melde mich so schnell wie
          möglich bei Dir zurück.
        </p>
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white text-primary font-bold py-3 px-8 hover:bg-cream transition-colors"
        >
          <Image
            src="/img/icons/whatsapp.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
          WhatsApp öffnen
        </a>
      </div>

      {/* Contact info cards */}
      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        {CONTACT_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-black-5 rounded-xl p-6 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              {card.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{card.label}</h3>
            {'href' in card && card.href ? (
              <a
                href={card.href}
                className="text-primary hover:underline break-all"
              >
                {card.value}
              </a>
            ) : (
              <p className="text-gray-600">{card.value}</p>
            )}
            {'detail' in card && card.detail && (
              <p className="text-sm text-gray-500 mt-1">{card.detail}</p>
            )}
          </div>
        ))}
      </div>

      {/* Social links */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Folge mir auch auf
        </h2>
        <div className="flex justify-center gap-6">
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black-5 px-5 py-3 rounded-full hover:bg-black-10 transition-colors"
            aria-label="Facebook"
          >
            <Image src="/img/icons/facebook.svg" alt="" width={24} height={24} />
            <span className="font-medium">Facebook</span>
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black-5 px-5 py-3 rounded-full hover:bg-black-10 transition-colors"
            aria-label="Instagram"
          >
            <Image src="/img/icons/instagram.svg" alt="" width={24} height={24} />
            <span className="font-medium">Instagram</span>
          </a>
        </div>
      </div>
    </main>
  )
}
