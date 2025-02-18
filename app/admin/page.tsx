import { getAdmin } from '@/lib/admin'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

const App = dynamic(() => import('../admin/app'), { ssr: !!false })

export default function page() {
  const isAdmin = getAdmin()

  if (!isAdmin) redirect('/')

  return <App />
}
