'use client'

import { Admin, Resource } from 'react-admin'

import simpleRestProvider from 'ra-data-simple-rest'
import { CourseList } from './course/List'

const dataProvider = simpleRestProvider('/api')

export default function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="courses" list={CourseList} recordRepresentation="title" />
    </Admin>
  )
}
