import { RefreshTokenCommand } from './refresh-token.command'

import { RefreshTokenRepository } from '@features/authentication/shared/repositories'
import { ValidationResult, Validator } from '@common/models'
import { Container } from '@common/di'

export class RefreshTokenValidator implements Validator<RefreshTokenCommand> {
  private readonly refreshTokenRepository: RefreshTokenRepository

  constructor() {
    this.refreshTokenRepository = Container.get(RefreshTokenRepository)
  }

  async validate(command: RefreshTokenCommand): Promise<ValidationResult> {
    const isDecommissioned = await this.refreshTokenRepository.findOneByToken(command.token)

    if (isDecommissioned) {
      return {
        isValid: false,
        errors: ['Refresh token has already been used'],
      }
    }

    return {
      isValid: true,
    }
  }
}
