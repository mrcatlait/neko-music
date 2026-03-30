export interface Artist {
  id: string
  name: string
  verified: boolean
  artwork?: {
    url: string
  }
  mediaStatus: string
  status: string
}
