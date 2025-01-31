/* eslint-disable @typescript-eslint/no-unused-vars */
import db from '@/database/drizzle'
import { getUserProgress } from '@/database/queries'
import { challengeProgress, challenges, userProgress } from '@/database/schema'
import { auth } from '@clerk/nextjs/server'
import { error } from 'console'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth()

  if (!userId) return

  const currentUserProgress = await getUserProgress()

  if (!currentUserProgress) {
    throw new Error('User progress not found.')
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  })

  if (!challenge) {
    throw new Error('Challenge not found.')
  }

  const lessonId = challenge?.lessonId

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.challengeId, challengeId),
      eq(challengeProgress.userId, userId)
    ),
  })

  const isPractice = !!existingChallengeProgress

  if (currentUserProgress.hearts === 0 && !isPractice) {
    return { error: 'hearts' }
  }

  if (isPractice) {
    await db
      .update(challengeProgress)
      .set({
        completed: true,
      })
      .where(eq(challengeProgress.id, existingChallengeProgress.id))

    await db
      .update(userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1),
        points: currentUserProgress.points + 10,
      })
      .where(eq(userProgress.userId, userId))

    revalidatePath('/learn')
    revalidatePath('/lesson')
    revalidatePath('/quests')
    revalidatePath('/leaderboard')
    revalidatePath(`/lesson/${lessonId}`)
    return
  }

  await db.update(challengeProgress).set({
    completed: true,
    challengeId,
    userId,
  })

  await db
    .update(userProgress)
    .set({
      points: currentUserProgress.points + 10,
    })
    .where(eq(userProgress.userId, userId))

  revalidatePath('/learn')
  revalidatePath('/lesson')
  revalidatePath('/quests')
  revalidatePath('/leaderboard')
  revalidatePath(`/lesson/${lessonId}`)
}
