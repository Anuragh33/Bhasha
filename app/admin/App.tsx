'use client'

import { Admin, Resource } from 'react-admin'

import simpleRestProvider from 'ra-data-simple-rest'

const dataProvider = simpleRestProvider('/api')

export default function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="courses/>
    </Admin>
  )
}
