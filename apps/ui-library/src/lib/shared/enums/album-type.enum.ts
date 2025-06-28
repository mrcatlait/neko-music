export const ALBUM_TYPES = {
  Album: 'Album',
  Single: 'Single',
  Compilation: 'Compilation',
  EP: 'EP',
  Other: 'Other',
} as const

export type AlbumType = (typeof ALBUM_TYPES)[keyof typeof ALBUM_TYPES]
