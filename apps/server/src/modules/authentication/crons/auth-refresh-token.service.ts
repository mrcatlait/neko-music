import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThanOrEqual, Repository } from 'typeorm'
import { Cron, CronExpression } from '@nestjs/schedule'

import { RefreshTokenEntity } from '../entities'

@Injectable()
export class RefreshTokenCron {
  private readonly logger = new Logger(RefreshTokenCron.name)

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredRefreshTokens() {
    await this.refreshTokenRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    })

    this.logger.log('Refresh tokens have been cleared')
  }
}
