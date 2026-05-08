'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Etwas ist schiefgelaufen</h1>
      <p className="text-lg text-gray-600 mb-8">
        Bitte versuche es erneut.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
      >
        Erneut versuchen
      </button>
    </main>
  )
}
