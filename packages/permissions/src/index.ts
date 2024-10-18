export enum PermissionType {
  PUBLIC = 'public',
  PROTECTED = 'protected',
}

export enum PermissionAction {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  FOLLOW = 'follow',
  DOWNLOAD = 'download',
}

export enum PermissionGroup {
  TRACK = 'track',
  LIBRARY = 'library',
  PLAYLIST = 'playlist',
  ALBUM = 'album',
  ARTIST = 'artist',
  USER = 'user',
}

type PermissionName = `${Capitalize<PermissionGroup>}${Capitalize<PermissionAction>}`

type PermissionList = {
  [key in PermissionName]: {
    action: PermissionAction
    group: PermissionGroup
    type: PermissionType
  }
}

export const Permission = {
  // Track permissions
  TrackRead: {
    action: PermissionAction.READ,
    group: PermissionGroup.TRACK,
    type: PermissionType.PUBLIC,
  },
  TrackCreate: {
    action: PermissionAction.CREATE,
    group: PermissionGroup.TRACK,
    type: PermissionType.PROTECTED,
  },
  TrackUpdate: {
    action: PermissionAction.UPDATE,
    group: PermissionGroup.TRACK,
    type: PermissionType.PROTECTED,
  },
  TrackDelete: {
    action: PermissionAction.DELETE,
    group: PermissionGroup.TRACK,
    type: PermissionType.PROTECTED,
  },
  TrackDownload: {
    action: PermissionAction.DOWNLOAD,
    group: PermissionGroup.TRACK,
    type: PermissionType.PROTECTED,
  },

  // Library permissions
  LibraryRead: {
    action: PermissionAction.READ,
    group: PermissionGroup.LIBRARY,
    type: PermissionType.PROTECTED,
  },
  LibraryUpdate: {
    action: PermissionAction.UPDATE,
    group: PermissionGroup.LIBRARY,
    type: PermissionType.PROTECTED,
  },

  // Playlist permissions
  PlaylistRead: {
    action: PermissionAction.READ,
    group: PermissionGroup.PLAYLIST,
    type: PermissionType.PUBLIC,
  },
  PlaylistCreate: {
    action: PermissionAction.CREATE,
    group: PermissionGroup.PLAYLIST,
    type: PermissionType.PROTECTED,
  },
  PlaylistUpdate: {
    action: PermissionAction.UPDATE,
    group: PermissionGroup.PLAYLIST,
    type: PermissionType.PROTECTED,
  },
  PlaylistDelete: {
    action: PermissionAction.DELETE,
    group: PermissionGroup.PLAYLIST,
    type: PermissionType.PROTECTED,
  },
  PlaylistFollow: {
    action: PermissionAction.FOLLOW,
    group: PermissionGroup.PLAYLIST,
    type: PermissionType.PROTECTED,
  },

  // Album permissions
  AlbumRead: {
    action: PermissionAction.READ,
    group: PermissionGroup.ALBUM,
    type: PermissionType.PUBLIC,
  },
  AlbumCreate: {
    action: PermissionAction.CREATE,
    group: PermissionGroup.ALBUM,
    type: PermissionType.PROTECTED,
  },
  AlbumUpdate: {
    action: PermissionAction.UPDATE,
    group: PermissionGroup.ALBUM,
    type: PermissionType.PROTECTED,
  },
  AlbumDelete: {
    action: PermissionAction.DELETE,
    group: PermissionGroup.ALBUM,
    type: PermissionType.PROTECTED,
  },
  AlbumDownload: {
    action: PermissionAction.DOWNLOAD,
    group: PermissionGroup.ALBUM,
    type: PermissionType.PROTECTED,
  },

  // Artist permissions
  ArtistRead: {
    action: PermissionAction.READ,
    group: PermissionGroup.ARTIST,
    type: PermissionType.PUBLIC,
  },
  ArtistCreate: {
    action: PermissionAction.CREATE,
    group: PermissionGroup.ARTIST,
    type: PermissionType.PROTECTED,
  },
  ArtistUpdate: {
    action: PermissionAction.UPDATE,
    group: PermissionGroup.ARTIST,
    type: PermissionType.PROTECTED,
  },
  ArtistDelete: {
    action: PermissionAction.DELETE,
    group: PermissionGroup.ARTIST,
    type: PermissionType.PROTECTED,
  },
  ArtistFollow: {
    action: PermissionAction.FOLLOW,
    group: PermissionGroup.ARTIST,
    type: PermissionType.PROTECTED,
  },

  // User permissions
  UserRead: {
    action: PermissionAction.READ,
    group: PermissionGroup.USER,
    type: PermissionType.PROTECTED,
  },
  UserCreate: {
    action: PermissionAction.CREATE,
    group: PermissionGroup.USER,
    type: PermissionType.PROTECTED,
  },
  UserUpdate: {
    action: PermissionAction.UPDATE,
    group: PermissionGroup.USER,
    type: PermissionType.PROTECTED,
  },
  UserDelete: {
    action: PermissionAction.DELETE,
    group: PermissionGroup.USER,
    type: PermissionType.PROTECTED,
  },
} as const satisfies Partial<PermissionList>

export type Permission = (typeof Permission)[keyof typeof Permission]

export const getPermissionId = (permission: Permission): string => `${permission.action}:${permission.group}`
