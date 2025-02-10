/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useState, useTransition } from 'react'

import { useAudio, useMount, useWindowSize } from 'react-use'

import Confetti from 'react-confetti'

import {
  challengeOptions,
  challenges,
  userSubscription,
} from '@/database/schema'

import { useHeartsModal } from '@/store/use-hearts-modal'

import { Header } from './Header'
import { QuestionBubble } from './QuestionBubble'
import { Challenge } from './Challenge'
import { Footer } from './Footer'
import { ResultCard } from './ResultCard'

import { upsertChallengeProgress } from '@/actions/upsertChallengeProgress'
import { reduceHearts } from '@/actions/upsertUserProgress'

import { toast } from 'sonner'
import { usePracticeModal } from '@/store/use-practice-modal'

type Props = {
  initialLessonId: number
  initialHearts: number
  initialPercentage: number
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean
      })
    | null
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
  const { height, width } = useWindowSize()

  const [correctAudio, _c, corrrectControls] = useAudio({
    src: '/correct.wav',
  })
  const [incorrectAudio, _ic, incorrrectControls] = useAudio({
    src: '/incorrect.wav',
  })
  const [finishedAudio] = useAudio({
    src: '/finish.mp3',
    autoPlay: true,
  })

  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const [lesssonId] = useState(initialLessonId)

  const [hearts, setHearts] = useState(initialHearts)

  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage
  })

  const [challenges] = useState(initialChallenges)

  const [selectedOption, setSelectedOption] = useState<number>()

  const [status, setStatus] = useState<'correct' | 'wrong' | 'none'>('none')

  const [activeIndex, setActiveIndex] = useState(() => {
    const unfinishedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    )

    return unfinishedIndex === -1 ? 0 : unfinishedIndex
  })

  const { open: openHeartsModel } = useHeartsModal()

  const { open: openPracticeModel } = usePracticeModal()

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModel()
    }
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
              openHeartsModel()
              return
            }
            corrrectControls.play()
            setStatus('correct')
            setPercentage((prev) => prev + 100 / challenges.length)

            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5))
            }
          })
          .catch(() => toast.error('Something went wrong. Please try again!'))
      })
    } else {
      startTransition(() => {
        reduceHearts(activeChallenge.id)
          .then((response) => {
            if (response?.error === 'hearts') {
              openHeartsModel()
              return
            }
            incorrrectControls.play()
            setStatus('wrong')

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0))
            }
          })
          .catch(() => toast.error('Something went wrong. Please try again!'))
      })
    }
  }

  if (!activeChallenge)
    return (
      <>
        {' '}
        {finishedAudio}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
          width={width}
          height={height}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src="/finish.svg"
            alt="finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src="/finish.svg"
            alt="finish"
            className="lg:hidden block"
            height={50}
            width={50}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great Job! <br /> You&apos;ve completed this lesson.
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard varient="points" value={challenges.length * 10} />
            <ResultCard varient="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lesssonId}
          status="completed"
          onCheck={() => router.push('/learn')}
        />
      </>
    )

  const title =
    activeChallenge.type === 'ASSIST'
      ? 'Select the correct meaning'
      : activeChallenge.question

  return (
    <>
      {correctAudio}
      {incorrectAudio}
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
