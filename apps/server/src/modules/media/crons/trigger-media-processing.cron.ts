import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ProcessingPipelineService } from '../services'

@Injectable()
export class TriggerMediaProcessingCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly processingPipelineService: ProcessingPipelineService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron(): void {
    this.logger.debug('Triggering media processing')
    this.processingPipelineService.next()
  }
}
