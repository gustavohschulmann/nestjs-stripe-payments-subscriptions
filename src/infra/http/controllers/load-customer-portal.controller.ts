import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { LoadCustomerPortalUseCase } from 'src/domain/application/use-cases/load-customer-portal'

const loadcustomerportalBodySchema = z.object({
  sessionId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(loadcustomerportalBodySchema)

type LoadCustomerPortalBodySchema = z.infer<typeof loadcustomerportalBodySchema>

@Controller('/customer-portal')
export class LoadCustomerPortalController {
  constructor(private readonly loadCustomerPortal: LoadCustomerPortalUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: LoadCustomerPortalBodySchema) {
    const { sessionId } = body
    return this.loadCustomerPortal.execute({ sessionId })
  }
}
