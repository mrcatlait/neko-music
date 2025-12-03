import { Generated } from 'kysely'

export interface PermissionTable {
  id: Generated<string>
  name: string
  description: string
}

export interface RoleTable {
  id: Generated<string>
  name: string
  description: string
  default: boolean
}

export interface RolePermissionTable {
  roleId: string
  permissionId: string
}

export interface AccountTable {
  id: Generated<string>
  emailAddress: string
  roleId: string
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
  'auth.Permission': PermissionTable
  'auth.Role': RoleTable
  'auth.RolePermission': RolePermissionTable
  'auth.Account': AccountTable
  'auth.Credentials': CredentialsTable
  'auth.ExternalProvider': ExternalProviderTable
  'auth.RefreshToken': RefreshTokenTable
}
