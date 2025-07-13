import { AlbumType } from '../enums'

export interface AlbumEntity {
  id: string
  title: string
  release_date: Date
  explicit: boolean
  type: AlbumType
  artwork: {
    url: string
    background_color: string
    text_color: string
  }
  metadata: {
    editorial_notes: {
      short: string
      standard: string
    }
  }
  created_at: Date
  updated_at: Date
}
