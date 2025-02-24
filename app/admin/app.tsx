'use client'

import { Admin, Resource } from 'react-admin'

import simpleRestProvider from 'ra-data-simple-rest'

import { CourseList } from './course/List'
import { CourseCreate } from './course/Create'
import { CourseEdit } from './course/Edit'
import { UnitList } from './unit/List'
import { UnitCreate } from './unit/Create'
import { UnitEdit } from './unit/Edit'
import { LessonList } from './lesson/List'
import { LessonCreate } from './lesson/Create'
import { LessonEdit } from './lesson/Edit'
import { ChallengeList } from './challenge/List'
import { ChallengeCreate } from './challenge/Create'
import { ChallengeEdit } from './challenge/Edit'
import { ChallengeOptionList } from './challengeOption/List'
import { ChallengeOptionCreate } from './challengeOption/Create'
import { ChallengeOptionEdit } from './challengeOption/Edit'

const dataProvider = simpleRestProvider('/api')

export default function app() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="courses"
        list={CourseList}
        create={CourseCreate}
        edit={CourseEdit}
        recordRepresentation="title"
      />
      <Resource
        name="units"
        list={UnitList}
        create={UnitCreate}
        edit={UnitEdit}
        recordRepresentation="title"
      />
      <Resource
        name="lessons"
        list={LessonList}
        create={LessonCreate}
        edit={LessonEdit}
        recordRepresentation="title"
      />{' '}
      <Resource
        name="challenges"
        list={ChallengeList}
        create={ChallengeCreate}
        edit={ChallengeEdit}
        recordRepresentation="title"
      />{' '}
      <Resource
        name="challengeoption"
        list={ChallengeOptionList}
        create={ChallengeOptionCreate}
        edit={ChallengeOptionEdit}
        recordRepresentation="title"
      />
    </Admin>
  )
}
