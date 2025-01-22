import { CreateTokenPairCommand, CreateTokenPairCommandResult } from './create-token-pair.command'

import { Handler } from '@common/models'
import { Container } from '@common/di'
import { TokenService } from '@features/authentication/shared/services'

export class CreateTokenPairHandler implements Handler<CreateTokenPairCommand, CreateTokenPairCommandResult> {
  private readonly tokenService: TokenService

  constructor() {
    this.tokenService = Container.get(TokenService)
  }

  handle(command: CreateTokenPairCommand): Promise<CreateTokenPairCommandResult> {
    return this.tokenService.createTokenPair(command.userId)
  }
}
