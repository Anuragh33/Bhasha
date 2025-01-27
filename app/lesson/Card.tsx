import { challenges } from '@/database/schema'
import { cn } from '@/lib/utils'

type Props = {
  id: number
  text: string
  imageSrc: string | null
  audioSrc: string | null
  selected?: boolean
  type: (typeof challenges.$inferSelect)['type']
  status?: 'correct' | 'wrong' | 'none'
  disabled?: boolean
  shortcut: string
  onClick: () => void
}

export function Card({
  id,
  imageSrc,
  text,
  type,
  audioSrc,
  shortcut,
  selected,
  status,
  onClick,
  disabled,
}: Props) {
  return (
    <div
      className={cn(
        'h-full border-2 rounded-xl border-b-4 hover:bg-black/5 p-4 lg:p-6 cursor-pointer active:border-b-2',
        selected && 'border-sky-300 bg-sky-100 hover:bg-sky-100',
        selected &&
          status === 'correct' &&
          'border-green-300 bg-green-100 hover:bg-green-100',
        selected &&
          status === 'wrong' &&
          'border-rose-300 bg-rose-100 hover:bg-rose-100',
        disabled && ''
      )}
      onClick={() => {}}
    >
      card
    </div>
  )
}
