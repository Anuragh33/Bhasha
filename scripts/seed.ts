import 'dotenv/config'

import * as schema from '../database/schema'

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

const db = drizzle(sql, { schema })

const main = async () => {
  try {
    console.log('Seeding Database....')

    await db.delete(schema.courses)

    await db.delete(schema.userProgress)

    setTimeout(() => console.log('Adding Courses....'), 1500)

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: 'Hindi',
        imageSrc: '/in.svg',
      },
    ])

    setTimeout(() => console.log('Seeding Finished....'), 4000)
  } catch (error) {
    console.log(error)
    throw new Error('Failed to seed database.')
  }
}

main()
