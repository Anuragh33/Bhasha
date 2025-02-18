import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import db from '@/database/drizzle'
import { lessons } from '@/database/schema'

import { getAdmin } from '@/lib/admin'

export const GET = async (
  req: Request,
  { params }: { params: { lessonId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }
  const param = await params

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, param.lessonId),
  })

  return NextResponse.json(data)
}

/////////////////////////////////////////////////////////////////////////////////

export const PUT = async (
  req: Request,
  { params }: { params: { lessonId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }
  const param = await params

  const body = await req.json()

  const data = await db
    .update(lessons)
    .set({
      ...body,
    })
    .where(eq(lessons.id, param.lessonId))
    .returning()

  return NextResponse.json(data)
}

/////////////////////////////////////////////////////////////////////////////////

export const DELETE = async (
  req: Request,
  { params }: { params: { lessonId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const param = await params

  const data = await db
    .delete(lessons)
    .where(eq(lessons.id, param.lessonId))
    .returning()

  return NextResponse.json(data)
}
