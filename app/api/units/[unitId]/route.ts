import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import db from '@/database/drizzle'
import { units } from '@/database/schema'

import { getAdmin } from '@/lib/admin'

export const GET = async (
  req: Request,
  { params }: { params: { unitId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const param = await params

  const data = await db.query.units.findFirst({
    where: eq(units.id, param.unitId),
  })

  return NextResponse.json(data)
}

/////////////////////////////////////////////////////////////////////////////////

export const PUT = async (
  req: Request,
  { params }: { params: { unitId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }
  const param = await params

  const body = await req.json()

  const data = await db
    .update(units)
    .set({
      ...body,
    })
    .where(eq(units.id, param.unitId))
    .returning()

  return NextResponse.json(data)
}

/////////////////////////////////////////////////////////////////////////////////

export const DELETE = async (
  req: Request,
  { params }: { params: { unitId: number } }
) => {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }

  const param = await params

  const data = await db
    .delete(units)
    .where(eq(units.id, param.unitId))
    .returning()

  return NextResponse.json(data)
}
