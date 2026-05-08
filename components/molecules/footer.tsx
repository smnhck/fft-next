import Link from 'next/link'
import Image from 'next/image'
import { SITE_NAME, SOCIAL_LINKS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-black-5">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {/* Top row: brand + social */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <Link href="/" className="font-display text-2xl text-primary">
            {SITE_NAME}
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <Image src="/img/icons/whatsapp.svg" alt="" width={28} height={28} />
            </Link>
            <Link
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Image src="/img/icons/instagram.svg" alt="" width={28} height={28} />
            </Link>
            <Link
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Image src="/img/icons/facebook.svg" alt="" width={28} height={28} />
            </Link>
          </div>
        </div>

        {/* Bottom row: legal links + copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 text-sm text-black-50">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-primary transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-primary transition-colors">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:text-primary transition-colors">
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
