import { cn } from '@/lib/utils'
import Image from 'next/image'

type Props = {
  varient: 'points' | 'hearts'
  value: number
}

export function ResultCard({ value, varient }: Props) {
  const imageSrc = varient === 'hearts' ? '/heart.svg' : 'points.svg'

  return (
    <div
      className={cn(
        'rounded-2xl border-2 w-full',
        varient === 'points' && 'bg-orange-400 border-orange-400',
        varient === 'hearts' && 'bg-rose-500 border-rose-500'
      )}
    >
      <div
        className={cn(
          'p-1.5 text-white rounded-t-xl font-bold text-center text-xs uppercase',
          varient === 'points' && 'bg-orange-400 ',
          varient === 'hearts' && 'bg-rose-500 '
        )}
      >
        {varient === 'hearts' ? 'Hearts Left' : 'Total Xp'}
      </div>
      <div
        className={cn(
          'rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg',
          varient === 'points' && 'text-orange-400 ',
          varient === 'hearts' && 'text-rose-500 '
        )}
      >
        <Image
          src={imageSrc}
          alt={varient === 'hearts' ? 'Hearts' : 'Points'}
          height={30}
          width={30}
          className="mr-1.5"
        />
        {value}
      </div>
    </div>
  )
}
