import './globals.css'

import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import { ExitModal } from '@/components/modals/exit-modal'
import { HeartsModal } from '@/components/modals/hearts-modal'

const font = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bhasha',
  description: 'Bhasha, Your ultimate language learning companion!',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <Toaster />
          <HeartsModal />
          <ExitModal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
