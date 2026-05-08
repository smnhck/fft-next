import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/molecules/header'
import Footer from '@/components/molecules/footer'
import { overlock, greatVibes } from './fonts'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: {
    default: 'Franzis fabelhafte Törtchen',
    template: '%s — Franzis fabelhafte Törtchen',
  },
  description: 'Torten, Kuchen, Kekse & allerlei süße Sünden auf Bestellung aus Gießen',
  metadataBase: new URL('https://franzis-fabelhafte-toertchen.de'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'Franzis fabelhafte Törtchen',
    title: 'Franzis fabelhafte Törtchen',
    description: 'Torten, Kuchen, Kekse & allerlei süße Sünden auf Bestellung aus Gießen',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-DE" className={`${overlock.variable} ${greatVibes.variable}`}>
      <body className="font-body text-gray-900 antialiased flex flex-col min-h-screen bg-cream">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  )
}
