'use client'

import { challengeOptions, challenges } from '@/database/schema'
import { useState } from 'react'
import Header from './Header'

type Props = {
  initialLessonId: number
  initialHearts: number
  initialPercentage: number
  userSubscription: any
  initialChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOptions: (typeof challengeOptions.$inferSelect)[]
  })[]
}

export default function Quiz({
  initialChallenges,
  initialHearts,
  initialLessonId,
  initialPercentage,
  userSubscription,
}: Props) {
  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(initialPercentage)

  const [challenges] = useState(initialChallenges)

  const [activeIndex, setactiveIndex] = useState(() => {
    const unfinishedChallengeIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    )

    return unfinishedChallengeIndex === -1 ? 0 : unfinishedChallengeIndex
  })

  const activeChallenge = challenges[activeIndex]

  const title =
    activeChallenge.type === 'ASSIST'
      ? 'Select the correct meaning'
      : activeChallenge.question

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveUserSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex justify-center items-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center  lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div></div>
          </div>
        </div>
      </div>
    </>
  )
}
