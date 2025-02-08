import { TokenPair } from '../../../shared/models'

export interface LoginCommand {
  email: string
  password: string
}

export type LoginCommandResult = TokenPair
