'use client'

import Link from "next/link";
import Image from "next/image";

const toggleMobileMenu = () => {
  (document.querySelector('#toggleMenu'))?.classList.toggle("hamburger-toggle");
  (document.querySelector('#navbarMobile'))?.classList.toggle("hidden");
  document.body.classList.toggle(`overflow-hidden`);
}

function MobileNav() {
  return (
    <div className="w-full">
      <div id="toggleMenu" className="grid ml-auto w-8 place-content-center h-6 hover:cursor-pointer md:hidden"
        onClick={toggleMobileMenu}>
        <div className="
            w-8 
            h-1 
            bg-black 
            rounded-full 
            before:content-[''] 
            before:absolute 
            before:w-8
            before:h-1 
            before:bg-black 
            before:rounded-full
            before:-translate-y-2
            before:transition-all
            before:duration-150
            after:content-[''] 
            after:absolute 
            after:w-8
            after:h-1 
            after:bg-black 
            after:rounded-full
            after:translate-y-2
            after:transition-all
            after:duration-150
            "
        >
        </div>
      </div>
      <div className="hidden absolute w-full px-8 md:block md:w-auto bg-white/95 top-12 bottom-0 left-0" id="navbarMobile">
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
          <Link href={'https://wa.me/01776274267'} target="_blank" className="inline-block">
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