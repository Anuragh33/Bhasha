import { Button } from '@/components/ui/button'
import { NotebookIcon } from 'lucide-react'
import Link from 'next/link'

type Props = {
  title: string
  description: string
}

export function UnitBanner({ title, description }: Props) {
  return (
    <div className="w-full rounded-xl bg-green-500 text-white flex items-center justify-between p-5">
      <div className="space-y-2.5">
        <h3 className="font-bold text-2xl">{title}</h3>
        <p className="text-lg">{description}</p>
      </div>
      <Link href="/lesson">
        <Button
          size="lg"
          variant="secondary"
          className="hidden xl:flex border-2 border-b-4 active:border-b-2"
        >
          <NotebookIcon className="mr-2" />
          Continue
        </Button>
      </Link>
    </div>
  )
}
