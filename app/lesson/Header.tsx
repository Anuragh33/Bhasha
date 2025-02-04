import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useExitModal } from '@/store/use-exit-modal'
import { InfinityIcon, X } from 'lucide-react'
import Image from 'next/image'

type Props = {
  hearts: number
  percentage: number
  hasActiveUserSubscription: boolean
}

export function Header({
  hasActiveUserSubscription,
  hearts,
  percentage,
}: Props) {
  const { open } = useExitModal()

  return (
    <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full">
      <Button size="sm" variant="danger" onClick={open}>
        <X
          color="white"
          className="text-slate-500 hover:opacity-75 transition cursor-pointer"
        />
      </Button>

      {/* <X
        onClick={open}
        className="text-slate-500 hover:opacity-75 transition cursor-pointer"
      /> */}

      <Progress value={percentage} />
      <div className="text-rose-500 flex items-center font-bold">
        <Image
          src="/heart.svg"
          alt="Hearts"
          height={28}
          width={28}
          className="mr-2"
        />
        {hasActiveUserSubscription ? (
          <InfinityIcon className="h-6 w-6 stroke-[3]" />
        ) : (
          hearts
        )}
      </div>
    </header>
  )
}
