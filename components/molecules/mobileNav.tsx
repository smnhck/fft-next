'use client'

import Link from "next/link";
import Image from "next/image";
import { greatVibes } from "@/app/fonts";

const toggleMobileMenu = () => {
  (document.querySelector('#toggleMenu'))?.classList.toggle("hamburger-toggle");
  (document.querySelector('#navbarMobile'))?.classList.toggle("hidden");
  document.body.classList.toggle(`overflow-hidden`);
}

function MobileNav() {
  return (
    <div className="w-full md:hidden flex">

      <Link href="/" className={`${greatVibes.className} text-primary text-basel sm:text-xl`}>Franzis fabelhafte Törtchen</Link>

      <div className="ml-auto my-auto">
        <div id="toggleMenu" className="w-4 h-3 grid place-content-center hover:cursor-pointer"
          onClick={toggleMobileMenu}>
          <div className="
            w-4 
            h-0.5 
            bg-black 
            rounded-full 
            before:content-[''] 
            before:absolute 
            before:w-4
            before:h-0.5 
            before:bg-black 
            before:rounded-full
            before:-translate-y-1
            before:transition-all
            before:duration-150
            after:content-[''] 
            after:absolute 
            after:w-4
            after:h-0.5 
            after:bg-black 
            after:rounded-full
            after:translate-y-1
            after:transition-all
            after:duration-150
            "
          >
          </div>
        </div>
      </div>
      <div className="hidden absolute w-full px-2 md:block md:w-auto bg-white/95 top-12 bottom-0 left-0 overflow-auto" id="navbarMobile">
        <ul className="text-right py-2 font-bold text-xl border-b-2">
          <li>
            <Link href={'/'}>Home</Link>
          </li>
          <li>
            <Link href={'/'}>Stöbern</Link>
          </li>
          <li>
            <Link href={'/'}>Kontakt</Link>
          </li>
          <li>
            <Link href={'/'}>Über mich</Link>
          </li>
        </ul>

        <div className="space-x-4 text-right py-2">
          <Link href={'https://wa.me/491776274267'} target="_blank" className="inline-block">
            <Image src={'/img/icons/whatsapp.svg'} alt="WhatsApp" width={48} height={48} />
          </Link>
          <Link href={'https://www.instagram.com/explore/locations/109672371220015/franzis-fabelhafte-tortchen/'} target="_blank" className="inline-block">
            <Image src={'/img/icons/instagram.svg'} alt="Instagram" width={48} height={48} />
          </Link>
          <Link href={'https://www.facebook.com/franzisfabelhaftetoertchen/'} target="_blank" className="inline-block">
            <Image src={'/img/icons/facebook.svg'} alt="Facebook" width={48} height={48} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MobileNav;