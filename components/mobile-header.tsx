import MobileSidebar from './mobile-sidebar'

export default function MobileHeader() {
  return (
    <nav className="lg:hidden px-6 h-[50px] flex items-center bg-green-500 z-50 top-0 w-full border-b fixed">
      <MobileSidebar />
    </nav>
  )
}
