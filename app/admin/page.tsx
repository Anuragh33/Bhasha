'use client'

import { getAdmin } from '@/lib/admin'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

const App = dynamic(() => import('./App'), { ssr: false })

export default async function page() {
  const isAdmin = await getAdmin()

  if (!isAdmin) redirect('/')

  return <App />
}
