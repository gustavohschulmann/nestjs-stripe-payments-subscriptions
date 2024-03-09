import { Body, Controller, Post } from '@nestjs/common'
import { CheckoutPlayerUseCase } from 'src/domain/application/use-cases/checkout-player'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const checkoutBodySchema = z.object({
  plan: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(checkoutBodySchema)

type CheckoutBodySchema = z.infer<typeof checkoutBodySchema>

@Controller('/checkout')
export class CheckoutController {
  constructor(private readonly checkoutPlayer: CheckoutPlayerUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CheckoutBodySchema) {
    const { plan } = body
    return this.checkoutPlayer.execute({ plan })
  }
}
