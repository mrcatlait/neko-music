import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { MediaProcessingService } from '../services'

@Injectable()
export class TriggerMediaProcessingCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly mediaProcessingService: MediaProcessingService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron(): void {
    this.logger.debug('Triggering media processing')
    this.mediaProcessingService.next()
  }
}
