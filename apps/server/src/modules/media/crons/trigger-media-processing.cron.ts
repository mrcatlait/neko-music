import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ProcessingRunnerService } from '../services'

@Injectable()
export class TriggerMediaProcessingCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly processingRunnerService: ProcessingRunnerService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron(): void {
    this.logger.debug('Triggering media processing')
    this.processingRunnerService.next()
  }
}
