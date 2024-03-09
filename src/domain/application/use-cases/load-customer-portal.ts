import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import Stripe from 'stripe'

interface LoadCustomerPortalUseCaseRequest {
  sessionId: string
}

export type LoadCustomerPortalUseCaseResponse = Either<
  null,
  { redirectUrl: string }
>

@Injectable()
export class LoadCustomerPortalUseCase {
  constructor(@InjectStripeClient() private stripeClient: Stripe) {}

  async execute({
    sessionId,
  }: LoadCustomerPortalUseCaseRequest): Promise<LoadCustomerPortalUseCaseResponse> {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const checkoutSession =
      await this.stripeClient.checkout.sessions.retrieve(sessionId)

    const portalSession = await this.stripeClient.billingPortal.sessions.create(
      {
        customer: checkoutSession.customer as string,
        return_url: 'http://localhost:3000/success',
      },
    )

    console.log(portalSession)

    return right({ redirectUrl: portalSession.url })
  }
}
