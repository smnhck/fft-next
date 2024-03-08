import Image from "next/image";
import Link from "next/link";
import MobileNav from "./mobileNav";

function Header() {
  return (
    <header>
      <div className="px-8 border-b-4 border-black-10">
        <div className="flex items-center h-12 justify-between">
          <div className="space-x-4 hidden md:block">
            <Link href={'/'}>Home</Link>
            <Link href={'/'}>Stöbern</Link>
            <Link href={'/'}>Kontakt</Link>
            <Link href={'/'}>Über mich</Link>
          </div>
          
          <MobileNav />

          <div className="space-x-4 hidden md:block">
            <Link href={'https://wa.me/01776274267'} target="_blank" className="inline-block">
              <Image src={'/img/icons/whatsapp.svg'} alt="WhatsApp" width={32} height={32} />
            </Link>
            <Link href={'https://www.instagram.com/explore/locations/109672371220015/franzis-fabelhafte-tortchen/'} target="_blank" className="inline-block">
              <Image src={'/img/icons/instagram.svg'} alt="Instagram" width={32} height={32} />
            </Link>
            <Link href={'https://www.facebook.com/franzisfabelhaftetoertchen/'} target="_blank" className="inline-block">
              <Image src={'/img/icons/facebook.svg'} alt="Facebook" width={32} height={32} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;