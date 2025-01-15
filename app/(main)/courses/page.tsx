import { getCourses, getUserProgress } from '@/database/queries'
import { List } from './List'

export default async function Courses() {
  const courses = await getCourses()
  const useProgress = await getUserProgress()

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="tesxt-2xl font-bold text-neutral-700">
        {' '}
        Language Courses
      </h1>
      <List courses={courses} activeCourseId={useProgress?.activeCourseId} />
    </div>
  )
}
