import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ImportRunnerService } from '../services'

@Injectable()
export class TriggerImportRunnerCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly importRunnerService: ImportRunnerService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron(): void {
    this.logger.debug('Triggering import runner')
    this.importRunnerService.next()
  }
}
