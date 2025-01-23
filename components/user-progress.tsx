import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'
import { InfinityIcon } from 'lucide-react'
import { courses } from '@/database/schema'

type Props = {
  hasActiveSubscription: boolean
  hearts: number
  points: number
  activeProject: typeof courses.$inferSelect
}

export function UserProgress({
  hasActiveSubscription,
  hearts,
  points,
  activeProject,
}: Props) {
  return (
    <div className="flex items-center justify-between w-full gap-x-2">
      <Link href="/courses">
        <Button variant="ghost">
          <Image
            alt={activeProject.title}
            src={activeProject.imageSrc}
            width={32}
            height={32}
            className="rounded-md border"
          />
        </Button>
      </Link>
      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          <Image
            alt="Points"
            src="/points.svg"
            width={28}
            height={28}
            className="mr-2"
          />
          {points}
        </Button>
      </Link>
      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          <Image
            alt="Hearts"
            src="/heart.svg"
            width={22}
            height={22}
            className="mr-2"
          />
          {hasActiveSubscription ? (
            <InfinityIcon className="h-4 w-4 stroke-[3]" />
          ) : (
            hearts
          )}
        </Button>
      </Link>
    </div>
  )
}
