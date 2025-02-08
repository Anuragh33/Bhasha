'use server'

import { getUserSubscription } from '@/database/queries'
import { stripe } from '@/lib/stripe'
import { absoluteURl } from '@/lib/utils'
import { auth, currentUser } from '@clerk/nextjs/server'
import { Description } from '@radix-ui/react-dialog'
import { Currency } from 'lucide-react'

const returnURL = absoluteURl('/shop')

export const createStripeURl = async () => {
  const { userId } = await auth()

  const user = await currentUser()

  if (!userId || !user) {
    throw new Error('Unauthorized')
  }

  const userSubscriptionData = await getUserSubscription()

  if (userSubscriptionData && userSubscriptionData?.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      return_url: returnURL,
      customer: userSubscriptionData.stripeCustomerId,
    })

    return { data: stripeSession.url }
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card', 'affirm', 'paypal'],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: 'Bhasha Pro',
            description: 'Unlimited Hearts',
          },
          unit_amount: 2000,
          recurring: {
            interval: 'month',
          },
        },
      },
    ],
    metadata: { userId },
  })
}
