import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { MediaProcessingService } from '../services'

@Injectable()
export class TriggerMediaProcessingCron {
  constructor(private readonly mediaProcessingService: MediaProcessingService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron(): void {
    this.mediaProcessingService.next()
  }
}
