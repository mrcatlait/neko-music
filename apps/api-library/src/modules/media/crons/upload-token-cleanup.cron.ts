import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { UploadTokenRepository } from '@modules/media/repositories'

@Injectable()
export class UploadTokenCleanupCron {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date()
    const expiredTokens = await this.uploadTokenRepository.findExpiredTokens(now)

    for (const token of expiredTokens) {
      await this.uploadTokenRepository.delete(token.id)
    }

    this.logger.debug(`Deleted ${expiredTokens.length} expired upload tokens`)
  }
}
