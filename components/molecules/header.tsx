import Link from 'next/link'
import { SITE_NAME, NAV_LINKS } from '@/lib/constants'
import MobileNav from './mobileNav'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="font-display text-xl md:text-2xl text-primary">
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile nav */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
