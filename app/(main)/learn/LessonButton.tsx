'use client'

type Props = {
  id: number
  index: number
  totalCount: number
  locked?: boolean
  currrent?: boolean
  percentage: number
}

export default function LessonButton({
  id,
  index,
  totalCount,
  locked,
  currrent,
  percentage,
}: Props) {
  const cycleLength = 8
  const cycleIndex = index % cycleLength

  return <div className="">{id}</div>
}
