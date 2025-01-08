import MobileHeader from '@/components/mobile-header'
import Sidebar from '@/components/sidebar'

type Props = {
  children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <>
      <MobileHeader />
      <Sidebar classname="hidden lg:flex" />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className=" mx-auto max-w-[1056px] h-full pt-8">{children}</div>
      </main>
    </>
  )
}
