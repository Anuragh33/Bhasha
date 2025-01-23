import { redirect } from 'next/navigation'

import { Header } from './Header'
import { Unit } from './Unit'

import { FeedWrapper } from '@/components/feed-wrapper'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { UserProgress } from '@/components/user-progress'

import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
} from '@/database/queries'

export default async function Learn() {
  const userProgressData = getUserProgress()
  const unitsData = getUnits()
  const courseProgressData = getCourseProgress()
  const lessonPercentageData = getLessonPercentage()

  const [units, userProgress, courseProgress, lessonPercentage] =
    await Promise.all([
      unitsData,
      userProgressData,
      courseProgressData,
      lessonPercentageData,
    ])

  if (!userProgress || !userProgress.activeCourse || !courseProgress) {
    redirect('/courses')
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeProject={userProgress?.activeCourse}
          hearts={userProgress?.hearts}
          points={userProgress?.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress?.activeLesson}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
}
