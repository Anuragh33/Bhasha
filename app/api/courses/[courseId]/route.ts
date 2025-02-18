import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import db from '@/database/drizzle'
import { courses } from '@/database/schema'

import { getAdmin } from '@/lib/admin'

export const GET = async (
  req: Request,
  { params }: { params: { courseId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }
  const param = await params

  const data = await db.query.courses.findFirst({
    where: eq(courses.id, param.courseId),
  })

  return NextResponse.json(data)
}

/////////////////////////////////////////////////////////////////////////////////

export const PUT = async (
  req: Request,
  { params }: { params: { courseId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }
  const param = await params

  const body = await req.json()

  const data = await db
    .update(courses)
    .set({
      ...body,
    })
    .where(eq(courses.id, param.courseId))
    .returning()

  return NextResponse.json(data)
}

/////////////////////////////////////////////////////////////////////////////////

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const param = await params

  const data = await db
    .delete(courses)
    .where(eq(courses.id, param.courseId))
    .returning()

  return NextResponse.json(data)
}
