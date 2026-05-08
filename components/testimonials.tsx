import { getAllTestimonials } from '@/lib/api'
import TestimonialCarousel from './atoms/testimonialCarousel'

export default async function Testimonials() {
  const testimonials = await getAllTestimonials()

  if (testimonials.length === 0) return null

  return (
    <section className="bg-white py-20 md:py-28 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Das sagen Andere
        </h2>
        <p className="text-gray-500 mb-12 max-w-xl mx-auto">
          Ich freue mich immer über euer Feedback und eure Anregungen.
        </p>
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
