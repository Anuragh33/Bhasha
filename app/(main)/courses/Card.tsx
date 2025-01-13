/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import Image from 'next/image'

type Props = {
  title: string
  id: number
  imageSrc: string
  disabled?: boolean
  active?: boolean
  onClick(id: number): void
}

export function Card({
  title,
  id,
  imageSrc,
  active,
  disabled,
  onClick,
}: Props) {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        'h-full flex flex-col items-center justify-between border-2 rounded-xl border-b-4 active:border-b-2 hover:bg-black/5 min-h-[217px] min-w-[200px] p-3 pb-6 cursor-pointer',
        disabled && 'pointer-events-none opacity-'
      )}
    >
      <div className="min-h-[24px] w-full flex items-center justify-end">
        {active && (
          <div className="rounded-md p-1.5 bg-green-500 flex items-center justify-center">
            {' '}
            <Check className="text-white stroke-[4] h-4 w-4" />
          </div>
        )}
      </div>
      <Image
        src={imageSrc}
        height={70}
        width={93.33}
        alt={title}
        className="rounded-lg border drop-shadow-md object-cover"
      />
      <p className="font-bold text-neutral-700 text-center mt-3">{title}</p>
    </div>
  )
}
