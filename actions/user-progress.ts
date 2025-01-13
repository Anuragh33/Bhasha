'use server'

import db from '@/database/drizzle'
import { getCourseById, getUserProgress } from '@/database/queries'
import { userProgress } from '@/database/schema'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
    revalidatePath('/courses')
    revalidatePath('/learn')
    redirect('/learn')
  }

  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || 'User',
    userImage: user.imageUrl || '/mascot.svg',
  })

  revalidatePath('/courses')
  revalidatePath('/learn')
  redirect('/learn')
}
