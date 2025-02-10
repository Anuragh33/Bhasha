import {
  getLesson,
  getUserProgress,
  getUserSubscription,
} from '@/database/queries'
import { redirect } from 'next/navigation'

import Quiz from '../Quiz'

type Props = {
  params: {
    lessonId: number
  }
}
export default async function page({ params }: Props) {
  const param = await params

  const lessonData = getLesson(Number(param.lessonId))

  const userProgressData = getUserProgress()

  const userSubscriptionData = getUserSubscription()

  const [userProgress, lesson, userSubscription] = await Promise.all([
    userProgressData,
    lessonData,
    userSubscriptionData,
  ])

  if (!lesson || !userProgress) return redirect('/learn')

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  )
}
