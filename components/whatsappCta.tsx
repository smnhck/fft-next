import Image from 'next/image'
import { SOCIAL_LINKS } from '@/lib/constants'

export default function WhatsAppCta() {
  return (
    <section className="bg-primary py-20 md:py-28 px-4">
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Überzeugt?
        </h2>
        <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
          Schreib mir einfach per WhatsApp — ich freue mich auf Deine Nachricht
          und berate Dich gerne!
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
          Jetzt auf WhatsApp schreiben
        </a>
      </div>
    </section>
  )
}
