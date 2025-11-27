import { Permissions } from '@neko/permissions'
import { genSaltSync, hashSync } from 'bcrypt'

import { app } from '../test-setup'

import { LoginUseCase, LoginUseCaseResult } from '@/modules/auth/use-cases'
import {
  PermissionRepository,
  RolePermissionRepository,
  RoleRepository,
  UserAccountRepository,
  UserCredentialsRepository,
} from '@/modules/auth/repositories'
import { ConfigService } from '@/modules/config/services'

interface CreateUserOptions {
  withPermissions?: string[]
  withoutPermissions?: string[]
}

const defaultPermissions = [
  Permissions.Album.Read,
  Permissions.Album.Write,
  Permissions.Album.Download,
  Permissions.Artist.Read,
  Permissions.Artist.Write,
  Permissions.Artist.Manage,
  Permissions.Artist.ManageAll,
  Permissions.Artist.Follow,
  Permissions.Genre.Read,
  Permissions.Genre.Write,
  Permissions.Library.Read,
  Permissions.Library.Write,
  Permissions.Playlist.Read,
  Permissions.Playlist.Write,
  Permissions.Playlist.Follow,
  Permissions.Track.Read,
  Permissions.Track.Write,
  Permissions.Track.Download,
  Permissions.User.Read,
  Permissions.User.Write,
]

const generateRandomName = () => `test-${Math.random().toString(36).substring(7)}`

export const createUser = async (options?: CreateUserOptions): Promise<LoginUseCaseResult> => {
  const email = `${generateRandomName()}@example.com`
  const password = 'TestPassword123!'

  let permissions: string[] = [...defaultPermissions]

  if (options?.withPermissions) {
    permissions = [...permissions, ...options.withPermissions]
  }

  if (options?.withoutPermissions?.length) {
    permissions = permissions.filter((permission) => !options.withoutPermissions?.includes(permission))
  }

  const permissionEntities = await app.get(PermissionRepository).findManyByName(permissions)

  const role = { name: generateRandomName(), description: 'Test Role' }

  const roleEntity = await app.get(RoleRepository).create({ ...role, default: false })

  console.log('roleEntity', roleEntity)
  console.log('permissionEntities', permissionEntities)

  await app
    .get(RolePermissionRepository)
    .createMany(permissionEntities.map((permission) => ({ roleId: roleEntity.id, permissionId: permission.id })))

  const userAccount = await app
    .get(UserAccountRepository)
    .create({ emailAddress: email, roleId: roleEntity.id, verified: false })

  const saltRounds = app.get(ConfigService).config.SALT_ROUNDS
  const passwordSalt = genSaltSync(saltRounds)
  const passwordHash = hashSync(password, passwordSalt)

  await app
    .get(UserCredentialsRepository)
    .create({ userId: userAccount.id, passwordHash: passwordHash, passwordSalt: passwordSalt })

  return app.get(LoginUseCase).invoke({
    email,
    password,
  })
}
