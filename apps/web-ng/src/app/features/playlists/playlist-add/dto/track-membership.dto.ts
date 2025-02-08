export interface TrackMembershipDto {
  id: string
  name: string
  membership: {
    existing: boolean
  }
}
