import { Injectable } from '@nestjs/common'
import { CronExpression, Cron } from '@nestjs/schedule'

import { RefreshTokenRepository } from '../repositories'

@Injectable()
export class CleanupExpiredRefreshTokensCron {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron(): Promise<void> {
    return this.refreshTokenRepository.deleteExpired()
  }
}
