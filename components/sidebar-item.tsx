'use client'

import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  label: string
  iconSrc: string
  href: string
}

export default function SidebarItem({ label, iconSrc, href }: Props) {
  const pathName = usePathname()

  const active = pathName === href

  return (
    <Button
      variant={active ? 'sidebarOutline' : 'sidebar'}
      className="h-[52px] justify-start"
      asChild
    >
      <Link href={href}>
        {' '}
        <Image
          src={iconSrc}
          height={32}
          width={32}
          className="mr-5"
          alt={label}
        />{' '}
        {label}
      </Link>
    </Button>
  )
}
