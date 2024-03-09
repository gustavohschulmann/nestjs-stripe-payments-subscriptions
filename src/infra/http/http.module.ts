import { Module } from '@nestjs/common'
import { CheckoutController } from './controllers/checkout.controller'
import { CheckoutPlayerUseCase } from 'src/domain/application/use-cases/checkout-player'
import { StripeModule } from '@golevelup/nestjs-stripe'
import { LoadCustomerPortalController } from './controllers/load-customer-portal.controller'
import { LoadCustomerPortalUseCase } from 'src/domain/application/use-cases/load-customer-portal'
import { StripeSubscriptionWebhookController } from './controllers/stripe-subscription-webhook.controller'
import { StripeSubscriptionWebhookUseCase } from 'src/domain/application/use-cases/stripe-subscription-webhook'

@Module({
  imports: [
    StripeModule.forRoot(StripeModule, {
      apiKey: 'sk_test_1234',
      webhookConfig: {
        stripeSecrets: {
          account: 'abc',
          connect: 'cba',
        },
      },
    }),
  ],
  controllers: [
    CheckoutController,
    LoadCustomerPortalController,
    StripeSubscriptionWebhookController,
  ],
  providers: [
    CheckoutPlayerUseCase,
    LoadCustomerPortalUseCase,
    StripeSubscriptionWebhookUseCase,
  ],
})
export class HttpModule {}
