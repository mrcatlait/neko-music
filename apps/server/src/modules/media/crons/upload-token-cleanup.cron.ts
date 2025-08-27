import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { UploadTokenRepository } from '../repositories'

@Injectable()
export class UploadTokenCleanupCron {
  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron(): Promise<void> {
    return this.uploadTokenRepository.deleteExpiredTokens()
  }
}
