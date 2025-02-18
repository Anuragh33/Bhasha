import { Button } from '@/components/ui/button'
import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        {' '}
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="../../public/hr.svg"
            alt="Croatian"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Croatian
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="../../public/fr.svg"
            alt="French"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          French
        </Button>{' '}
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="../../public/es.svg"
            alt="Spanish"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Spanish
        </Button>{' '}
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="../../public/it.svg"
            alt="Italian"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Italian
        </Button>{' '}
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="../../public/jp.svg"
            alt="Japanese"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Japanese
        </Button>
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="../../public/in.svg"
            alt="Hindi"
            height={34}
            width={34}
            className="mr-4 rounded-md"
          />
          Hindi
        </Button>
      </div>
    </footer>
  )
}
