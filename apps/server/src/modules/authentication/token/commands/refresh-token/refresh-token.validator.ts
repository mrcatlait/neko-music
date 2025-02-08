import { Injectable } from '@nestjs/common'

import { RefreshTokenCommand } from './refresh-token.command'
import { RefreshTokenRepository } from '../../../shared/repositories'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class RefreshTokenValidator implements Validator<RefreshTokenCommand> {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

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
