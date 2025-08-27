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
    Follow: 'artist.follow',
  },
  User: {
    Read: 'user.read',
    Write: 'user.write',
  },
} as const
