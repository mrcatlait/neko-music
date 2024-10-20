export enum Permission {
  // Track permissions
  TrackRead = 'track:read',
  TrackCreate = 'track:create',
  TrackUpdate = 'track:update',
  TrackDelete = 'track:delete',
  TrackDownload = 'track:download',

  // Library permissions
  LibraryRead = 'library:read',
  LibraryCreate = 'library:create',
  LibraryUpdate = 'library:update',
  LibraryDelete = 'library:delete',

  // Playlist permissions
  PlaylistRead = 'playlist:read',
  PlaylistCreate = 'playlist:create',
  PlaylistUpdate = 'playlist:update',
  PlaylistDelete = 'playlist:delete',
  PlaylistFollow = 'playlist:follow',

  // Album permissions
  AlbumRead = 'album:read',
  AlbumCreate = 'album:create',
  AlbumUpdate = 'album:update',
  AlbumDelete = 'album:delete',
  AlbumDownload = 'album:download',

  // Artist permissions
  ArtistRead = 'artist:read',
  ArtistCreate = 'artist:create',
  ArtistUpdate = 'artist:update',
  ArtistDelete = 'artist:delete',
  ArtistFollow = 'artist:follow',

  // User permissions
  UserRead = 'user:read',
  UserCreate = 'user:create',
  UserUpdate = 'user:update',
  UserDelete = 'user:delete',
}
