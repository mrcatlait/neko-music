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

export interface UserAccountTable {
  id: Generated<string>
  emailAddress: string
  roleId: string
  verified: boolean
}

export interface UserCredentialsTable {
  userId: string
  passwordHash: string
  passwordSalt: string
}

export interface UserExternalProviderTable {
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
  'auth.UserAccount': UserAccountTable
  'auth.UserCredentials': UserCredentialsTable
  'auth.UserExternalProvider': UserExternalProviderTable
  'auth.RefreshToken': RefreshTokenTable
}
