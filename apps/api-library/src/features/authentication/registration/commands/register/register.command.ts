import { TokenPair } from '@features/authentication/shared/models'

export interface RegisterCommand {
  email: string
  password: string
}

export type RegisterCommandResult = TokenPair
