import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import Sidebar from './sidebar'

export default function MobileSidebar() {
  return (
    // SheetTitle, SheetDescription are used here so that will not get errors of Dialoge-Title & Dialoge-Sheet errors on the console.

    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>

      <SheetContent className="p-0 z-[100] " side="left">
        <SheetTitle className="hidden"></SheetTitle>
        <SheetDescription className="hiiden"></SheetDescription>
        <Sidebar classname="pt-8" />
      </SheetContent>
    </Sheet>
  )
}
