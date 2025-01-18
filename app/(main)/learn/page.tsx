import FeedWrapper from '@/components/feed-wrapper'
import StickyWrapper from '@/components/sticky-wrapper'
import Header from './Header'
import UserProgress from '@/components/user-progress'
import { getUnits, getUserProgress } from '@/database/queries'
import { redirect } from 'next/navigation'
import Unit from './Unit'

export default async function Learn() {
  const userProgressData = getUserProgress()
  const unitsData = getUnits()

  const [units, userProgress] = await Promise.all([unitsData, userProgressData])

  if (!userProgress || !userProgress.activeCourse) {
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
        {units.map((unit) => {
          return (
            <div key={unit.id} className="mb-10">
              <Unit
                id={unit.id}
                order={unit.order}
                description={unit.description}
                title={unit.title}
                lessons={unit.lessons}
                activeLesson={undefined}
                activeLessonPercentage={0}
              />
            </div>
          )
        })}
      </FeedWrapper>
    </div>
  )
}
