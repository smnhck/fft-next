'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { SOCIAL_LINKS, NAV_LINKS } from '@/lib/constants'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(prev => !prev)
    document.body.classList.toggle('overflow-hidden')
  }

  const close = () => {
    setIsOpen(false)
    document.body.classList.remove('overflow-hidden')
  }

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={toggle}
        className="relative w-6 h-5 flex flex-col justify-between"
        aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
        aria-expanded={isOpen}
      >
        <span
          className={`block h-0.5 w-full bg-gray-800 rounded transition-all duration-200 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-gray-800 rounded transition-all duration-200 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-gray-800 rounded transition-all duration-200 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Mobile menu overlay — portalled to body to escape header's backdrop-filter containing block */}
      {isOpen && createPortal(
        <div className="fixed inset-0 top-16 bg-white z-50 overflow-auto md:hidden">
          <nav className="flex flex-col px-6 py-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="py-3 text-lg font-medium text-gray-800 border-b border-gray-100 hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex justify-center gap-6 py-8">
            <Link
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              onClick={close}
            >
              <Image src="/img/icons/whatsapp.svg" alt="" width={40} height={40} />
            </Link>
            <Link
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              onClick={close}
            >
              <Image src="/img/icons/instagram.svg" alt="" width={40} height={40} />
            </Link>
            <Link
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              onClick={close}
            >
              <Image src="/img/icons/facebook.svg" alt="" width={40} height={40} />
            </Link>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
