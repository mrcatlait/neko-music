export const Permissions = {
  Track: {
    Read: 'track.read',
    Write: 'track.write',
    Download: 'track.download',
  },
  Library: {
    Read: 'library.read',
    Write: 'library.write',
  },
  Playlist: {
    Read: 'playlist.read',
    Write: 'playlist.write',
    Follow: 'playlist.follow',
  },
  Genre: {
    Read: 'genre.read',
    Write: 'genre.write',
  },
  Album: {
    Read: 'album.read',
    Write: 'album.write',
    Download: 'album.download',
  },
  Artist: {
    Read: 'artist.read',
    Write: 'artist.write',
    Manage: 'artist.manage',
    ManageAll: 'artist.manage.all',
    Follow: 'artist.follow',
  },
  User: {
    Read: 'user.read',
    Write: 'user.write',
  },
  Import: {
    Read: 'import.read',
    Write: 'import.write',
    Review: 'import.review',
    Promote: 'import.promote',
    Retry: 'import.retry',
    Manage: 'import.manage',
  },
} as const

export const getAllPermissions = (): string[] => {
  const allPermissions: string[] = []

  for (const permissionScope of Object.keys(Permissions) as Array<keyof typeof Permissions>) {
    const scopedPermissions = Permissions[permissionScope]

    for (const permissionName of Object.keys(scopedPermissions) as Array<keyof typeof scopedPermissions>) {
      allPermissions.push(scopedPermissions[permissionName])
    }
  }

  return allPermissions
}
