import db from '@/database/drizzle'
import { challengeOptions } from '@/database/schema'
import { getAdmin } from '@/lib/admin'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const data = await db.query.challengeOptions.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: Request) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const body = await req.json()

  const data = await db
    .insert(challengeOptions)
    .values({
      ...body,
    })
    .returning()

  return NextResponse.json(data[0])
}
