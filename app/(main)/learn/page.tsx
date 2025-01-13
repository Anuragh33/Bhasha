import { redirect } from 'next/navigation'

import FeedWrapper from '@/components/feed-wrapper'
import StickyWrapper from '@/components/sticky-wrapper'
import UserProgress from '@/components/user-progress'

import Header from './Header'

import { getUserProgress } from '@/database/queries'

export default async function Learn() {
  const userProgressData = await getUserProgress()

  if (!userProgressData || !userProgressData.activeCourse) redirect('/courses')

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeProject={userProgressData?.activeCourse}
          hearts={userProgressData?.hearts}
          points={userProgressData?.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgressData.activeCourse.title} />
      </FeedWrapper>
    </div>
  )
}
