'use server'

import db from '@/database/drizzle'
import { getCourseById, getUserProgress } from '@/database/queries'
import { challengeProgress, userProgress } from '@/database/schema'
import { auth, currentUser } from '@clerk/nextjs/server'
import { error } from 'console'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

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
  //Enable only when units & lessons are added.

  // else if (!course.units.length || !course.units[0].lesson.length) {
  //   throw new Error('Course is empty')
  // }

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
}
