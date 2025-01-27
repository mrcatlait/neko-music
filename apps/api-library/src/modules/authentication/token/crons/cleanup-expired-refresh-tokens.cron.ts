import { Injectable } from '@nestjs/common'

import { RefreshTokenRepository } from '../../shared/repositories'

@Injectable()
export class CleanupExpiredRefreshTokensCron {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async execute(): Promise<void> {
    const now = new Date()
    return Promise.resolve()
    // await this.refreshTokenRepository.deleteExpired(now)
  }
}
