import { Injectable } from '@nestjs/common'

import { CreateTokenPairCommand, CreateTokenPairCommandResult } from './create-token-pair.command'
import { TokenService } from '../../../shared/services'

import { Handler } from '@modules/shared/models'

@Injectable()
export class CreateTokenPairHandler implements Handler<CreateTokenPairCommand, CreateTokenPairCommandResult> {
  constructor(private readonly tokenService: TokenService) {}

  handle(command: CreateTokenPairCommand): Promise<CreateTokenPairCommandResult> {
    return this.tokenService.createTokenPair(command.userId)
  }
}
