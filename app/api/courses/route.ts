import db from '@/database/drizzle'
import { courses } from '@/database/schema'

import { getAdmin } from '@/lib/admin'

import { NextResponse } from 'next/server'

export const GET = async () => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const data = await db.query.courses.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: Request) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const body = await req.json()

  const data = await db
    .insert(courses)
    .values({
      ...body,
    })
    .returning()

  return NextResponse.json(data[0])
}
