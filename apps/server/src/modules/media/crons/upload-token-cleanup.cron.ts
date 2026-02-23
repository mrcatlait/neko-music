import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { MediaRepository } from '../repositories'

@Injectable()
export class UploadTokenCleanupCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly mediaRepository: MediaRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.mediaRepository.deleteExpiredUploadTokens()
    this.logger.debug(`Deleted expired upload tokens`)
  }
}
