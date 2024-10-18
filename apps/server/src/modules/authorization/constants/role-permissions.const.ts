import { Permission } from '@neko/permissions'

import { Role } from './role.enum'

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.GUEST]: [Permission.TrackRead, Permission.PlaylistRead, Permission.AlbumRead, Permission.ArtistRead],
  [Role.USER]: [
    Permission.TrackRead,
    Permission.TrackDownload,
    Permission.LibraryRead,
    Permission.LibraryUpdate,
    Permission.PlaylistRead,
    Permission.PlaylistCreate,
    Permission.PlaylistUpdate,
    Permission.PlaylistDelete,
    Permission.PlaylistFollow,
    Permission.AlbumRead,
    Permission.AlbumDownload,
    Permission.ArtistRead,
    Permission.ArtistFollow,
    Permission.UserRead,
    Permission.UserUpdate,
  ],
  [Role.ADMIN]: Object.values(Permission),
}
