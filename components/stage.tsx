import Image from 'next/image'
import { greatVibes } from '../app/fonts'
import Link from 'next/link'

export default function Stage() {
  return(
    <div className='bg-[url("/img/watercolour-flowers.png")] bg-center bg-cover'>
        <div className='pt-8 md:pt-16 pb-16 px-2 xl:px-32 bg-white bg-opacity-85'>
          <div className='text-center'>
            <h1 className={`${greatVibes.className} mb-4 text-4xl sm:text-5xl text-primary`}>Franzis fabelhafte Törtchen</h1>
            <div className={`${greatVibes.className} mb-4 text-2xl text-primary`}>Torten, Kuchen, Kekse & allerlei süße Sünden auf Bestellung</div>
            <div className='mb-8 max-w-screen-md mx-auto'>
              Du brauchst feine Leckereien für einen ganz besonderen Anlass, um Deine Liebsten zu verwöhnen oder um Dir einfach etwas Gutes zu gönnen? Dann bin ich die Richtige für Deine Wünsche! Egal, ob es eine meiner Kreationen sein soll, wie sie auf den Bildern zu sehen ist, oder ganz individuell nach Deinen Wünschen abgewandelt, der Fantasie sind nahezu keine Grenzen gesetzt und ich würde mich freuen, Dein Traumtörtchen fabrizieren zu dürfen!
            </div>
            <div>
              <Link className='py-3 px-6 text-white bg-gradient-to-r from-primary to-secondary mb-2 sm:mb-0 sm:mr-4 block sm:inline-flex items-center' href="/">
                Stöbern <Image src='/img/icons/shop.svg' alt='Shop icon' className='inline-block ml-2 align-text-bottom' width={24} height={24} />
              </Link>
              <Link className='py-3 px-6 text-white bg-gradient-to-r from-primary to-secondary block sm:inline-flex items-center' href="/">
                Kontakt <Image src='/img/icons/speech-bubble.svg' alt='Speech bubble icon' className='inline-block ml-2 align-text-bottom' width={24} height={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>
  )
}