export interface DiscoverTrack {
  sourceItemRef: string
  label: string
}

export interface DiscoverResult {
  sourceRef: string
  label: string
  tracks: DiscoverTrack[]
}
