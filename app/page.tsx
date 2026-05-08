import type { Metadata } from 'next'
import Stage from '@/components/stage'
import CategoryChoice from '@/components/categoryChoice'
import ImageBreak from '@/components/imageBreak'
import OrderingSteps from '@/components/orderingSteps'
import Testimonials from '@/components/testimonials'
import WhatsAppCta from '@/components/whatsappCta'
import JsonLd from '@/components/atoms/jsonLd'

export const metadata: Metadata = {
  title: 'Torten auf Bestellung aus Gießen',
  description:
    'Torten, Kuchen, Kekse & allerlei süße Sünden auf Bestellung. Handgemacht in Gießen mit Liebe und Leidenschaft.',
}

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: 'Franzis fabelhafte Törtchen',
  description:
    'Torten, Kuchen, Kekse & allerlei süße Sünden auf Bestellung. Handgemacht in Gießen mit Liebe und Leidenschaft.',
  url: 'https://franzis-fabelhafte-toertchen.de',
  telephone: '+491776274267',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gießen',
    addressRegion: 'Hessen',
    addressCountry: 'DE',
  },
  sameAs: [
    'https://www.facebook.com/franzisfabelhaftetoertchen/',
    'https://www.instagram.com/explore/locations/109672371220015/franzis-fabelhafte-tortchen/',
  ],
  priceRange: '€€',
}

export default function Home() {
  return (
    <main>
      <JsonLd data={LOCAL_BUSINESS_SCHEMA} />
      <Stage />
      <CategoryChoice />
      <ImageBreak />
      <OrderingSteps />
      <Testimonials />
      <WhatsAppCta />
    </main>
  )
}
