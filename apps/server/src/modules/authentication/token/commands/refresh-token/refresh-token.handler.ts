import { ForbiddenException, Injectable } from '@nestjs/common'

import { RefreshTokenCommand } from './refresh-token.command'
import { RefreshTokenValidator } from './refresh-token.validator'
import { TokenPair } from '../../../shared/models'
import { RefreshTokenRepository } from '../../../shared/repositories'
import { TokenService } from '../../../shared/services'

import { Handler } from '@modules/shared/models'

@Injectable()
export class RefreshTokenHandler implements Handler<RefreshTokenCommand, TokenPair> {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenValidator: RefreshTokenValidator,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async handle(command: RefreshTokenCommand): Promise<TokenPair> {
    const validationResult = await this.refreshTokenValidator.validate(command)

    if (!validationResult.isValid) {
      throw new ForbiddenException()
    }

    // Potentially could execute after the token pair is created
    await this.refreshTokenRepository.insert({
      refresh_token: command.token,
      expires_at: new Date(command.jwtPayload.exp),
      user_id: command.jwtPayload.sub,
    })

    return this.tokenService.createTokenPair(command.jwtPayload.sub)
  }
}
