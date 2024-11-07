import { MigrationInterface } from 'typeorm'

import { CreateExtensions1000000000010 } from './1000000000010-CreateExtensions'
import { CreateArtistTable1000000000020 } from './1000000000020-CreateArtistTable'
import { CreateArtistImageTable1000000000030 } from './1000000000030-CreateArtistImageTable'
import { CreateAlbumTable1000000000040 } from './1000000000040-CreateAlbumTable'
import { CreateAlbumImageTable1000000000050 } from './1000000000050-CreateAlbumImageTable'
import { CreateTrackTable1000000000060 } from './1000000000060-CreateTrackTable'
import { CreateTrackImageTable1000000000070 } from './1000000000070-CreateTrackImageTable'
import { CreateGenreTable1000000000080 } from './1000000000080-CreateGenreTable'
import { CreateTrackGenreTable1000000000090 } from './1000000000090-CreateTrackGenreTable'
import { CreateTrackArtistTable1000000000100 } from './1000000000100-CreateTrackArtistTable'
import { CreatePermissionTable1000000000110 } from './1000000000110-CreatePermissionTable'
import { CreateUserRoleTable1000000000120 } from './1000000000120-CreateUserRoleTable'
import { CreateGrantedPermissionTable1000000000130 } from './1000000000130-CreateGrantedPermissionTable'
import { CreateUserAccountTable1000000000140 } from './1000000000140-CreateUserAccountTable'
import { CreateUserLoginDataTable1000000000150 } from './1000000000150-CreateUserLoginDataTable'
import { CreatePlaylistTable1000000000160 } from './1000000000160-CreatePlaylistTable'
import { CreatePlaylistTrackTable1000000000170 } from './1000000000170-CreatePlaylistTrackTable'
import { CreatePermissions1000000000180 } from './1000000000180-CreatePermissions'
import { CreateRoles1000000000190 } from './1000000000190-CreateRoles'
import { GrantPermissions1000000000200 } from './1000000000200-GrantPermissions'

export type MigrationClass = new () => MigrationInterface

export const migrations: MigrationClass[] = [
  CreateExtensions1000000000010,
  CreateArtistTable1000000000020,
  CreateArtistImageTable1000000000030,
  CreateAlbumTable1000000000040,
  CreateAlbumImageTable1000000000050,
  CreateTrackTable1000000000060,
  CreateTrackImageTable1000000000070,
  CreateGenreTable1000000000080,
  CreateTrackGenreTable1000000000090,
  CreateTrackArtistTable1000000000100,
  CreatePermissionTable1000000000110,
  CreateUserRoleTable1000000000120,
  CreateGrantedPermissionTable1000000000130,
  CreateUserAccountTable1000000000140,
  CreateUserLoginDataTable1000000000150,
  CreatePlaylistTable1000000000160,
  CreatePlaylistTrackTable1000000000170,
  CreatePermissions1000000000180,
  CreateRoles1000000000190,
  GrantPermissions1000000000200,
]
