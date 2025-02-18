import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { getAdmin } from '@/lib/admin'
import db from '@/database/drizzle'
import { challengeOptions } from '@/database/schema'

export const GET = async (
  req: Request,
  { params }: { params: { challengeOptionId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }
  const param = await params

  const data = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, param.challengeOptionId),
  })

  return NextResponse.json(data)
}

export const PUT = async (
  req: Request,
  { params }: { params: { challengeOptionId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const param = await params

  const body = await req.json()
  const data = await db
    .update(challengeOptions)
    .set({
      ...body,
    })
    .where(eq(challengeOptions.id, param.challengeOptionId))
    .returning()

  return NextResponse.json(data[0])
}

export const DELETE = async (
  req: Request,
  { params }: { params: { challengeOptionId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const param = await params

  const data = await db
    .delete(challengeOptions)
    .where(eq(challengeOptions.id, param.challengeOptionId))
    .returning()

  return NextResponse.json(data[0])
}
