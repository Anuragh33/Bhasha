import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import SidebarItem from './sidebar-item'
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'
import { Loader } from 'lucide-react'

type Props = {
  classname: string
}

export default function Sidebar({ classname }: Props) {
  return (
    <div
      className={cn(
        ` h-full lg:w-[256px] lg:fixed flex left-0 top-0 px-4 border-r-2 flex-col`,
        classname
      )}
    >
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items center gap-x-3">
          <Image src="/mascot.svg" height={40} width={40} alt="Bhasha Logo" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            Bhasha
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Learn" href="/learn" iconSrc="learn.svg" />
        <SidebarItem
          label="Leader Board"
          href="/leaderboard"
          iconSrc="leaderboard.svg"
        />
        <SidebarItem label="Quests" href="/quests" iconSrc="quests.svg" />{' '}
        <SidebarItem label="Shop" href="/shop" iconSrc="shop.svg" />
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className=" h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" showName />
        </ClerkLoaded>
      </div>
    </div>
  )
}
