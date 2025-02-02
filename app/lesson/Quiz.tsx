/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useTransition } from 'react'

import { challengeOptions, challenges } from '@/database/schema'

import { Header } from './Header'
import { QuestionBubble } from './QuestionBubble'
import { Challenge } from './Challenge'
import { Footer } from './Footer'
import { upsertChallengeProgress } from '@/actions/upsertChallengeProgress'
import { toast } from 'sonner'

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
  const [isPending, startTransition] = useTransition()

  const [hearts, setHearts] = useState(initialHearts)

  const [percentage, setPercentage] = useState(initialPercentage)

  const [challenges] = useState(initialChallenges)

  const [selectedOption, setSelectedOption] = useState<number>()

  const [status, setStatus] = useState<'correct' | 'wrong' | 'none'>('none')

  const [activeIndex, setActiveIndex] = useState(() => {
    const unfinishedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    )

    return unfinishedIndex === -1 ? 0 : unfinishedIndex
  })

  const activeChallenge = challenges[activeIndex]

  const options = activeChallenge?.challengeOptions ?? []

  const onSelect = (id: number) => {
    if (status !== 'none') return

    setSelectedOption(id)
  }

  const onNext = () => {
    setActiveIndex((current) => current + 1)
  }

  const onContinue = () => {
    if (!selectedOption) return

    if (status === 'wrong') {
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    if (status === 'correct') {
      onNext()
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    const correctOptionInChallenge = options.find(
      (option) => option.correctOption
    )

    if (!correctOptionInChallenge) return

    if (correctOptionInChallenge.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(activeChallenge.id)
          .then((response) => {
            if (response?.error === 'hearts') {
              console.error('Missing Hearts!')
              return
            }

            setStatus('correct')
            setPercentage((prev) => prev + 100 / challenges.length)

            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5))
            }
          })
          .catch(() =>
            toast.error('Something went wrong. Please try again later.')
          )
      })
    } else {
      console.log()
    }
  }

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
            <div>
              {activeChallenge?.type === 'ASSIST' && (
                <QuestionBubble question={activeChallenge.question} />
              )}

              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={isPending}
                type={activeChallenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        status={status}
        disabled={isPending || !selectedOption}
        onCheck={onContinue}
      />
    </>
  )
}
