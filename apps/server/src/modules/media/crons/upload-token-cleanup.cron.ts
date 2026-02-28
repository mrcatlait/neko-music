import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { UploadTokenService } from '../services'

@Injectable()
export class UploadTokenCleanupCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly uploadTokenService: UploadTokenService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.uploadTokenService.deleteExpired()
    this.logger.debug(`Deleted expired upload tokens`)
  }
}
