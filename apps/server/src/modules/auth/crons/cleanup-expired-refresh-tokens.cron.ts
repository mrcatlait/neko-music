import { Injectable } from '@nestjs/common'
import { CronExpression, Cron } from '@nestjs/schedule'

import { AuthRepository } from '../repositories'

@Injectable()
export class CleanupExpiredRefreshTokensCron {
  constructor(private readonly authRepository: AuthRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron(): Promise<void> {
    return this.authRepository.deleteExpiredRefreshTokens()
  }
}
