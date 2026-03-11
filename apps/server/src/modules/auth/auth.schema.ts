import { Generated } from 'kysely'

export interface AccountTable {
  id: Generated<string>
  emailAddress: string
  role: string
}

export interface CredentialsTable {
  userId: string
  passwordHash: string
  passwordSalt: string
}

/**
 * @todo Use either combination of user id and provider as PK or add id field
 */
export interface ExternalProviderTable {
  userId: string
  provider: string
  providerUserId: string
}

export interface RefreshTokenTable {
  id: Generated<string>
  userId: string
  token: string
  expiresAt: Date
}

export interface AuthSchema {
  'auth.Account': AccountTable
  'auth.Credentials': CredentialsTable
  'auth.ExternalProvider': ExternalProviderTable
  'auth.RefreshToken': RefreshTokenTable
}
