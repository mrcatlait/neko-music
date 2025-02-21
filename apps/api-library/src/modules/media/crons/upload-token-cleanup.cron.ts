import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { UploadTokenRepository } from '@modules/media/repositories'

@Injectable()
export class UploadTokenCleanupCron {
  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date()
    const expiredTokens = await this.uploadTokenRepository.findExpiredTokens(now)

    for (const token of expiredTokens) {
      await this.uploadTokenRepository.delete(token.id)
    }
  }
}
