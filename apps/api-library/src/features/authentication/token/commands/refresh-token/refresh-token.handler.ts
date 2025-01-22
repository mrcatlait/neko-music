import { RefreshTokenCommand } from './refresh-token.command'
import { RefreshTokenValidator } from './refresh-token.validator'

import { Container } from '@common/di'
import { Handler } from '@common/models'
import { UnauthorizedError } from '@features/authentication/login/commands'
import { TokenPair } from '@features/authentication/shared/models'
import { RefreshTokenRepository } from '@features/authentication/shared/repositories'
import { TokenService } from '@features/authentication/shared/services'

export class RefreshTokenHandler implements Handler<RefreshTokenCommand, TokenPair> {
  private readonly tokenService: TokenService
  private readonly refreshTokenValidator: RefreshTokenValidator
  private readonly refreshTokenRepository: RefreshTokenRepository

  constructor() {
    this.tokenService = Container.get(TokenService)
    this.refreshTokenValidator = Container.get(RefreshTokenValidator)
    this.refreshTokenRepository = Container.get(RefreshTokenRepository)
  }

  async handle(command: RefreshTokenCommand): Promise<TokenPair> {
    const validationResult = await this.refreshTokenValidator.validate(command)

    if (!validationResult.isValid) {
      throw new UnauthorizedError()
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
