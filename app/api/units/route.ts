import db from '@/database/drizzle'
import { units } from '@/database/schema'

import { getAdmin } from '@/lib/admin'

import { NextResponse } from 'next/server'

export const GET = async () => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const data = await db.query.units.findMany()

  return NextResponse.json(data)
}

export const POST = async (req: Request) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const body = await req.json()

  const data = await db
    .insert(units)
    .values({
      ...body,
    })
    .returning()

  return NextResponse.json(data[0])
}
