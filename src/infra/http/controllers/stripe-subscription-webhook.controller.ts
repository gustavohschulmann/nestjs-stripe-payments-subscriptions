import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common'
import { StripeSubscriptionWebhookUseCase } from 'src/domain/application/use-cases/stripe-subscription-webhook'

@Controller('/webhook')
export class StripeSubscriptionWebhookController {
  constructor(
    private readonly stripeSubscriptionWebhook: StripeSubscriptionWebhookUseCase,
  ) {}

  @Post()
  async handle(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.stripeSubscriptionWebhook.execute({
      payload: req,
      signature: sig,
    })
  }
}
