'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

import { useHeartsModal } from '@/store/use-hearts-modal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const HeartsModal = () => {
  const router = useRouter()

  const [isClient, setIsClient] = useState(false)

  const { isOpen, close } = useHeartsModal()

  useEffect(() => setIsClient(true), [])

  const onClick = () => {
    close()
    router.push('/store')
  }

  if (!isClient) return null

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            {' '}
            <Image
              src="/mascot_bad.svg"
              alt="Bad Mascot"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            You ran out of Hearts!!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Subscribe to Pro for Unlimited Hearts or Purchase Hearts from Store.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onClick}
            >
              Subscribe to Pro
            </Button>
            <Button
              variant="primaryOutline"
              size="lg"
              className="w-full"
              onClick={close}
            >
              Not this time!
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
