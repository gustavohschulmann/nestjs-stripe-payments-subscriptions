import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import Stripe from 'stripe'

interface CheckoutUseCaseRequest {
  plan: string
}

export type CheckoutUseCaseResponse = Either<null, { redirectUrl: string }>

@Injectable()
export class CheckoutPlayerUseCase {
  constructor(@InjectStripeClient() private stripeClient: Stripe) {}

  async execute({
    plan,
  }: CheckoutUseCaseRequest): Promise<CheckoutUseCaseResponse> {
    const prices = await this.stripeClient.prices.list({
      lookup_keys: [plan],
      expand: ['data.product'],
    })
    const session = await this.stripeClient.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/checkout`,
    })

    console.log(session)

    return right({ redirectUrl: session.url })
  }
}
