import 'dotenv/config'

import * as schema from '../database/schema'

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

const db = drizzle(sql, { schema })

const main = async () => {
  try {
    console.log('Resetting the Database....')

    await db.delete(schema.courses)

    await db.delete(schema.userProgress)
    await db.delete(schema.units)
    await db.delete(schema.lessons)
    await db.delete(schema.challenges)
    await db.delete(schema.challengeOptions)
    await db.delete(schema.challengeProgress)
    await db.delete(schema.userSubscription)

    console.log('Resetting Finished....')
  } catch (error) {
    console.log(error)
    throw new Error('Failed to seed the database.')
  }
}

main()
