export const ARTIST_ROLES = {
  Primary: 'Primary',
  Featuring: 'Featuring',
  Remixer: 'Remixer'
} as const;

export type ArtistRole = typeof ARTIST_ROLES[keyof typeof ARTIST_ROLES];