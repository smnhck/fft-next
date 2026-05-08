const STEPS = [
  {
    number: '1',
    title: 'Stöbern',
    description: 'Schau Dich in meiner Galerie um und lass Dich inspirieren.',
  },
  {
    number: '2',
    title: 'Kontakt aufnehmen',
    description: 'Schreib mir per WhatsApp oder über das Kontaktformular.',
  },
  {
    number: '3',
    title: 'Gemeinsam planen',
    description: 'Wir besprechen Deine Wünsche, Geschmack, Größe und Termin.',
  },
  {
    number: '4',
    title: 'Genießen',
    description: 'Ich fabriziere Dein Traumtörtchen und Du holst es frisch ab.',
  },
]

export default function OrderingSteps() {
  return (
    <section className="bg-white py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          So einfach geht&apos;s
        </h2>
        <p className="text-gray-500 mb-14 max-w-xl mx-auto">
          In nur vier Schritten zu Deinem individuellen Traumtörtchen.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mb-4 shrink-0">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
