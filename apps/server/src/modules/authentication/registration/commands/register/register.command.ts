import { TokenPair } from '../../../shared/models'

export interface RegisterCommand {
  email: string
  password: string
}

export type RegisterCommandResult = TokenPair
