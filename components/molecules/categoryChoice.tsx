import { greatVibes } from "@/app/fonts";
import CategoryCard from "../atoms/categoryCard";

let categories = [
  { title: 'Torten & Törtchen', image: '/img/erdbeer-schokoladen-torte.jpeg'},
  { title: 'Flaumiges Hefegebäck', image: '/img/flaumiges-hefegebaeck.jpeg'},
  { title: 'Kuchen & Muffins', image: '/img/kuchen-muffins.jpeg'},
  { title: 'Plätzchen, Kekse & Kleingebäck', image: '/img/plaetzchen.jpeg'},
  { title: 'Eiscremes & Desserts', image: '/img/eiscreme.jpeg'},
  { title: 'Cake Pop', image: '/img/cakepops.jpeg'},
]

function CategoryChoice() {
  return (
    <div>
      <div className='py-16 px-2 xl:px-32 bg-white bg-opacity-85'>
        <div className='text-center'>
          <h2 className={`${greatVibes.className} mb-8 text-3xl sm:text-4xl text-primary leading-none`}>Feine Auswahl</h2>

          <div className='mb-4 max-w-screen-md mx-auto'>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {categories.map((category) => (
              <CategoryCard image={category.image} title={category.title} key={category.title} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryChoice;