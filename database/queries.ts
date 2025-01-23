/* eslint-disable @typescript-eslint/no-unused-vars */
import { cache } from 'react'
import db from './drizzle'
import { auth } from '@clerk/nextjs/server'
import { asc, eq } from 'drizzle-orm'
import {
  challengeProgress,
  challenges,
  courses,
  lessons,
  units,
  userProgress,
} from './schema'

export const getCourses = cache(async () => {
  const data = db.query.courses.findMany()

  return data
})

////////////////////////////////////////////////////////////////////////////////////

export const getUserProgress = cache(async () => {
  const { userId } = await auth()

  if (!userId) return null

  const data = db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  })

  return data
})

////////////////////////////////////////////////////////////////////////////////////

export const getCourseById = cache(async (courseId: number) => {
  const data = db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  })

  return data
})

////////////////////////////////////////////////////////////////////////////////////

export const getUnits = cache(async () => {
  const userProgress = await getUserProgress()
  const { userId } = await auth()

  if (!userId || !userProgress?.activeCourseId) {
    return []
  }

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  })

  const normalizedData = data.map((unit) => {
    const lessonWithCompletedStatus = unit.lessons.map((lesson) => {
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        )
      })

      return { ...lesson, completed: allCompletedChallenges }
    })
    return { ...unit, lessons: lessonWithCompletedStatus }
  })
  return normalizedData
})

////////////////////////////////////////////////////////////////////////////////////

const getCourseProgress = cache(async () => {
  const { userId } = await auth()
  const userProgress = await getUserProgress()

  if (!userId || !userProgress || !userProgress.activeCourseId) return null

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  })

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          (challenge.challengeProgress.length === 0 &&
            challenge.challengeProgress.every(
              (progress) => progress.completed === false
            ))
        )
      })
    })

  return {
    activeLesson: firstUncompletedLesson,
    activeLessonid: firstUncompletedLesson?.id,
  }
})
////////////////////////////////////////////////////////////////////////////////////

const getLesson = cache(async (id?: number) => {
  const { userId } = await auth()
  const courseProgress = await getCourseProgress()

  if (
    !userId ||
    !courseProgress ||
    !courseProgress.activeLessonid ||
    !courseProgress.activeLesson
  )
    return null

  const lessonId = id || courseProgress.activeLessonid

  if (!lessonId) return null

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  })

  if (!data || !data.challenges) return null

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed)

    return { ...challenge, completed }
  })

  return { ...data, challenges: normalizedChallenges }
})
////////////////////////////////////////////////////////////////////////////////////
