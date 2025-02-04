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
    await db.delete(schema.units)
    await db.delete(schema.lessons)
    await db.delete(schema.challenges)
    await db.delete(schema.challengeOptions)
    await db.delete(schema.challengeProgress)

    // setTimeout(() => console.log('Previous data is deleted....'), 2000)

    // setTimeout(() => console.log('Adding new data....'), 3500)

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: 'Spanish',
        imageSrc: '/es.svg',
      },
      {
        id: 2,
        title: 'French',
        imageSrc: '/fr.svg',
      },
      {
        id: 3,
        title: 'Croatian',
        imageSrc: '/hr.svg',
      },
      {
        id: 4,
        title: 'Italian',
        imageSrc: '/it.svg',
      },
      {
        id: 5,
        title: 'Japanese',
        imageSrc: '/jp.svg',
      },
      {
        id: 6,
        title: 'Hindi',
        imageSrc: '/in.svg',
      },
    ])

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: 'Unit 1 ',
        description: 'Learn the basics of Spanish',
        order: 1,
      },
    ])

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1,
        order: 1,
        title: 'Nouns',
      },
      {
        id: 2,
        unitId: 1,
        order: 2,
        title: 'Verbs',
      },
      {
        id: 3,
        unitId: 1,
        order: 3,
        title: 'Adjectives',
      },
      {
        id: 4,
        unitId: 1,
        order: 4,
        title: 'Adverbs',
      },
      {
        id: 5,
        unitId: 1,
        order: 5,
        title: 'Punctuation',
      },
    ])

    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        type: 'SELECT',
        order: 1,
        question: 'Which one these translates to "the man"?',
      },
      {
        id: 2,
        lessonId: 1,
        type: 'ASSIST',
        order: 2,
        question: 'The Man',
      },
      {
        id: 3,
        lessonId: 1,
        type: 'SELECT',
        order: 3,
        question: 'Which one these translates to "the robot"?',
      },
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 1,
        correctOption: true,
        text: 'el hombre',
        audioSrc: '/es_man.mp3',
        imageSrc: 'man.svg',
      },
      {
        challengeId: 1,
        correctOption: false,
        text: 'la mujer',
        audioSrc: '/es_woman.mp3',
        imageSrc: 'woman.svg',
      },
      {
        challengeId: 1,
        correctOption: false,
        text: 'el robot',
        audioSrc: '/es_robot.mp3',
        imageSrc: 'robot.svg',
      },
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 2,
        correctOption: true,
        text: 'el hombre',
        audioSrc: '/es_man.mp3',
      },
      {
        challengeId: 2,
        correctOption: false,
        text: 'la mujer',
        audioSrc: '/es_woman.mp3',
      },
      {
        challengeId: 2,
        correctOption: false,
        text: 'el robot',
        audioSrc: '/es_robot.mp3',
      },
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 3,
        correctOption: false,
        text: 'el hombre',
        audioSrc: '/es_man.mp3',
        imageSrc: 'man.svg',
      },
      {
        challengeId: 3,
        correctOption: false,
        text: 'la mujer',
        audioSrc: '/es_woman.mp3',
        imageSrc: 'woman.svg',
      },
      {
        challengeId: 3,
        correctOption: true,
        text: 'el robot',
        audioSrc: '/es_robot.mp3',
        imageSrc: 'robot.svg',
      },
    ])

    await db.insert(schema.challenges).values([
      {
        id: 4,
        lessonId: 2,
        type: 'SELECT',
        order: 1,
        question: 'Which one these translates to "the man"?',
      },
      {
        id: 5,
        lessonId: 2,
        type: 'ASSIST',
        order: 2,
        question: 'The Man',
      },
      {
        id: 6,
        lessonId: 2,
        type: 'SELECT',
        order: 3,
        question: 'Which one these translates to "the robot"?',
      },
    ])

    // setTimeout(() => console.log('Seeding Finished....'), 7000)
    console.log('Seeding Finished....')
  } catch (error) {
    console.log(error)
    throw new Error('Failed to seed the database.')
  }
}

main()
