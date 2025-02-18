import dynamic from 'next/dynamic'

import { redirect } from 'next/navigation'

import { getAdmin } from '@/lib/admin'

const App = dynamic(() => import('./app'), { ssr: !!false })

export default function page() {
  const isAdmin = getAdmin()

  if (!isAdmin) redirect('/')

  return <App />
}
