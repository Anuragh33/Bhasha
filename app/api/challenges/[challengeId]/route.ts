import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { getAdmin } from '@/lib/admin'
import db from '@/database/drizzle'
import { challenges } from '@/database/schema'

export const GET = async (
  req: Request,
  { params }: { params: { challengeId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const param = await params

  const data = await db.query.challenges.findFirst({
    where: eq(challenges.id, param.challengeId),
  })

  return NextResponse.json(data)
}

export const PUT = async (
  req: Request,
  { params }: { params: { challengeId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const param = await params

  const body = await req.json()
  const data = await db
    .update(challenges)
    .set({
      ...body,
    })
    .where(eq(challenges.id, param.challengeId))
    .returning()

  return NextResponse.json(data[0])
}

export const DELETE = async (
  req: Request,
  { params }: { params: { challengeId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const param = await params

  const data = await db
    .delete(challenges)
    .where(eq(challenges.id, param.challengeId))
    .returning()

  return NextResponse.json(data[0])
}
