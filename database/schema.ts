/* eslint-disable @typescript-eslint/no-unused-vars */
import { relations } from 'drizzle-orm'
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull(),
})

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}))

/////////////////////////////////////////////////////

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  courseId: integer('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  order: integer('order').notNull(),
})

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

/////////////////////////////////////////////////////

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  unitId: integer('unit_id')
    .notNull()
    .references(() => units.id, {
      onDelete: 'cascade',
    }),
  order: integer('order').notNull(),
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}))

/////////////////////////////////////////////////////

export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST'])

export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id')
    .notNull()
    .references(() => lessons.id, {
      onDelete: 'cascade',
    }),
  type: challengesEnum('type').notNull(),
  question: text('question').notNull(),
  order: integer('order').notNull(),
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}))

/////////////////////////////////////////////////////

export const challengeOptions = pgTable('challenge_options', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id')
    .notNull()
    .references(() => challenges.id, {
      onDelete: 'cascade',
    }),
  correctOption: boolean('correct_option').notNull(),
  text: text('text').notNull(),
  imageSrc: text('img_src'),
  audioSrc: text('audio_src'),
})

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one, many }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
)

/////////////////////////////////////////////////////

export const challengeProgress = pgTable('challenge_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  challengeId: integer('challenge_id')
    .notNull()
    .references(() => challenges.id, {
      onDelete: 'cascade',
    }),
  completed: boolean('completed').notNull().default(false),
})

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one, many }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
)

/////////////////////////////////////////////////////

export const userProgress = pgTable('user_progress', {
  userId: text('userId').primaryKey(),
  userName: text('user_name').notNull().default('User'),
  userImage: text('user_image_src').notNull().default('/mascot.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, {
    onDelete: 'cascade',
  }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(50),
})

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}))

export const userSubscription = pgTable('userSubscription', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  stripePriceId: text('stripePriceId').notNull().unique(),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end')
    .notNull()
    .unique(),
})
