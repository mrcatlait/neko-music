import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { UploadTokenRepository } from '../repositories'

@Injectable()
export class UploadTokenCleanupCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.uploadTokenRepository.deleteExpiredTokens()
    this.logger.debug(`Deleted expired upload tokens`)
  }
}
