import { getLesson, getUserProgress } from '@/database/queries'
import { redirect } from 'next/navigation'

import Quiz from './Quiz'

export default async function page() {
  const lessonsData = getLesson()

  const userProgressData = getUserProgress()

  const [lesson, userProgress] = await Promise.all([
    lessonsData,
    userProgressData,
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
      userSubscription={undefined}
    />
  )
}
