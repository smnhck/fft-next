import Image from "next/image";
import Link from "next/link";
import MobileNav from "./mobileNav";

function Header() {
  return (
    <header>
      <div className="px-2 md:px-8 border-b-4 border-black-10">
        <div className="flex items-center h-12 justify-between">
          <div className="space-x-4 hidden md:block">
            <Link href={'/'}>Home</Link>
            <Link href={'/'}>Stöbern</Link>
            <Link href={'/'}>Kontakt</Link>
            <Link href={'/'}>Über mich</Link>
          </div>
          
          <MobileNav />

          <div className="space-x-4 hidden md:block">
            <Link href={'https://wa.me/491776274267?text=Hallo%20liebe%20Franzi%2C%20ich%20interessiere%20mich%20f%C3%BCr%20eine%20deiner%20Torten'} target="_blank" className="inline-block">
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