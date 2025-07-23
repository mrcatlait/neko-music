import { ProcessingStatus } from '../enums'

export interface ArtistArtworkEntity {
  id: string
  artistId: string
  backgroundColor: string
  textColor: string
  processingStatus: ProcessingStatus
  processingAttempts: number
  processingError: string
}
