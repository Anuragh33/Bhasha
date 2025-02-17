import db from '@/database/drizzle'

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
