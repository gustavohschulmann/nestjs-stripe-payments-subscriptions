import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Injectable, RawBodyRequest } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import Stripe from 'stripe'

interface CheckoutUseCaseRequest {
  payload: RawBodyRequest<Request> // eslint-disable-line
  signature: string
}

export type CheckoutUseCaseResponse = Either<null, null>

@Injectable()
export class StripeSubscriptionWebhookUseCase {
  constructor(@InjectStripeClient() private stripeClient: Stripe) {}

  async execute({
    payload,
    signature,
  }: CheckoutUseCaseRequest): Promise<CheckoutUseCaseResponse> {
    let event: Stripe.Event
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = 'whsec_1234'
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      try {
        event = this.stripeClient.webhooks.constructEvent(
          payload.rawBody,
          signature,
          endpointSecret,
        )
      } catch (err) {
        console.log(`❌ Webhook signature verification failed.`, err.message)
        return left(null)
      }
    }
    // Successfully constructed event
    console.log('✅ Success:', event.id)

    // Handle the event
    // Cast event data to Stripe object
    if (event.type === 'payment_intent.succeeded') {
      const stripeObject: Stripe.PaymentIntent = event.data
        .object as Stripe.PaymentIntent
      console.log(`💰 PaymentIntent status: ${stripeObject.status}`)
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge
      console.log(`💵 Charge id: ${charge.id}`)
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
    }

    return right(null)
  }
}
