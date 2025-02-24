import Image from 'next/image'
import { redirect } from 'next/navigation'

import { Avatar, AvatarImage } from '@radix-ui/react-avatar'

import { FeedWrapper } from '@/components/feed-wrapper'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { UserProgress } from '@/components/user-progress'

import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from '@/database/queries'
import { Separator } from '@/components/ui/separator'

import { Quests } from '@/components/quests'
import { Promo } from '@/components/promo'

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

  const isPro = !!userSubscription?.isActive

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeProject={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />

        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/leaderboard.svg"
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className="text-neutral-700 text-center font-bold text-2xl my-6">
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among others in the community.
          </p>

          <Separator className="mb-4 h-0.5 rounded-full " />
          {/* <div className="w-full rounded-full border-t-2 mb-4" /> */}
          {topTenUsers.map((userProgress, index) => (
            <div
              className="flex items-center p-2 px-4 w-full rounded-xl hover:bg-gray-200/50"
              key={userProgress.userId}
            >
              <p className="font-bold mr-4 text-lime-700">{index + 1}</p>
              <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                <AvatarImage
                  className="object-cover"
                  src={userProgress.userImage}
                />
              </Avatar>
              <p className="font-bold flex-1 text-neutral-800">
                {userProgress.userName}
              </p>
              <p className="text-muted-foreground">{userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  )
}
