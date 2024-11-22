export interface PlaylistMembership {
  id: string
  name: string
  membership: {
    total: number
    existing: number
  }
}
