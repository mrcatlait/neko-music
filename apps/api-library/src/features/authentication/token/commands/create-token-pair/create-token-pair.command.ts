import { TokenPair } from '@features/authentication/shared/models'

export interface CreateTokenPairCommand {
  userId: string
}

export type CreateTokenPairCommandResult = TokenPair
