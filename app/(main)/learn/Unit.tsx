/* eslint-disable @typescript-eslint/no-unused-vars */
import { lessons, units } from '@/database/schema'
import { LessonButton } from './LessonButton'
import { UnitBanner } from './UnitBanner'

type Props = {
  id: number
  order: number
  description: string
  title: string
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean
  })[]
  activeLesson:
    | (typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect
      })
    | undefined
  activeLessonPercentage: number
}

export function Unit({
  id,
  order,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
  title,
}: Props) {
  return (
    <>
      <UnitBanner title={title} description={description} />

      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id

          const isLocked = !lesson.completed && !isCurrent

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
            />
          )
        })}
      </div>
    </>
  )
}
