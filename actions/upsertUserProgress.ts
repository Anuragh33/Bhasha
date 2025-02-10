'use server'

import { revalidatePath } from 'next/cache'

import { auth, currentUser } from '@clerk/nextjs/server'

import { and, eq } from 'drizzle-orm'

import db from '@/database/drizzle'
import {
  getCourseById,
  getUserProgress,
  getUserSubscription,
} from '@/database/queries'
import { challengeProgress, challenges, userProgress } from '@/database/schema'
import { POINTS_TO_REFILL } from '@/constants'

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth()

  const user = await currentUser()

  if (!userId || !user) {
    throw new Error(
      'You are Unauthorised to continue. Please login with your account.'
    )
  }

  const course = await getCourseById(courseId)

  if (!course) {
    throw new Error(
      'Course not found! Please enroll to a course to proceed further.'
    )
  }

  if (!course.units.length || !course.units[0].lessons.length) {
    throw new Error('Course is empty')
  }

  const existingUserProgress = await getUserProgress()

  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      userName: user.firstName || 'User',
      userImage: user.imageUrl || '/mascot.svg',
    })
  } else {
    await db.insert(userProgress).values({
      userId,
      activeCourseId: courseId,
      userName: user.firstName || 'User',
      userImage: user.imageUrl || '/mascot.svg',
    })
  }

  revalidatePath('/courses')
  revalidatePath('/learn')

  // Using redirect causing an error NEXT_REDIRECT
  //  inplace of two redirect's we are using only one return while using if else statments
  //  The unmodified code can be seen below

  return '/learn'

  // if (existingUserProgress) {
  //   await db.update(userProgress).set({
  //     activeCourseId: courseId,
  //     userName: user.firstName || 'User',
  //     userImage: user.imageUrl || '/mascot.svg',
  //   })
  //   revalidatePath('/courses')
  //   revalidatePath('/learn')
  //   redirect('/learn')
  // }

  // await db.insert(userProgress).values({
  //   userId,
  //   activeCourseId: courseId,
  //   userName: user.firstName || 'User',
  //   userImage: user.imageUrl || '/mascot.svg',
  // })

  // revalidatePath('/courses')
  // revalidatePath('/learn')
  // redirect('/learn')
}

export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorised')
  }

  const currentUserProgress = await getUserProgress()
  const userSubscription = await getUserSubscription()

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  })

  if (!challenge) {
    throw new Error('challenge is not found')
  }

  const lessonId = challenge.lessonId

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  })

  const isPractice = !!existingChallengeProgress

  if (isPractice) return { error: 'practice' }

  if (!currentUserProgress) {
    throw new Error('User progress not found.')
  }

  if (userSubscription?.isActive) {
    return { error: 'subscrption' }
  }
  if (currentUserProgress.hearts === 0) {
    return { error: 'hearts' }
  }

  await db
    .update(userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
    .where(eq(userProgress.userId, userId))

  revalidatePath('/shop')
  revalidatePath('/learn')
  revalidatePath('/quests')
  revalidatePath('/leaderboard')
  revalidatePath(`/learn/${lessonId}`)
}

export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress()

  if (!currentUserProgress) {
    throw new Error('User progrees not found')
  }

  if (currentUserProgress.hearts === 5) {
    throw new Error('User hearts are already full.')
  }

  if (currentUserProgress.points < POINTS_TO_REFILL) {
    throw new Error('Not enough points ')
  }

  await db
    .update(userProgress)
    .set({
      hearts: 5,
      points: currentUserProgress.points - POINTS_TO_REFILL,
    })
    .where(eq(userProgress.userId, currentUserProgress.userId))

  revalidatePath('/shop')
  revalidatePath('/learn')
  revalidatePath('/quests')
  revalidatePath('/leaderboard')
}
