import { Container } from '@common/di'
import { RefreshTokenRepository } from '@features/authentication/shared/repositories'

export class CleanupExpiredRefreshTokensCron {
  private readonly refreshTokenRepository: RefreshTokenRepository

  constructor() {
    this.refreshTokenRepository = Container.get(RefreshTokenRepository)
  }

  async execute(): Promise<void> {
    const now = new Date()
    await this.refreshTokenRepository.deleteExpired(now)
  }
}
