import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Seite nicht gefunden</h1>
      <p className="text-lg text-gray-600 mb-8">
        Die gewünschte Seite existiert leider nicht.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
      >
        Zur Startseite
      </Link>
    </main>
  )
}
