import Image from 'next/image'
import { redirect } from 'next/navigation'

import { FeedWrapper } from '@/components/feed-wrapper'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { UserProgress } from '@/components/user-progress'

import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from '@/database/queries'

export default async function page() {
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscription()
  const topTenUsersData = getTopTenUsers()

  const [userProgress, userSubscription, topTenUsers] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    topTenUsersData,
  ])

  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses')
  }
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeProject={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image src="/quests.svg" alt="Leaderboard" height={90} width={90} />
          <h1 className="text-neutral-700 text-center font-bold text-2xl my-6">
            Quests
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Complete quests by earning points.
          </p>
        </div>
      </FeedWrapper>
    </div>
  )
}
