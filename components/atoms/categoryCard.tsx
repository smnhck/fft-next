'use client'

import Link from "next/link"
import Image from "next/image"

interface CategoryProps {
  title: string,
  image: string
}

const handleMouseEnter = (e: any) => {
  e.target.parentNode.getElementsByTagName('img')[0]?.classList.add('scale-125');
}
const handleMouseLeave = (e: any) => {
  e.target.parentNode.getElementsByTagName('img')[0]?.classList.remove('scale-125');
}

function CategoryCard(props: CategoryProps) {
  return (
    <Link href='/' key={props.title}>
      <div className="position relative pb-[72%] rounded-lg overflow-hidden drop-shadow-lg" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Image alt={props.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw " className="object-cover transition-all duration-300" src={props.image} />
        <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-t from-black via-20% via-transparent">
          <p className="text-white absolute bottom-1 left-0 right-0">{props.title}</p>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard;