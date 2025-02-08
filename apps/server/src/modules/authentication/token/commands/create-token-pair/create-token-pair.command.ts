import { TokenPair } from '../../../shared/models'

export interface CreateTokenPairCommand {
  userId: string
}

export type CreateTokenPairCommandResult = TokenPair
