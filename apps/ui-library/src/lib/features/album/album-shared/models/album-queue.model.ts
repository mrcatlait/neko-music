import type { Album, Artist, Track } from '@/shared/entities'
import { Queue, type QueueMetadata } from '@/shared/models'

export interface AlbumQueueOptionsWithId {
  albumId: string
  album?: never
  tracks?: never
}

export interface AlbumQueueOptionsWithAlbum {
  albumId?: never
  album: Album
  tracks?: Track[]
}

export type AlbumQueueOptions = AlbumQueueOptionsWithId | AlbumQueueOptionsWithAlbum

export class AlbumQueue extends Queue<AlbumQueueOptions> {
  get id(): string {
    return this.options.album?.id ?? this.options.albumId ?? ''
  }

  async fetchTracks(): Promise<Track[]> {
    if (this.options.tracks) {
      return this.options.tracks
    }

    const response = await fetch(`/api/albums/${this.options.albumId}/tracks`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  }

  async fetchMetadata(): Promise<QueueMetadata> {
    // If album data is provided, use it directly
    if (this.options.album) {
      return {
        name: this.options.album.title,
        description: `Album by ${this.options.album.artists.map((a) => a.name).join(', ')}`,
        type: 'album',
      }
    }

    // Otherwise, fetch album metadata
    const response = await fetch(`/api/albums/${this.options.albumId}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const album = await response.json()

    return {
      name: album.title,
      description: `Album by ${album.artists.map((a: Artist) => a.name).join(', ')}`,
      type: 'album',
    }
  }
}
