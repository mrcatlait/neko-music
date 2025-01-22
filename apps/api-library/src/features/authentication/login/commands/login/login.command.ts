import { TokenPair } from '@features/authentication/shared/models'

export interface LoginCommand {
  email: string
  password: string
}

export type LoginCommandResult = TokenPair
