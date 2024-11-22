import { v10_CreateArtistTable } from './v10_CreateArtistTable'
import { v20_CreateArtistImageTable } from './v20_CreateArtistImageTable'
import { v30_CreateAlbumTable } from './v30_CreateAlbumTable'
import { v40_CreateAlbumImageTable } from './v40_CreateAlbumImageTable'
import { v50_CreateTrackTable } from './v50_CreateTrackTable'
import { v60_CreateTrackImageTable } from './v60_CreateTrackImageTable'
import { v70_CreateGenreTable } from './v70_CreateGenreTable'
import { v80_CreateTrackGenreTable } from './v80_CreateTrackGenreTable'
import { v90_CreateTrackArtistTable } from './v90_CreateTrackArtistTable'
import { v100_CreatePermissionTable } from './v100_CreatePermissionTable'
import { v110_CreateUserRoleTable } from './v110_CreateUserRoleTable'
import { v120_CreateGrantedPermissionTable } from './v120_CreateGrantedPermissionTable'
import { v130_CreateUserAccountTable } from './v130_CreateUserAccountTable'
import { v140_CreateUserLoginDataTable } from './v140_CreateUserLoginDataTable'
import { v150_CreatePlaylistTable } from './v150_CreatePlaylistTable'
import { v160_CreatePlaylistTrackTable } from './v160_CreatePlaylistTrackTable'
import { v170_CreatePlaylistImageTable } from './v170_CreatePlaylistImageTable'
import { v180_AddPermissions } from './v180_AddPermissions'
import { v190_CreateRoles } from './v190_CreateRoles'
import { v200_GrantPermissions } from './v200_GrantPermissions'

export const migrations = [
  v10_CreateArtistTable,
  v20_CreateArtistImageTable,
  v30_CreateAlbumTable,
  v40_CreateAlbumImageTable,
  v50_CreateTrackTable,
  v60_CreateTrackImageTable,
  v70_CreateGenreTable,
  v80_CreateTrackGenreTable,
  v90_CreateTrackArtistTable,
  v100_CreatePermissionTable,
  v110_CreateUserRoleTable,
  v120_CreateGrantedPermissionTable,
  v130_CreateUserAccountTable,
  v140_CreateUserLoginDataTable,
  v150_CreatePlaylistTable,
  v160_CreatePlaylistTrackTable,
  v170_CreatePlaylistImageTable,
  v180_AddPermissions,
  v190_CreateRoles,
  v200_GrantPermissions,
]
