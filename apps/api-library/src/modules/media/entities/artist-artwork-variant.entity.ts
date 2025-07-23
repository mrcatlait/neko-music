import { ArtworkSize, StorageProvider } from '../enums'

export interface ArtistArtworkVariantEntity {
  id: string
  artistArtworkId: string
  format: string
  storageProvider: StorageProvider
  storagePath: string
  publicUrl: string
  size: ArtworkSize
  fileSize: number
  fileHash: string
}
