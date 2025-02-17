/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '@/database/drizzle'
import { userSubscription } from '@/database/schema'
import { getAdmin } from '@/lib/admin'
import { stripe } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const isAdmin = await getAdmin()

  if (!isAdmin) {
    return new NextResponse('Unauthorised', { status: 401 })
  }
  const body = await req.text()

  const signature = (await headers()).get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook message ${error.message}`, {
      status: 400,
    })
  }

  const session = event.data.object as Stripe.Checkout.Session

  //User is a new subscriber for the service
  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )
    if (!session?.metadata?.userId) {
      return new NextResponse('User ID is required', { status: 400 })
    }

    await db.insert(userSubscription).values({
      userId: session.metadata.userId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeSubscriptionId: subscription.id,
    })
  }

  //User renewed their susbcription for the service
  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await db
      .update(userSubscription)
      .set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      })
      .where(eq(userSubscription.stripeSubscriptionId, subscription.id))
  }

  return new NextResponse(null, { status: 200 })
}
